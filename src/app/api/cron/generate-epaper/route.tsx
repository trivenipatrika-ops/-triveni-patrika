import { NextRequest, NextResponse } from "next/server";
import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { writeClient } from "@/sanity/writeClient";
import { getDb } from "@/lib/mongodb";
import webpush from "@/lib/webPush";
import { urlFor } from "@/sanity/image";
import { buildEpaperHtml, renderEpaperPdf, type EpaperPost } from "@/lib/generateEpaperPdf";

export const runtime = "nodejs";
export const maxDuration = 60;

const BRAND_NAME = "त्रिवेणी पत्रिका";
const TAGLINE = "सच्ची खबर, सीधी बात";
const EDITION = "प्रयागराज संस्करण";

type RawPost = {
  title: string;
  excerpt?: string;
  category?: { title: string };
  mainImage?: any;
  isBreaking?: boolean;
};

async function fetchRecentPosts(hours: number): Promise<RawPost[]> {
  const since = new Date();
  since.setHours(since.getHours() - hours);
  return client.fetch(
    groq`*[_type == "post" && publishedAt >= $since] | order(isBreaking desc, isFeatured desc, publishedAt desc){
      title, excerpt, mainImage, isBreaking, category->{title}
    }`,
    { since: since.toISOString() }
  );
}

function toEpaperPost(p: RawPost, withImage = false): EpaperPost {
  return {
    title: p.title,
    excerpt: p.excerpt,
    categoryTitle: p.category?.title,
    isBreaking: p.isBreaking,
    imageUrl:
      withImage && p.mainImage
        ? urlFor(p.mainImage).width(700).height(420).fit("crop").url()
        : undefined,
  };
}

async function withRetry<T>(fn: () => Promise<T>, label: string): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    console.error(`Epaper: ${label} failed on first try, retrying:`, err?.message || err);
    await new Promise((r) => setTimeout(r, 800));
    return await fn();
  }
}

async function notifySubscribers(todayISO: string) {
  try {
    const db = await withRetry(() => getDb(), "MongoDB connect");
    const subscribers = await withRetry(
      () => db.collection("subscribers").find({}).toArray(),
      "MongoDB subscribers fetch"
    );
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://triveni-patrika.vercel.app";
    const payload = JSON.stringify({
      title: "📰 आज का ई-पेपर तैयार है",
      body: "त्रिवेणी पत्रिका का आज का पूरा अंक पढ़ने के लिए टैप करें",
      url: `${siteUrl}/epaper/${todayISO}`,
      tag: "epaper-daily",
      requireInteraction: true,
    });

    await Promise.all(
      subscribers.map(async (sub: any) => {
        try {
          await webpush.sendNotification(sub, payload);
        } catch (err: any) {
          if (err.statusCode === 404 || err.statusCode === 410) {
            await db.collection("subscribers").deleteOne({ _id: sub._id });
          }
        }
      })
    );
  } catch (notifyError: any) {
    console.error(
      "Epaper: notifySubscribers failed:",
      notifyError?.message || notifyError
    );
  }
}

function fallbackHtml(todayLabel: string) {
  return buildEpaperHtml({
    brandName: BRAND_NAME,
    tagline: TAGLINE,
    dateLabel: todayLabel,
    noteLine: "(सीमित संस्करण)",
    edition: EDITION,
    breakingTitles: [],
    lead: { title: `${BRAND_NAME} — ${todayLabel}` },
    rest: [],
  });
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "अनधिकृत" }, { status: 401 });
  }

  const todayISO = new Date().toISOString().slice(0, 10);
  const todayLabel = new Date().toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  try {
    let posts: RawPost[] = await fetchRecentPosts(24);
    let noteLine = "";

    if (posts.length === 0) {
      posts = await fetchRecentPosts(24 * 7);
      if (posts.length > 0) {
        noteLine = "(पिछले 7 दिनों की चुनिंदा खबरें)";
      }
    }

    if (posts.length === 0) {
      posts = await client.fetch(
        groq`*[_type == "post"] | order(isBreaking desc, isFeatured desc, publishedAt desc)[0...10]{
          title, excerpt, mainImage, isBreaking, category->{title}
        }`
      );
      if (posts.length > 0) {
        noteLine = "(हाल में नई खबर नहीं — पुरानी खबरों के साथ अंक)";
      }
    }

    let lead: EpaperPost;
    let rest: EpaperPost[] = [];
    let breakingTitles: string[] = [];

    if (posts.length > 0) {
      lead = toEpaperPost(posts[0], true);
      rest = posts.slice(1).map((p) => toEpaperPost(p));
      breakingTitles = posts
        .filter((p) => p.isBreaking)
        .slice(0, 6)
        .map((p) => p.title);
    } else {
      lead = {
        title: "त्रिवेणी पत्रिका जल्द शुरू हो रही है",
        excerpt: "यहां जल्द ही ताज़ा खबरें प्रकाशित की जाएंगी।",
      };
      noteLine = "(स्वागत अंक)";
    }

    let pdfBuffer: Buffer;
    try {
      const html = buildEpaperHtml({
        brandName: BRAND_NAME,
        tagline: TAGLINE,
        dateLabel: todayLabel,
        noteLine: noteLine || undefined,
        edition: EDITION,
        breakingTitles,
        lead,
        rest,
      });
      pdfBuffer = await renderEpaperPdf(html);
    } catch (renderError: any) {
      console.error(
        "Epaper: main PDF render failed, using fallback:",
        renderError?.message || renderError
      );
      pdfBuffer = await renderEpaperPdf(fallbackHtml(todayLabel));
    }

    const uploadedAsset = await writeClient.assets.upload("file", pdfBuffer, {
      filename: `triveni-patrika-${todayISO}.pdf`,
      contentType: "application/pdf",
    });

    const existing = await client.fetch(
      groq`*[_type == "epaper" && date == $date][0]{ _id }`,
      { date: todayISO }
    );

    if (existing?._id) {
      await writeClient
        .patch(existing._id)
        .set({
          title: `त्रिवेणी पत्रिका — ${todayLabel}`,
          pdfFile: {
            _type: "file",
            asset: { _type: "reference", _ref: uploadedAsset._id },
          },
          generatedAutomatically: true,
        })
        .commit();
    } else {
      await writeClient.create({
        _type: "epaper",
        date: todayISO,
        title: `त्रिवेणी पत्रिका — ${todayLabel}`,
        pdfFile: {
          _type: "file",
          asset: { _type: "reference", _ref: uploadedAsset._id },
        },
        generatedAutomatically: true,
      });
    }

    await notifySubscribers(todayISO);

    return NextResponse.json({
      success: true,
      date: todayISO,
      postsUsed: posts.length,
      note: noteLine || undefined,
    });
  } catch (error: any) {
    console.error(
      "Epaper: main flow failed, trying fallback edition:",
      error?.message || error,
      error?.stack || ""
    );

    try {
      const buffer = await renderEpaperPdf(fallbackHtml(todayLabel));
      const uploadedAsset = await writeClient.assets.upload("file", buffer, {
        filename: `triveni-patrika-${todayISO}-fallback.pdf`,
        contentType: "application/pdf",
      });
      await writeClient.create({
        _type: "epaper",
        date: todayISO,
        title: `त्रिवेणी पत्रिका — ${todayLabel} (सीमित संस्करण)`,
        pdfFile: {
          _type: "file",
          asset: { _type: "reference", _ref: uploadedAsset._id },
        },
        generatedAutomatically: true,
      });
      await notifySubscribers(todayISO);
      return NextResponse.json({ success: true, fallback: true, date: todayISO });
    } catch (fatalError: any) {
      console.error(
        "Epaper: fallback edition ALSO failed:",
        fatalError?.message || fatalError,
        fatalError?.stack || ""
      );
      return NextResponse.json(
        { error: fatalError?.message || "अज्ञात गड़बड़ी" },
        { status: 500 }
      );
    }
  }
}
