import React from "react";
import { Document, Page, View, Text, StyleSheet, Font } from "@react-pdf/renderer";

let fontsRegistered = false;

async function fetchGoogleFontTTF(family: string, weight: number): Promise<string> {
  const res = await fetch(
    `https://fonts.googleapis.com/css?family=${encodeURIComponent(family)}:${weight}`
  );
  const css = await res.text();
  const match = css.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.ttf)\)/);
  if (!match) {
    throw new Error(`Google Font not found: ${family} ${weight}`);
  }
  return match[1];
}

export async function ensureEpaperFonts() {
  if (fontsRegistered) return;
  const [regular, bold] = await Promise.all([
    fetchGoogleFontTTF("Noto Sans Devanagari", 400),
    fetchGoogleFontTTF("Noto Sans Devanagari", 700),
  ]);
  Font.register({
    family: "NotoDevanagari",
    fonts: [
      { src: regular, fontWeight: 400 },
      { src: bold, fontWeight: 700 },
    ],
  });
  fontsRegistered = true;
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "NotoDevanagari",
  },
  masthead: {
    textAlign: "center",
    borderBottomWidth: 3,
    borderBottomColor: "#8A1418",
    paddingBottom: 10,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontFamily: "NotoDevanagari",
    fontWeight: 700,
    color: "#8A1418",
  },
  dateText: {
    fontSize: 10,
    color: "#555",
    marginTop: 4,
  },
  leadTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 6,
  },
  leadExcerpt: {
    fontSize: 10,
    color: "#333",
    marginBottom: 16,
    lineHeight: 1.5,
  },
  columns: {
    flexDirection: "row",
    gap: 16,
  },
  column: {
    flex: 1,
  },
  category: {
    fontSize: 8,
    color: "#8A1418",
    fontWeight: 700,
    marginBottom: 2,
  },
  headline: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 3,
  },
  excerpt: {
    fontSize: 9,
    color: "#333",
    marginBottom: 12,
    lineHeight: 1.4,
  },
  divider: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#cccccc",
    marginBottom: 12,
  },
});

type EpaperPost = {
  title: string;
  excerpt?: string;
  categoryTitle?: string;
};

export function EpaperDocument({
  dateLabel,
  lead,
  rest,
}: {
  dateLabel: string;
  lead: EpaperPost | null;
  rest: EpaperPost[];
}) {
  const half = Math.ceil(rest.length / 2);
  const col1 = rest.slice(0, half);
  const col2 = rest.slice(half);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.masthead}>
          <Text style={styles.title}>त्रिवेणी पत्रिका</Text>
          <Text style={styles.dateText}>{dateLabel}</Text>
        </View>

        {lead && (
          <View>
            {lead.categoryTitle && (
              <Text style={styles.category}>{lead.categoryTitle}</Text>
            )}
            <Text style={styles.leadTitle}>{lead.title}</Text>
            {lead.excerpt && (
              <Text style={styles.leadExcerpt}>{lead.excerpt}</Text>
            )}
          </View>
        )}

        <View style={styles.columns}>
          <View style={styles.column}>
            {col1.map((post, i) => (
              <View key={i} style={styles.divider}>
                {post.categoryTitle && (
                  <Text style={styles.category}>{post.categoryTitle}</Text>
                )}
                <Text style={styles.headline}>{post.title}</Text>
                {post.excerpt && (
                  <Text style={styles.excerpt}>{post.excerpt}</Text>
                )}
              </View>
            ))}
          </View>
          <View style={styles.column}>
            {col2.map((post, i) => (
              <View key={i} style={styles.divider}>
                {post.categoryTitle && (
                  <Text style={styles.category}>{post.categoryTitle}</Text>
                )}
                <Text style={styles.headline}>{post.title}</Text>
                {post.excerpt && (
                  <Text style={styles.excerpt}>{post.excerpt}</Text>
                )}
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}
