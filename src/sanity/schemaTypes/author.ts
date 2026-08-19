import { defineField, defineType } from "sanity";
import { hindiSlugify } from "../hindiSlugify";

export default defineType({
  name: "author",
  title: "लेखक/रिपोर्टर (Author)",
  type: "document",
  fields: [
    defineField({ name: "name", title: "नाम", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      options: { source: "name", slugify: hindiSlugify },
    }),
    defineField({ name: "role", title: "पद (जैसे: रिपोर्टर, संपादक)", type: "string" }),
    defineField({ name: "image", title: "फोटो", type: "image", options: { hotspot: true } }),
    defineField({ name: "bio", title: "परिचय", type: "text" })
  ]
});
