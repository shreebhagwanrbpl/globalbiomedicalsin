import Products from "@/app/products/page";
import { getSiteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const siteConfig = getSiteConfig();

  const district = resolvedParams?.district || "jaipur";

  const city = district
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const url = `${siteConfig.domain}/${district}/items`;

  return {
    title: `Laboratory Equipment, Biomedical Products & Diagnostic Instruments in ${city} | ${siteConfig.companyName}`,

    description: `${siteConfig.companyName} supplies premium laboratory equipment, biomedical instruments, electrolyte analyzers, diagnostic devices, laboratory reagents, medical equipment, hospital equipment, and laboratory consumables in ${city}. Trusted by hospitals, pathology labs, diagnostic centres, and research laboratories.`,

    keywords: [
      `Laboratory Equipment ${city}`,
      `Biomedical Products ${city}`,
      `Biomedical Equipment Supplier ${city}`,
      `Medical Equipment Supplier ${city}`,
      `Diagnostic Instruments ${city}`,
      `Diagnostic Equipment ${city}`,
      `Hospital Equipment ${city}`,
      `Laboratory Instruments ${city}`,
      `Laboratory Reagents ${city}`,
      `Electrolyte Analyzer ${city}`,
      `Electrolyte Reagents ${city}`,
      `Blood Gas Analyzer ${city}`,
      `Laboratory Consumables ${city}`,
      `Pathology Lab Equipment ${city}`,
      `Clinical Laboratory Equipment ${city}`,
      `Medical Devices ${city}`,
      `Healthcare Equipment ${city}`,
      `Lab Equipment Dealer ${city}`,
      `${siteConfig.companyName} ${city}`,
      `${siteConfig.companyName} Products`,
    ],

    alternates: {
      canonical: url,
    },

    openGraph: {
      title: `Laboratory Equipment & Biomedical Products in ${city} | ${siteConfig.companyName}`,
      description: `Browse premium laboratory equipment, diagnostic analyzers, biomedical instruments, laboratory reagents, and hospital equipment in ${city}.`,
      url,
      siteName: siteConfig.companyName,
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${siteConfig.companyName} Products ${city}`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `Biomedical Products in ${city} | ${siteConfig.companyName}`,
      description: `Trusted supplier of laboratory equipment, analyzers, biomedical instruments, and reagents in ${city}.`,
      images: ["/og-image.jpg"],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-video-preview": -1,
        "max-snippet": -1,
      },
    },

    category: "Healthcare",
  };
}

export default async function Page({ params }) {
  const resolvedParams = await params;

  const district = resolvedParams?.district || "jaipur";

  const city = district
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return <Products district={district} city={city} />;
}