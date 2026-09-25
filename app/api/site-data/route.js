import { NextResponse } from "next/server";
import { fetchAdminSiteData } from "@/lib/admin-api";
import { getSiteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (!type) {
      return NextResponse.json(
        { success: false, error: "type is required" },
        { status: 400 }
      );
    }

    const siteConfig = getSiteConfig();
    const companyId = searchParams.get("companyId") || siteConfig.companyId || "global";
    const websiteId = searchParams.get("websiteId") || siteConfig.websiteDocId || siteConfig.websiteId || "globalbiomedicalsin";
    const district = searchParams.get("district") || "";
    const page = searchParams.get("page") || "";

    const data = await fetchAdminSiteData(type, {
      companyId,
      websiteId,
      district,
      page,
    });

    return NextResponse.json(
      {
        success: true,
        type,
        websiteId,
        companyId,
        data: data !== undefined ? data : null,
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("[api/site-data] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch site data",
        data: null,
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
