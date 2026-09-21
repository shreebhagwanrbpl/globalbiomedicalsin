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

  const url = `${siteConfig.domain}/${district}/products`;

  return {
    title: `Laboratory Equipment, Biomedical Products & Medical Devices in ${city} | ${siteConfig.companyName}`,

    description: `Explore ${siteConfig.companyName}'s complete range of laboratory equipment, biomedical instruments, electrolyte analyzers, blood gas analyzers, laboratory reagents, diagnostic instruments, medical devices, pathology lab equipment, and hospital equipment in ${city}.`,

    keywords: [
      `Laboratory Equipment ${city}`,
      `Biomedical Equipment ${city}`,
      `Biomedical Products ${city}`,
      `Medical Equipment ${city}`,
      `Diagnostic Equipment ${city}`,
      `Diagnostic Instruments ${city}`,
      `Hospital Equipment ${city}`,
      `Laboratory Instruments ${city}`,
      `Laboratory Reagents ${city}`,
      `Electrolyte Analyzer ${city}`,
      `Electrolyte Reagent ${city}`,
      `Blood Gas Analyzer ${city}`,
      `Pathology Lab Equipment ${city}`,
      `Clinical Laboratory Equipment ${city}`,
      `Medical Devices ${city}`,
      `Healthcare Equipment ${city}`,
      `Lab Equipment Supplier ${city}`,
      `Biomedical Equipment Supplier ${city}`,
      `${siteConfig.companyName} ${city}`,
      `${siteConfig.companyName} Products`,
    ],

    alternates: {
      canonical: url,
    },

    openGraph: {
      title: `Laboratory Equipment & Biomedical Products in ${city} | ${siteConfig.companyName}`,
      description: `Browse premium laboratory equipment, analyzers, reagents, biomedical instruments, and hospital equipment in ${city}.`,
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
      description: `Premium laboratory equipment and biomedical products supplier in ${city}.`,
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