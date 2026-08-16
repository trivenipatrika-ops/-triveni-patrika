export type Category = {
  _id: string;
  title: string;
  slug: string;
};

export type SanityImageSource = {
  asset?: { _ref: string; _type: string };
  alt?: string;
  caption?: string;
};

export type Author = {
  name: string;
  image?: SanityImageSource;
  bio?: string;
  role?: string;
};

export type PullQuoteValue = {
  quote?: string;
  attribution?: string;
  photo?: SanityImageSource;
  color?: string;
  style?: string;
};

export type Post = {
  _id: string;
  title: string;
  slug: string;
  mainImage?: SanityImageSource;
  excerpt?: string;
  pullQuote?: PullQuoteValue;
  body?: any[];
  videoUrl?: string;
  publishedAt: string;
  _updatedAt?: string;
  category?: { title: string; slug: string };
  author?: Author;
};
