import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("त्रिवेणी पत्रिका")
    .items([
      S.listItem()
        .title("✍️ सभी खबरें")
        .child(
          S.documentTypeList("post")
            .title("सभी खबरें")
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }])
        ),
      S.listItem()
        .title("🏷️ श्रेणियाँ")
        .child(S.documentTypeList("category").title("श्रेणियाँ")),
      S.listItem()
        .title("✒️ लेखक/रिपोर्टर")
        .child(S.documentTypeList("author").title("लेखक/रिपोर्टर")),
    ]);
