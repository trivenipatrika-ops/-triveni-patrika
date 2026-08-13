import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#181512",
        paper: "#FAF8F2",
        masthead: "#8A1418",
        accent: "#B4272B",
        rule: "#D9D2C2",
        navy: "#10141F"
      },
      fontFamily: {
        headline: ["var(--font-headline)", "serif"],
        body: ["var(--font-body)", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
