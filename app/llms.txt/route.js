import { NextResponse } from "next/server";
import { fetchFullCatalogRaw, fetchDistricts } from "@/lib/data-fetcher-server";
import { getSiteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const siteConfig = getSiteConfig();
    const DOMAIN = siteConfig.domain;
    const COMPANY_NAME = siteConfig.companyName;

    const [products, districts] = await Promise.all([
      fetchFullCatalogRaw(),
      fetchDistricts(),
    ]);

    // Group products by category
    const categoriesMap = {};
    products.forEach((prod) => {
      const cat = prod.category || "General Products";
      if (!categoriesMap[cat]) {
        categoriesMap[cat] = [];
      }
      categoriesMap[cat].push(prod);
    });

    // Category Markdown
    const categoryText = Object.entries(categoriesMap)
      .map(([catName, list]) => {
        const productList = list.map((item) => `- ${item.title || item.name}`).join("\n");
        return `
## ${catName}
Total Products: ${list.length}

Products:
${productList || "No Products"}
`;
      })
      .join("\n");

    // Product Markdown
    const productText =
      products.length > 0
        ? products
            .map((product) => {
              return `
# ${product.title || product.name}

Category: ${product.category || "N/A"}
Subcategory: ${product.subCategory || "N/A"}
Brand: ${product.brand || COMPANY_NAME}
Model: ${product.model || "N/A"}
Description: ${product.desc || product.description || "No description available"}
Instrument: ${product.instrument || "N/A"}
Automation: ${product.automation || "N/A"}
Usage: ${product.usage || "N/A"}
Throughput: ${product.throughput || "N/A"}
Capacity: ${product.capacity || "N/A"}
Availability: ${product.availability || "In Stock"}
Price: ${product.price ? `₹${product.price}` : "Contact for Price"}
Product URL: ${DOMAIN}/products/${product.slug || product.id}
`;
            })
            .join("\n")
        : "No Products Found";

    // District Markdown
    const districtText =
      districts.length > 0
        ? districts.map((item) => `${DOMAIN}/${item.slug}`).join("\n")
        : "No Districts Found";

    const content = `
## Statistics
Products: ${products.length}
Categories: ${Object.keys(categoriesMap).length}
Districts: ${districts.length}

# ${COMPANY_NAME}
India's Trusted Biomedical and Laboratory Equipment Supplier

Website: ${DOMAIN}
Published Products: ${products.length}
Categories: ${Object.keys(categoriesMap).length}
District Pages: ${districts.length}

## Company Overview
${COMPANY_NAME} is a leading supplier of laboratory equipment, diagnostic analyzers, biomedical instruments, reagents, and healthcare equipment across India.

## Services
- Biomedical Equipment Supply
- Laboratory Equipment
- Diagnostic Equipment
- Installation & Setup
- Annual Maintenance Contracts (AMC)
- Calibration & Testing
- Repair & Technical Support
- Pan India Delivery

------------------------------------------------
## Categories
${categoryText || "No Categories Found"}

------------------------------------------------
## Products
${productText}

------------------------------------------------
## District Pages
${districtText}

------------------------------------------------
Sitemap: ${DOMAIN}/sitemap.xml
Robots: ${DOMAIN}/robots.txt
Contact: ${DOMAIN}/contact
Last Updated: ${new Date().toISOString()}
`;

    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (e) {
    console.error("[llms.txt] Error:", e);
    return NextResponse.json(
      {
        success: false,
        error: e.message,
      },
      {
        status: 500,
      }
    );
  }
}