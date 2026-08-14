import { defineField, defineType } from "sanity";

export default defineType({
  name: "epaper",
  title: "ई-पेपर (Daily Edition)",
  type: "document",
  fields: [
    defineField({
      name: "date",
      title: "तारीख",
      type: "date",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "title",
      title: "शीर्षक",
      type: "string",
    }),
    defineField({
      name: "pdfFile",
      title: "PDF फाइल",
      type: "file",
      options: { accept: "application/pdf" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "coverImage",
      title: "कवर फोटो (वैकल्पिक)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "generatedAutomatically",
      title: "क्या यह अपने आप बना (Auto)?",
      type: "boolean",
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: "नई तारीख पहले",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", date: "date", media: "coverImage" },
    prepare({
      title,
      date,
      media,
    }: {
      title?: string;
      date?: string;
      media?: any;
    }) {
      return {
        title:
          title ||
          (date ? new Date(date).toLocaleDateString("hi-IN") : "ई-पेपर"),
        subtitle: date,
        media,
      };
    },
  },
});
