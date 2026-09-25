import { getSiteConfig } from "./site-config.js";

/**
 * Fetch and process the entire products catalog from SQLite Admin API via /api/catalog.
 * NO hardcoded static product fallback.
 */
export async function fetchFullCatalog(options = {}) {
  try {
    const isBrowser = typeof window !== "undefined";
    const url = isBrowser
      ? `/api/catalog?t=${Date.now()}`
      : `${getSiteConfig().domain || "https://globalbiomedicals.in"}/api/catalog?t=${Date.now()}`;

    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.products)) {
        return data.products;
      }
    }
    return [];
  } catch (apiErr) {
    console.warn("[data-fetcher] /api/catalog fetch error:", apiErr);
    return [];
  }
}

/**
 * Fetch dynamic site data by type from /api/site-data
 */
export async function fetchSiteData(type, params = {}) {
  if (!type) return null;
  try {
    const isBrowser = typeof window !== "undefined";
    const baseUrl = isBrowser ? "" : (getSiteConfig().domain || "https://globalbiomedicals.in");
    let url = `${baseUrl}/api/site-data?type=${encodeURIComponent(type)}&t=${Date.now()}`;

    if (params.district) url += `&district=${encodeURIComponent(params.district)}`;
    if (params.page) url += `&page=${encodeURIComponent(params.page)}`;

    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });

    if (res.ok) {
      const json = await res.json();
      if (json && json.success) {
        return json.data !== undefined ? json.data : json;
      }
    }
    return null;
  } catch (err) {
    console.error(`[data-fetcher] Error fetching site-data (${type}):`, err);
    return null;
  }
}

export async function fetchHomeData() {
  return await fetchSiteData("home");
}

export async function fetchContactData() {
  return await fetchSiteData("contact");
}

export async function fetchServicesData() {
  return await fetchSiteData("services");
}

export async function fetchDistrictData(district) {
  if (!district) return null;
  return await fetchSiteData("district", { district: district.toLowerCase() });
}

export async function fetchDistricts() {
  const data = await fetchSiteData("districts");
  if (Array.isArray(data?.districts)) return data.districts;
  if (Array.isArray(data)) return data;
  return [];
}

/**
 * Compatibility helper for legacy fetchDoc calls
 */
export async function fetchDoc(path = "") {
  if (!path) return null;
  if (path.includes("pages/home")) return await fetchHomeData();
  if (path.includes("pages/contact")) return await fetchContactData();
  if (path.includes("pages/services")) return await fetchServicesData();
  if (path.includes("districts/")) {
    const parts = path.split("districts/");
    const slug = parts[parts.length - 1];
    return await fetchDistrictData(slug);
  }
  return null;
}
