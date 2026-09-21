import ProductDetails from "./ProductDetails";
import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import { getSiteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const siteConfig = getSiteConfig();

  const productName = slug
    ?.replace(/-/g, " ")
    ?.replace(/\b\w/g, (c) => c.toUpperCase());

  const title = `${productName} Supplier in India | Price, Dealer & Distributor | ${siteConfig.companyName}`;

  const description = `Buy ${productName} at best price in India. Trusted supplier, dealer and distributor of ${productName} for hospitals, laboratories, diagnostic centers, research institutes and healthcare facilities. Contact ${siteConfig.companyName} for latest quotation and product details.`;

  const url = `${siteConfig.domain}/products/${slug}`;

  return {
    title,
    description,

    keywords: [
      productName,
      `${productName} Supplier`,
      `${productName} Dealer`,
      `${productName} Distributor`,
      `${productName} Manufacturer`,
      `${productName} Exporter`,
      `${productName} Price`,
      `${productName} Price in India`,
      `${productName} Supplier in India`,
      `${productName} Dealer in India`,
      `${productName} Distributor in India`,
      `Buy ${productName}`,
      `${productName} for Laboratory`,
      `${productName} for Hospital`,
      `${productName} for Diagnostic Center`,
      "Biomedical Equipment",
      "Medical Equipment",
      "Laboratory Equipment",
      "Diagnostic Equipment",
      "Hospital Equipment",
      "Healthcare Equipment",
      siteConfig.companyName,
    ],

    alternates: {
      canonical: url,
    },

    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.companyName,
      type: "website",
      locale: "en_IN",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    metadataBase: new URL(siteConfig.domain),
  };
}

export default async function Page({ params }) {
  const { slug } = await params;

  const allProducts = await fetchFullCatalog();
  const product = allProducts.find((p) => p.slug === slug) || null;

  return <ProductDetails slug={slug} product={product} />;
}