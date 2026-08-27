import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 86400;

const RED = "#B7121B";

function buildIconHtml(size: number): string {
  const emblem = Math.round(size * 0.36);
  const page = { w: Math.round(size * 0.22), h: Math.round(size * 0.17) };
  const radius = Math.round(size * 0.22);

  return `<!DOCTYPE html>
  <html lang="hi">
  <head>
  <meta charset="utf-8" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: ${size}px; height: ${size}px; }
    body {
      font-family: 'Noto Sans Devanagari', sans-serif;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      background: #FFFFFF;
      border-radius: ${radius}px;
      overflow: hidden;
      padding: ${Math.round(size * 0.05)}px;
    }
    .emblem {
      width: ${emblem}px; height: ${emblem}px; border-radius: 50%;
      background: ${RED};
      display: flex; align-items: center; justify-content: center;
      margin-bottom: ${Math.round(size * 0.02)}px;
    }
    .page {
      width: ${page.w}px; height: ${page.h}px; background: #FFFFFF;
      border-radius: ${Math.round(size * 0.012)}px;
      display: flex; flex-direction: column; justify-content: center;
      padding: ${Math.round(size * 0.014)}px;
      transform: rotate(-10deg);
    }
    .line1 { width: 85%; height: ${Math.max(2, Math.round(size * 0.013))}px; background: ${RED}; margin-bottom: ${Math.round(size * 0.01)}px; }
    .line2 { width: 65%; height: ${Math.max(2, Math.round(size * 0.009))}px; background: #999999; margin-bottom: ${Math.round(size * 0.008)}px; }
    .line3 { width: 75%; height: ${Math.max(2, Math.round(size * 0.009))}px; background: #999999; margin-bottom: ${Math.round(size * 0.008)}px; }
    .line4 { width: 55%; height: ${Math.max(2, Math.round(size * 0.009))}px; background: #999999; }
    .brand { color: #111111; font-size: ${Math.round(size * 0.21)}px; font-weight: 700; line-height: 1; }
    .pill {
      margin-top: ${Math.round(size * 0.035)}px; background: ${RED};
      border-radius: ${Math.round(size * 0.07)}px;
      padding: ${Math.round(size * 0.02)}px ${Math.round(size * 0.09)}px;
      display: flex; align-items: center; justify-content: center;
    }
    .pill span { color: #FFFFFF; font-size: ${Math.round(size * 0.135)}px; font-weight: 700; line-height: 1; }
  </style>
  </head>
  <body>
    <div class="emblem">
      <div class="page">
        <div class="line1"></div>
        <div class="line2"></div>
        <div class="line3"></div>
        <div class="line4"></div>
      </div>
    </div>
    <div class="brand">त्रिवेणी</div>
    <div class="pill"><span>पत्रिका</span></div>
  </body>
  </html>`;
}

async function renderIconPng(html: string, size: number): Promise<Buffer> {
  const remoteKey = process.env.BROWSERLESS_API_KEY;

  if (remoteKey) {
    // Same production-grade approach used for the e-paper PDF: a managed
    // browser service does the actual rendering, so Devanagari is shaped
    // correctly by a real browser engine instead of satori's text layout
    // (which is what caused the broken/garbled brand name before).
    const res = await fetch(
      `https://chrome.browserless.io/screenshot?token=${remoteKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html,
          options: { type: "png" },
          viewport: { width: size, height: size },
        }),
      }
    );
    if (!res.ok) {
      throw new Error(
        `Browserless screenshot failed: ${res.status} ${await res.text()}`
      );
    }
    return Buffer.from(await res.arrayBuffer());
  }

  // Fallback: local headless Chromium (see next.config.mjs for the required
  // outputFileTracingIncludes so its binary actually ships with the function).
  const chromium = (await import("@sparticuz/chromium")).default;
  const puppeteer = (await import("puppeteer-core")).default;
  const executablePath = await chromium.executablePath();
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: { width: size, height: size },
    executablePath,
    headless: chromium.headless,
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: size, height: size });
    await page.setContent(html, { waitUntil: "networkidle0" });
    const png = await page.screenshot({ type: "png" });
    return Buffer.from(png);
  } finally {
    await browser.close();
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const size = parseInt(searchParams.get("size") || "512", 10);

  const html = buildIconHtml(size);
  const png = await renderIconPng(html, size);

  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
