import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { writeClient } from "@/sanity/writeClient";
import { EpaperDocument, ensureEpaperFonts } from "@/lib/generateEpaperPdf";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "अनधिकृत" }, { status: 401 });
  }

  try {
    await ensureEpaperFonts();

    const since = new Date();
    since.setHours(since.getHours() - 24);

    const posts: {
      title: string;
      excerpt?: string;
      category?: { title: string };
    }[] = await client.fetch(
      groq`*[_type == "post" && publishedAt >= $since] | order(publishedAt desc){
        title, excerpt, category->{title}
      }`,
      { since: since.toISOString() }
    );

    if (posts.length === 0) {
      return NextResponse.json({
        skipped: true,
        reason: "पिछले 24 घंटे में कोई खबर नहीं मिली",
      });
    }

    const lead = {
      title: posts[0].title,
      excerpt: posts[0].excerpt,
      categoryTitle: posts[0].category?.title,
    };
    const rest = posts.slice(1).map((p) => ({
      title: p.title,
      excerpt: p.excerpt,
      categoryTitle: p.category?.title,
    }));

    const todayLabel = new Date().toLocaleDateString("hi-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const pdfBuffer = await renderToBuffer(
      <EpaperDocument dateLabel={todayLabel} lead={lead} rest={rest} />
    );

    const todayISO = new Date().toISOString().slice(0, 10);

    const uploadedAsset = await writeClient.assets.upload("file", pdfBuffer, {
      filename: `triveni-patrika-${todayISO}.pdf`,
      contentType: "application/pdf",
    });

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

    return NextResponse.json({ success: true, date: todayISO });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "अज्ञात गड़बड़ी" },
      { status: 500 }
    );
  }
}
