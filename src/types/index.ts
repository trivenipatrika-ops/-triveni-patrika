export type Category = {
  _id: string;
  title: string;
  slug: string;
};

export type SanityImageSource = {
  asset?: { _ref: string; _type: string };
  alt?: string;
};

export type Post = {
  _id: string;
  title: string;
  slug: string;
  mainImage?: SanityImageSource;
  excerpt?: string;
  publishedAt: string;
  category?: { title: string; slug: string };
  author?: { name: string };
};
