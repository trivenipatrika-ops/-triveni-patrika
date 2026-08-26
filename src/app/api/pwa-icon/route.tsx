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

const RED = "#B7121B";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const size = parseInt(searchParams.get("size") || "512", 10);

  const fontBold = await fetchGoogleFontTTF("Noto Sans Devanagari", 700);
  const radius = Math.round(size * 0.22);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFFFFF",
          borderRadius: radius,
          overflow: "hidden",
          padding: size * 0.05,
        }}
      >
        {/* red circular emblem with a mini folded-newspaper glyph inside */}
        <div
          style={{
            width: size * 0.36,
            height: size * 0.36,
            borderRadius: "50%",
            background: RED,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: size * 0.02,
          }}
        >
          <div
            style={{
              width: size * 0.22,
              height: size * 0.17,
              background: "#FFFFFF",
              borderRadius: size * 0.012,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: size * 0.014,
              transform: "rotate(-10deg)",
            }}
          >
            <div
              style={{
                width: "85%",
                height: Math.max(2, size * 0.013),
                background: RED,
                marginBottom: size * 0.01,
                display: "flex",
              }}
            />
            <div
              style={{
                width: "65%",
                height: Math.max(2, size * 0.009),
                background: "#999999",
                marginBottom: size * 0.008,
                display: "flex",
              }}
            />
            <div
              style={{
                width: "75%",
                height: Math.max(2, size * 0.009),
                background: "#999999",
                marginBottom: size * 0.008,
                display: "flex",
              }}
            />
            <div
              style={{
                width: "55%",
                height: Math.max(2, size * 0.009),
                background: "#999999",
                display: "flex",
              }}
            />
          </div>
        </div>

        {/* brand name */}
        <span
          style={{
            color: "#111111",
            fontSize: size * 0.21,
            fontFamily: "NotoDevanagari",
            lineHeight: 1,
          }}
        >
          त्रिवेणी
        </span>

        {/* red pill with sub-name */}
        <div
          style={{
            marginTop: size * 0.035,
            background: RED,
            borderRadius: size * 0.07,
            paddingLeft: size * 0.09,
            paddingRight: size * 0.09,
            paddingTop: size * 0.02,
            paddingBottom: size * 0.02,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              color: "#FFFFFF",
              fontSize: size * 0.135,
              fontFamily: "NotoDevanagari",
              lineHeight: 1,
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
      fonts: [{ name: "NotoDevanagari", data: fontBold, weight: 700 }],
    }
  );
}
