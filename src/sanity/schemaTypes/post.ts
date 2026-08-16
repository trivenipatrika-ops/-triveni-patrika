import { defineField, defineType } from "sanity";

export default defineType({
  name: "post",
  title: "खबर (Post)",
  type: "document",
  fields: [
    defineField({ name: "title", title: "शीर्षक", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "URL Slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (r) => r.required() }),
    defineField({
      name: "mainImage",
      title: "मुख्य फोटो",
      type: "image",
      options: { hotspot: true },
      fields: [
        { name: "alt", title: "फोटो का विवरण (Alt text)", type: "string" },
        { name: "caption", title: "फोटो कैप्शन (फोटो के नीचे दिखेगा, वैकल्पिक)", type: "string" },
      ],
    }),
    defineField({ name: "category", title: "श्रेणी", type: "reference", to: [{ type: "category" }], validation: (r) => r.required() }),
    defineField({ name: "author", title: "रिपोर्टर", type: "reference", to: [{ type: "author" }] }),
    defineField({ name: "city", title: "शहर/जिला", type: "string", initialValue: "प्रयागराज" }),
    defineField({ name: "excerpt", title: "संक्षिप्त सार (लिस्ट में दिखेगा)", type: "text", rows: 3 }),
    defineField({
      name: "pullQuote",
      title: "🗨️ विशेष टिप्पणी / उद्धरण (वैकल्पिक)",
      type: "object",
      fields: [
        { name: "quote", title: "टिप्पणी/उद्धरण", type: "text", rows: 3 },
        { name: "attribution", title: "किसने कहा (वैकल्पिक)", type: "string" },
        {
          name: "photo",
          title: "फोटो (वैकल्पिक — सिर्फ डिज़ाइन 1 में दिखेगी)",
          type: "image",
          options: { hotspot: true },
        },
        {
          name: "color",
          title: "बॉक्स का रंग",
          type: "string",
          options: {
            list: [
              { title: "🔴 लाल", value: "red" },
              { title: "🔵 नीला", value: "blue" },
              { title: "🟢 हरा", value: "green" },
              { title: "🟠 नारंगी", value: "orange" },
              { title: "🟣 बैंगनी", value: "purple" },
              { title: "⚫ गहरा नेवी", value: "navy" },
            ],
            layout: "radio",
          },
          initialValue: "red",
        },
        {
          name: "style",
          title: "बॉक्स का डिज़ाइन",
          type: "string",
          options: {
            list: [
              { title: "1️⃣ बॉर्डर बॉक्स (फोटो के साथ)", value: "box" },
              { title: "2️⃣ क्लासिक लाइन (अमर उजाला जैसा)", value: "diagonal" },
              { title: "3️⃣ साइड लाइन", value: "underline" },
              { title: "4️⃣ वर्टिकल बार", value: "sidebar" },
              { title: "5️⃣ मिनिमल (सिर्फ इटैलिक)", value: "minimal" },
              { title: "6️⃣ भरा हुआ रंग (Solid)", value: "solid" },
            ],
          },
          initialValue: "box",
        },
      ],
    }),
    defineField({
      name: "body",
      title: "पूरी खबर",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "सामान्य", value: "normal" },
            { title: "उपशीर्षक", value: "h2" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
              { title: "🔴 लाल हाईलाइट", value: "highlightRed" },
              { title: "🔵 नीला हाईलाइट", value: "highlightBlue" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "लिंक",
                fields: [{ name: "href", title: "URL", type: "url" }],
              },
            ],
          },
        },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", title: "फोटो का विवरण (Alt text)", type: "string" },
            { name: "caption", title: "फोटो कैप्शन (वैकल्पिक)", type: "string" },
          ],
        },
      ],
    }),
    defineField({ name: "videoUrl", title: "YouTube वीडियो लिंक (वैकल्पिक)", type: "url" }),
    defineField({ name: "isBreaking", title: "🔴 ब्रेकिंग न्यूज़ है?", type: "boolean", initialValue: false }),
    defineField({ name: "isFeatured", title: "⭐ हाईलाइट खबर है?", type: "boolean", initialValue: false }),
    defineField({ name: "publishedAt", title: "प्रकाशित तारीख/समय", type: "datetime", initialValue: () => new Date().toISOString() })
  ],
  orderings: [
    { title: "नई पहले", name: "publishedAtDesc", by: [{ field: "publishedAt", direction: "desc" }] }
  ],
  preview: {
    select: {
      title: "title",
      media: "mainImage",
      category: "category.title",
      date: "publishedAt"
    },
    prepare(selection) {
      const { title, media, category, date } = selection;
      return {
        title,
        subtitle: [category, date ? new Date(date).toLocaleDateString("hi-IN") : ""]
          .filter(Boolean)
          .join(" · "),
        media
      };
    }
  }
});
