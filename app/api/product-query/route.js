import { NextResponse } from "next/server";
import { submitAdminProductQuery } from "@/lib/admin-api";
import { getSiteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      productName = "",
      productSlug = "",
      brand = "",
      model = "",
    } = body || {};

    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: "Name is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email?.trim() || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Enter valid email address." },
        { status: 400 }
      );
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone?.trim() || !phoneRegex.test(phone.trim())) {
      return NextResponse.json(
        { success: false, error: "Enter valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    const siteConfig = getSiteConfig();

    const payload = {
      type: "product",
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      productName: productName || "",
      productSlug: productSlug || "",
      brand: brand || "",
      model: model || "",
      companyId: body.companyId || siteConfig.companyId || "global",
      websiteId: body.websiteId || siteConfig.websiteDocId || siteConfig.websiteId || "globalbiomedicalsin",
      createdAt: new Date().toISOString(),
    };

    // Forward to SQLite Admin API
    await submitAdminProductQuery(payload);

    return NextResponse.json(
      {
        success: true,
        message: "Your enquiry has been submitted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[api/product-query] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to submit product enquiry",
      },
      { status: 500 }
    );
  }
}
