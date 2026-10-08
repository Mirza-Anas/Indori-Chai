import { wcApi } from "@/server/woocommerce";
import { SITE_NAME, SITE_URL, stripHtml } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const { data } = await wcApi.get("/products", {
      params: { slug, status: "publish", per_page: 1 },
    });
    const product = data?.[0];

    if (!product) {
      return {
        title: "Product not found",
        robots: { index: false, follow: false },
      };
    }

    const title = `${product.name} | Premium Indian Tea`;
    const description =
      stripHtml(product.short_description || product.description).slice(0, 160) ||
      `Shop ${product.name} from ${SITE_NAME}. Premium Indian tea delivered across India.`;
    const canonical = `/products/${encodeURIComponent(slug)}`;
    const image = product.images?.[0]?.src;

    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        type: "website",
        url: canonical,
        siteName: SITE_NAME,
        title: `${title} | ${SITE_NAME}`,
        description,
        ...(image
          ? {
              images: [
                {
                  url: image,
                  alt: product.images[0].alt || product.name,
                },
              ],
            }
          : {}),
      },
      twitter: {
        card: image ? "summary_large_image" : "summary",
        title: `${title} | ${SITE_NAME}`,
        description,
        ...(image ? { images: [image] } : {}),
      },
    };
  } catch (error) {
    console.error("Failed to generate product metadata:", error?.response?.data || error);

    return {
      title: "Premium Indian Tea",
      alternates: { canonical: `${SITE_URL}/products/${encodeURIComponent(slug)}` },
    };
  }
}

export default function ProductLayout({ children }) {
  return children;
}
