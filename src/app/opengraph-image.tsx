import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const revalidate = 86400;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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

export default async function OGImage() {
  const [regular, bold] = await Promise.all([
    fetchGoogleFontTTF("Noto Sans Devanagari", 400),
    fetchGoogleFontTTF("Noto Sans Devanagari", 700),
  ]);

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
          background: "#FAF8F2",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 14,
            background: "#8A1418",
            display: "flex",
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 96,
            color: "#8A1418",
            fontFamily: "NotoBold",
          }}
        >
          त्रिवेणी पत्रिका
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "#555555",
            marginTop: 20,
            letterSpacing: 6,
            fontFamily: "NotoRegular",
          }}
        >
          डिजिटल अखबार · प्रयागराज
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 14,
            background: "#8A1418",
            display: "flex",
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "NotoBold", data: bold, weight: 700 },
        { name: "NotoRegular", data: regular, weight: 400 },
      ],
    }
  );
}
