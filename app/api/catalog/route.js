import { NextResponse } from "next/server";
import { fetchAdminCatalog } from "@/lib/admin-api";
import { getSiteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  try {
    const siteConfig = getSiteConfig();
    const products = await fetchAdminCatalog({
      companyId: siteConfig.companyId,
      websiteId: siteConfig.websiteDocId || siteConfig.websiteId,
    });

    return NextResponse.json(
      {
        success: true,
        company: siteConfig.companyId,
        website: siteConfig.websiteId,
        count: Array.isArray(products) ? products.length : 0,
        timestamp: Date.now(),
        products: Array.isArray(products) ? products : [],
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
          "Surrogate-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("[api/catalog] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch catalog",
        products: [],
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  }
}
