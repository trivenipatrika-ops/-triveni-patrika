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
  const radius = Math.round(size * 0.22);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#FAF8F2",
          borderRadius: radius,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              color: "#8A1418",
              fontSize: size * 0.27,
              fontFamily: "NotoDevanagari",
            }}
          >
            त्रिवेणी
          </span>
          <div
            style={{
              width: size * 0.42,
              height: Math.max(2, Math.round(size * 0.015)),
              background: "#8A1418",
              marginTop: size * 0.03,
              display: "flex",
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: -size * 0.28,
            bottom: size * 0.1,
            width: size * 1.1,
            height: size * 0.23,
            background: "#8A1418",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "rotate(-14deg)",
          }}
        >
          <span
            style={{
              color: "#FFFFFF",
              fontSize: size * 0.145,
              fontFamily: "NotoDevanagari",
            }}
          >
            पत्रिका
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
