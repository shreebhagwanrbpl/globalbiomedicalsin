import { getSiteConfig, isItemVisibleOnWebsite } from "./site-config";

/**
 * Base URL for the central Admin API.
 * MongoDB credentials must remain on the Admin server; this website calls
 * the Admin API and never connects directly to MongoDB.
 */
export const ADMIN_API_BASE_URL =
  process.env.ADMIN_API_BASE_URL ||
  process.env.ADMIN_API_URL ||
  process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL ||
  process.env.NEXT_PUBLIC_ADMIN_API_URL ||
  "https://admin.rajbiosis.app";

/**
 * Helper to construct Admin API endpoints
 */
export function getAdminApiUrl(endpoint = "") {
  const base = ADMIN_API_BASE_URL.replace(/\/+$/, "");
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
}

const makeSlug = (text = "") =>
  String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

/**
 * Fetch the website-scoped catalog from the central Admin API.
 * NO static hardcoded fallback products are returned.
 */
export async function fetchAdminCatalog(customOptions = {}) {
  const siteConfig = getSiteConfig();
  const companyId = customOptions.companyId || siteConfig.companyId || "global";
  const websiteId = customOptions.websiteId || siteConfig.websiteDocId || siteConfig.websiteId || "globalbiomedicalsin";

  const url = getAdminApiUrl(`/api/catalog?companyId=${encodeURIComponent(companyId)}&websiteId=${encodeURIComponent(websiteId)}&t=${Date.now()}`);

  try {
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });

    if (!res.ok) {
      console.warn(`[admin-api] Catalog API returned status ${res.status}`);
      return [];
    }

    const data = await res.json();
    let rawProducts = [];

    if (Array.isArray(data.products)) {
      rawProducts = data.products;
    } else if (Array.isArray(data.data)) {
      rawProducts = data.data;
    } else if (Array.isArray(data)) {
      rawProducts = data;
    }

    const seenProductKeys = new Set();
    const allProducts = [];

    for (const item of rawProducts) {
      if (!item || typeof item !== "object") continue;

      // Check visibility if websiteIds is present
      if (item.websiteIds && !isItemVisibleOnWebsite(item, siteConfig)) {
        continue;
      }
      if (item.isPublished === false || item.isPublished === 0 || item.is_published === false || item.is_published === 0) {
        continue;
      }

      const slug = item.slug || makeSlug(item.title || item.name || "");
      const uid = String(item.id || item.uid || slug);

      if (!seenProductKeys.has(uid)) {
        seenProductKeys.add(uid);
        allProducts.push({
          ...item,
          id: item.id || uid,
          uid,
          title: item.title || item.name || "Untitled Product",
          name: item.title || item.name || "Untitled Product",
          category: item.category || "Other Products",
          categoryId: item.categoryId || item.categorySlug || makeSlug(item.category || "Other Products"),
          subCategory: item.subCategory || item.subCategoryName || item.category || "Other Products",
          subcategoryId: item.subcategoryId || item.subCategorySlug || makeSlug(item.subCategory || item.category || "Other Products"),
          slug,
          companyId,
        });
      }
    }

    return allProducts;
  } catch (err) {
    console.error("[admin-api] Error fetching catalog from Admin API:", err);
    return [];
  }
}

/**
 * Fetch dynamic site data from the central Admin API by type (home, contact, services, etc.)
 * NO hardcoded static text/data fallback is returned.
 */
export async function fetchAdminSiteData(type, customOptions = {}) {
  if (!type) return null;

  const siteConfig = getSiteConfig();
  const companyId = customOptions.companyId || siteConfig.companyId || "global";
  const websiteId = customOptions.websiteId || siteConfig.websiteDocId || siteConfig.websiteId || "globalbiomedicalsin";
  const district = customOptions.district || "";
  const page = customOptions.page || "";

  let url = getAdminApiUrl(
    `/api/site-data?type=${encodeURIComponent(type)}&companyId=${encodeURIComponent(companyId)}&websiteId=${encodeURIComponent(websiteId)}`
  );
  if (district) url += `&district=${encodeURIComponent(district)}`;
  if (page) url += `&page=${encodeURIComponent(page)}`;
  url += `&t=${Date.now()}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });

    if (!res.ok) {
      return null;
    }

    const json = await res.json();
    if (json && json.success) {
      return json.data !== undefined ? json.data : json;
    }
    return null;
  } catch (err) {
    console.error(`[admin-api] Error fetching site-data (${type}):`, err);
    return null;
  }
}

/**
 * Fetch all districts from the central Admin API
 */
export async function fetchAdminDistricts(customOptions = {}) {
  const siteConfig = getSiteConfig();
  const companyId = customOptions.companyId || siteConfig.companyId || "global";
  const websiteId = customOptions.websiteId || siteConfig.websiteDocId || siteConfig.websiteId || "globalbiomedicalsin";

  const url = getAdminApiUrl(
    `/api/site-data?type=districts&companyId=${encodeURIComponent(companyId)}&websiteId=${encodeURIComponent(websiteId)}&t=${Date.now()}`
  );

  try {
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });

    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.districts)) return json.districts;
      if (Array.isArray(json.data)) return json.data;
      if (Array.isArray(json)) return json;
    }
    return [];
  } catch (err) {
    console.error("[admin-api] Error fetching districts:", err);
    return [];
  }
}

/**
 * Fetch single district data from the central Admin API
 */
export async function fetchAdminDistrict(districtSlug, customOptions = {}) {
  if (!districtSlug) return null;

  const siteConfig = getSiteConfig();
  const companyId = customOptions.companyId || siteConfig.companyId || "global";
  const websiteId = customOptions.websiteId || siteConfig.websiteDocId || siteConfig.websiteId || "globalbiomedicalsin";

  const url = getAdminApiUrl(
    `/api/site-data?type=district&district=${encodeURIComponent(districtSlug.toLowerCase())}&companyId=${encodeURIComponent(companyId)}&websiteId=${encodeURIComponent(websiteId)}&t=${Date.now()}`
  );

  try {
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });

    if (res.ok) {
      const json = await res.json();
      if (json && json.success && json.data) {
        return {
          id: json.data.id || districtSlug,
          slug: json.data.slug || districtSlug,
          ...json.data,
        };
      }
    }
    return null;
  } catch (err) {
    console.error(`[admin-api] Error fetching district (${districtSlug}):`, err);
    return null;
  }
}

/**
 * Submit contact enquiries to the Admin Panel's MongoDB-backed public endpoint.
 */
export async function submitAdminContactQuery(payload) {
  return submitPublicQuery({ ...payload, type: "contact" });
}

/**
 * Submit product enquiries to the Admin Panel's MongoDB-backed public endpoint.
 */
export async function submitAdminProductQuery(payload) {
  return submitPublicQuery({ ...payload, type: "product" });
}

async function submitPublicQuery(payload) {
  const url = getAdminApiUrl("/api/public-query");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || data?.success === false) {
    throw new Error(
      data?.error || data?.message || `Admin query API failed (${res.status})`
    );
  }

  return { ok: true, data };
}
