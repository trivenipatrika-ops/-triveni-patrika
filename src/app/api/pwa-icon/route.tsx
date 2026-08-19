import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const revalidate = 86400;

async function fetchGoogleFontTTF(
  family: string,
  weight: number
): Promise<ArrayBuffer> {
  const res = await fetch(
    `https://fonts.googleapis.com/css?family=${encodeURIComponent(family)}:${weight}`
  );
  const css = await res.text();
  const match = css.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.ttf)\)/);
  if (!match) {
    throw new Error(`Google Font not found: ${family} ${weight}`);
  }
  const fontRes = await fetch(match[1]);
  return await fontRes.arrayBuffer();
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const size = parseInt(searchParams.get("size") || "512", 10);

  const fontData = await fetchGoogleFontTTF("Noto Sans Devanagari", 700);
  const ringWidth = Math.max(4, Math.round(size * 0.035));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAF8F2",
        }}
      >
        <div
          style={{
            width: "88%",
            height: "88%",
            borderRadius: "50%",
            background: "#8A1418",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `${ringWidth}px solid #FAF8F2`,
            boxShadow: "0 0 0 " + Math.max(2, Math.round(size * 0.012)) + "px #8A1418",
          }}
        >
          <span
            style={{
              color: "#FFFFFF",
              fontSize: size * 0.36,
              fontFamily: "NotoDevanagari",
            }}
          >
            त्रि
          </span>
        </div>
      </div>
    ),
    {
      width: size,
      height: size,
      fonts: [{ name: "NotoDevanagari", data: fontData, weight: 700 }],
    }
  );
}
