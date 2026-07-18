// Public-facing base URL for short links (the domain users actually visit).
// This is intentionally a hardcoded constant, separate from the redirect API
// URL (VITE_PUBLIC_REDIRECT_API_URL) which is where the admin app talks to.
export const REDIRECT_BASE_URL = "iedcbootcampcec.org";

/** Build the public URL for a top-level link slug. */
export const buildRedirectUrl = (slug: string): string =>
  `${REDIRECT_BASE_URL}/${slug}`;

/** Build the public URL for a sub-link. */
export const buildSubRedirectUrl = (slug: string, subSlug: string): string =>
  `${REDIRECT_BASE_URL}/${slug}/${subSlug}`;
