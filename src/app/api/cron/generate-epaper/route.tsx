import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer, Document, Page, Text } from "@react-pdf/renderer";
import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { writeClient } from "@/sanity/writeClient";
import { getDb } from "@/lib/mongodb";
import webpush from "@/lib/webPush";
import { EpaperDocument, ensureEpaperFonts } from "@/lib/generateEpaperPdf";

export const runtime = "nodejs";
export const maxDuration = 60;

type LightPost = {
  title: string;
  excerpt?: string;
  category?: { title: string };
};

async function fetchRecentPosts(hours: number): Promise<LightPost[]> {
  const since = new Date();
  since.setHours(since.getHours() - hours);
  return client.fetch(
    groq`*[_type == "post" && publishedAt >= $since] | order(publishedAt desc){
      title, excerpt, category->{title}
    }`,
    { since: since.toISOString() }
  );
}

async function notifySubscribers(todayISO: string) {
  try {
    const db = await getDb();
    const subscribers = await db.collection("subscribers").find({}).toArray();
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://triveni-patrika.vercel.app";
    const payload = JSON.stringify({
      title: "📰 आज का ई-पेपर तैयार है",
      body: "त्रिवेणी पत्रिका का आज का पूरा अंक पढ़ने के लिए टैप करें",
      url: `${siteUrl}/epaper/${todayISO}`,
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
    await ensureEpaperFonts();

    let posts: LightPost[] = await fetchRecentPosts(24);
    let noteLine = "";

    if (posts.length === 0) {
      posts = await fetchRecentPosts(24 * 7);
      if (posts.length > 0) {
        noteLine = "(पिछले 7 दिनों की चुनिंदा खबरें)";
      }
    }

    if (posts.length === 0) {
      posts = await client.fetch(
        groq`*[_type == "post"] | order(publishedAt desc)[0...10]{
          title, excerpt, category->{title}
        }`
      );
      if (posts.length > 0) {
        noteLine = "(हाल में नई खबर नहीं — पुरानी खबरों के साथ अंक)";
      }
    }

    let lead: { title: string; excerpt?: string; categoryTitle?: string };
    let rest: { title: string; excerpt?: string; categoryTitle?: string }[] = [];

    if (posts.length > 0) {
      lead = {
        title: posts[0].title,
        excerpt: posts[0].excerpt,
        categoryTitle: posts[0].category?.title,
      };
      rest = posts.slice(1).map((p) => ({
        title: p.title,
        excerpt: p.excerpt,
        categoryTitle: p.category?.title,
      }));
    } else {
      lead = {
        title: "त्रिवेणी पत्रिका जल्द शुरू हो रही है",
        excerpt: "यहां जल्द ही ताज़ा खबरें प्रकाशित की जाएंगी।",
      };
      noteLine = "(स्वागत अंक)";
    }

    let pdfBuffer: Buffer;
    try {
      pdfBuffer = await renderToBuffer(
        <EpaperDocument
          dateLabel={`${todayLabel} ${noteLine}`.trim()}
          lead={lead}
          rest={rest}
        />
      );
    } catch (renderError: any) {
      console.error(
        "Epaper: main PDF render failed, using fallback:",
        renderError?.message || renderError
      );
      pdfBuffer = await renderToBuffer(
        <Document>
          <Page size="A4" style={{ padding: 40 }}>
            <Text>{`त्रिवेणी पत्रिका - ${todayLabel}`}</Text>
          </Page>
        </Document>
      );
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
      const fallbackBuffer = await renderToBuffer(
        <Document>
          <Page size="A4" style={{ padding: 40 }}>
            <Text>{`त्रिवेणी पत्रिका - ${todayLabel}`}</Text>
          </Page>
        </Document>
      );
      const uploadedAsset = await writeClient.assets.upload(
        "file",
        fallbackBuffer,
        {
          filename: `triveni-patrika-${todayISO}-fallback.pdf`,
          contentType: "application/pdf",
        }
      );
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
