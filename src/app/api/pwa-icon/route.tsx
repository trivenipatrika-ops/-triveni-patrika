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

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#8A1418",
        }}
      >
        <div
          style={{
            width: "72%",
            height: "72%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#FAF8F2",
            borderRadius: size * 0.14,
          }}
        >
          <span
            style={{
              color: "#8A1418",
              fontSize: size * 0.42,
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
