/**
 * Sanitizes Form ID input:
 * 1. Converts all characters to lowercase.
 * 2. Replaces spaces and multiple hyphens with a single hyphen '-'.
 * 3. Removes special characters that are not alphanumeric or hyphens.
 * 4. Ensures string does not start or end with a hyphen '-'.
 */
export function sanitizeFormId(input: string): string {
  if (!input) return "";

  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove illegal characters
    .replace(/[\s-]+/g, "-")      // Collapse multiple spaces/hyphens into single hyphen
    .replace(/^-+|-+$/g, "");      // Strip leading and trailing hyphens
}

/**
 * Partial sanitizer for live typing inside input fields.
 * Prevents multiple hyphens/spaces and uppercase letters while allowing typing.
 */
export function sanitizeFormIdLive(input: string): string {
  if (!input) return "";

  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Keep only lowercase, numbers, space, hyphen
    .replace(/[\s-]+/g, "-")      // Collapse multiple spaces/hyphens to single hyphen
    .replace(/^-+/g, "");          // Disallow starting with hyphen
}
