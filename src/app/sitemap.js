import { wcApi } from "@/server/woocommerce";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600;
const PRODUCTS_PER_PAGE = 100;

const staticPages = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/products", changeFrequency: "daily", priority: 0.9 },
  { path: "/terms%26conditions", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/refund-policy", changeFrequency: "yearly", priority: 0.4 },
  { path: "/shipping-policy", changeFrequency: "yearly", priority: 0.4 },
];

export default async function sitemap() {
  const entries = staticPages.map(({ path, ...metadata }) => ({
    url: new URL(path, SITE_URL).toString(),
    ...metadata,
  }));

  let page = 1;
  let totalPages = 1;

  try {
    while (page <= totalPages) {
      const response = await wcApi.get("/products", {
        params: {
          status: "publish",
          per_page: PRODUCTS_PER_PAGE,
          page,
          orderby: "date",
          order: "desc",
        },
      });

      const products = Array.isArray(response.data) ? response.data : [];
      for (const product of products) {
        if (!product.slug) continue;

        const modifiedDate = product.date_modified_gmt || product.date_modified;
        const parsedModifiedDate = modifiedDate ? new Date(modifiedDate) : null;

        entries.push({
          url: new URL(`/products/${encodeURIComponent(product.slug)}`, SITE_URL).toString(),
          ...(parsedModifiedDate && !Number.isNaN(parsedModifiedDate.getTime())
            ? { lastModified: parsedModifiedDate }
            : {}),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }

      totalPages = Number(response.headers["x-wp-totalpages"] || 1);
      page += 1;
    }
  } catch (error) {
    console.error("Failed to include WooCommerce products in sitemap:", error?.response?.data || error);
  }

  return entries;
}
