export function hindiSlugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\u0900-\u097Fa-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 96);
}
