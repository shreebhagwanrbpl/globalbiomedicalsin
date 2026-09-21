import { fetchFullCatalog, fetchDistricts } from "@/lib/data-fetcher-server";
import { getSiteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap() {
  const siteConfig = getSiteConfig();
  const baseUrl = siteConfig.domain;

  const staticPages = [
    "",
    "/about",
    "/contact",
    "/services",
    "/products",
    "/items",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  try {
    const [districts, products] = await Promise.all([
      fetchDistricts(),
      fetchFullCatalog(),
    ]);

    const districtPages = [];
    districts.forEach((dist) => {
      const slug = dist.slug || dist.id;
      districtPages.push(
        {
          url: `${baseUrl}/${slug}`,
          lastModified: new Date(),
        },
        {
          url: `${baseUrl}/${slug}/products`,
          lastModified: new Date(),
        },
        {
          url: `${baseUrl}/${slug}/items`,
          lastModified: new Date(),
        },
        {
          url: `${baseUrl}/${slug}/services`,
          lastModified: new Date(),
        },
        {
          url: `${baseUrl}/${slug}/about`,
          lastModified: new Date(),
        },
        {
          url: `${baseUrl}/${slug}/contact`,
          lastModified: new Date(),
        }
      );
    });

    const productPages = [];
    products.forEach((prod) => {
      if (prod.slug) {
        productPages.push(
          {
            url: `${baseUrl}/products/${prod.slug}`,
            lastModified: new Date(),
          },
          {
            url: `${baseUrl}/items/${prod.slug}`,
            lastModified: new Date(),
          }
        );
      }
    });

    return [...staticPages, ...districtPages, ...productPages];
  } catch (error) {
    console.error("[sitemap] Error generating sitemap:", error);
    return staticPages;
  }
}
