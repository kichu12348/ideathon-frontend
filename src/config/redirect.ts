export const REDIRECT_BASE_URL = "iedcbootcampcec.org";
export const BUCKET_URL = import.meta.env.VITE_PUBLIC_BUCKET_URL!;

/** Build the public URL for a top-level link slug. */
export const buildRedirectUrl = (slug: string): string =>
  `${REDIRECT_BASE_URL}/${slug}`;

/** Build the public URL for a sub-link. */
export const buildSubRedirectUrl = (slug: string, subSlug: string): string =>
  `${REDIRECT_BASE_URL}/${slug}/${subSlug}`;

export const buildBucketUrl = (path: string): string => `${BUCKET_URL}/${path}`;
