export const SITE_URL = "https://indorichai.in";
export const SITE_NAME = "Indori Chai";

export const DEFAULT_DESCRIPTION =
  "Shop premium Indian tea from Indori Chai. Discover authentic, refreshing blends made for everyday chai lovers, delivered across India.";

export const createPageMetadata = ({ title, description, path }) => ({
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${title} | ${SITE_NAME}`,
    description,
    url: path,
  },
  twitter: {
    card: "summary",
    title: `${title} | ${SITE_NAME}`,
    description,
  },
});

export const noIndexMetadata = (title) => ({
  title,
  robots: {
    index: false,
    follow: false,
  },
});

export const stripHtml = (value = "") =>
  String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
