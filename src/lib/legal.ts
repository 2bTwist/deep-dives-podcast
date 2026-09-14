/** Last material edit of each legal page, as YYYY-MM-DD. Shown on the page and reported in the sitemap. */
export const PRIVACY_UPDATED = "2026-05-16";
export const TERMS_UPDATED = "2026-05-16";

/** "2026-05-16" to "May 16, 2026". Formatted in UTC so the day never shifts with the server's timezone. */
export function formatLegalDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
