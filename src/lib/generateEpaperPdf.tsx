import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export type EpaperPost = {
  title: string;
  excerpt?: string;
  categoryTitle?: string;
  imageUrl?: string;
  isBreaking?: boolean;
};

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function articleBlock(post: EpaperPost, isLead = false): string {
  return `
    <div class="article ${isLead ? "article-lead" : ""}">
      ${post.categoryTitle ? `<div class="tag">${escapeHtml(post.categoryTitle)}</div>` : ""}
      ${post.imageUrl ? `<img class="thumb" src="${post.imageUrl}" />` : ""}
      <div class="headline">${escapeHtml(post.title)}</div>
      ${post.excerpt ? `<div class="excerpt">${escapeHtml(post.excerpt)}</div>` : ""}
    </div>
  `;
}

export function buildEpaperHtml({
  brandName,
  tagline,
  dateLabel,
  noteLine,
  edition,
  breakingTitles,
  lead,
  rest,
}: {
  brandName: string;
  tagline: string;
  dateLabel: string;
  noteLine?: string;
  edition: string;
  breakingTitles: string[];
  lead: EpaperPost;
  rest: EpaperPost[];
}): string {
  const third = Math.ceil(rest.length / 3);
  const col1 = rest.slice(0, third);
  const col2 = rest.slice(third, third * 2);
  const col3 = rest.slice(third * 2);

  return `<!DOCTYPE html>
  <html lang="hi">
  <head>
  <meta charset="utf-8" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Devanagari:wght@600;700&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Noto Sans Devanagari', sans-serif; color: #1a1a1a; padding: 30px 36px; }
    .masthead { text-align: center; border-bottom: 4px solid #8A1418; padding-bottom: 8px; margin-bottom: 4px; }
    .brand { font-family: 'Noto Serif Devanagari', serif; font-size: 48px; font-weight: 700; color: #8A1418; letter-spacing: 1px; }
    .tagline { font-size: 11px; color: #666; margin-top: 2px; }
    .datebar { display: flex; justify-content: space-between; font-size: 10px; color: #555; padding: 6px 0; border-bottom: 1px solid #ccc; margin-bottom: 12px; }
    .ticker { background: #8A1418; color: #fff; font-size: 11px; padding: 6px 12px; margin-bottom: 16px; border-radius: 2px; }
    .ticker b { margin-right: 8px; }
    .lead-wrap { border-bottom: 2px solid #8A1418; padding-bottom: 16px; margin-bottom: 16px; }
    .article-lead .headline { font-family: 'Noto Serif Devanagari', serif; font-size: 26px; font-weight: 700; line-height: 1.35; margin-bottom: 8px; }
    .article-lead .excerpt { font-size: 12.5px; line-height: 1.65; color: #333; }
    .article-lead .thumb { width: 100%; max-height: 220px; object-fit: cover; border-radius: 2px; margin-bottom: 10px; }
    .tag { display: inline-block; font-size: 9px; font-weight: 700; color: #8A1418; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.5px; }
    .columns { display: flex; gap: 20px; }
    .col { flex: 1; min-width: 0; }
    .article { border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 10px; }
    .article .thumb { width: 100%; max-height: 110px; object-fit: cover; border-radius: 2px; margin-bottom: 6px; }
    .article .headline { font-size: 13px; font-weight: 700; line-height: 1.4; margin-bottom: 4px; }
    .article .excerpt { font-size: 10.5px; line-height: 1.5; color: #444; }
    .footer { margin-top: 22px; padding-top: 8px; border-top: 1px solid #ccc; font-size: 9px; color: #888; text-align: center; }
  </style>
  </head>
  <body>
    <div class="masthead">
      <div class="brand">${escapeHtml(brandName)}</div>
      <div class="tagline">${escapeHtml(tagline)}</div>
    </div>
    <div class="datebar">
      <span>${escapeHtml(dateLabel)}${noteLine ? " " + escapeHtml(noteLine) : ""}</span>
      <span>${escapeHtml(edition)}</span>
    </div>
    ${breakingTitles.length ? `<div class="ticker"><b>&#128308; ब्रेकिंग</b>${breakingTitles.map(escapeHtml).join("  •  ")}</div>` : ""}
    <div class="lead-wrap">
      ${articleBlock(lead, true)}
    </div>
    <div class="columns">
      <div class="col">${col1.map((p) => articleBlock(p)).join("")}</div>
      <div class="col">${col2.map((p) => articleBlock(p)).join("")}</div>
      <div class="col">${col3.map((p) => articleBlock(p)).join("")}</div>
    </div>
    <div class="footer">${escapeHtml(brandName)} — डिजिटल संस्करण</div>
  </body>
  </html>`;
}

export async function renderEpaperPdf(html: string): Promise<Buffer> {
  const executablePath = await chromium.executablePath();
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath,
    headless: chromium.headless,
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBytes = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", bottom: "0", left: "0", right: "0" },
    });
    return Buffer.from(pdfBytes);
  } finally {
    await browser.close();
  }
}
