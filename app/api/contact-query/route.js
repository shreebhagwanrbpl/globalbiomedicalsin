import { NextResponse } from "next/server";
import { submitAdminContactQuery } from "@/lib/admin-api";
import { getSiteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject = "", message = "" } = body || {};

    if (!name?.trim() || !email?.trim() || !phone?.trim() || !message?.trim()) {
      return NextResponse.json(
        { success: false, error: "Please fill all required fields." },
        { status: 400 }
      );
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone.trim())) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const siteConfig = getSiteConfig();

    const payload = {
      type: "contact",
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      subject: subject?.trim() || "",
      message: message.trim(),
      companyId: body.companyId || siteConfig.companyId || "global",
      websiteId: body.websiteId || siteConfig.websiteDocId || siteConfig.websiteId || "globalbiomedicalsin",
      createdAt: new Date().toISOString(),
    };

    // Forward to SQLite Admin API
    await submitAdminContactQuery(payload);

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[api/contact-query] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to submit inquiry",
      },
      { status: 500 }
    );
  }
}
