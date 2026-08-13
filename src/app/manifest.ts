import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "त्रिवेणी पत्रिका — डिजिटल अखबार",
    short_name: "त्रिवेणी पत्रिका",
    description: "प्रयागराज और आसपास की ताज़ा खबरें",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF8F2",
    theme_color: "#8A1418",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
