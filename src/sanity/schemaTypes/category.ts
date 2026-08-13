import { defineField, defineType } from "sanity";

export default defineType({
  name: "category",
  title: "श्रेणी (Category)",
  type: "document",
  fields: [
    defineField({ name: "title", title: "नाम", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "URL Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "order", title: "क्रम (Nav में स्थान)", type: "number" })
  ]
});
