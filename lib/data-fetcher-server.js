import {
  fetchAdminCatalog,
  fetchAdminDistricts,
  fetchAdminDistrict,
  fetchAdminSiteData,
} from "./admin-api";
import { getSiteConfig } from "./site-config";

/**
 * Fetch fresh products catalog from SQLite Admin API (with website and company scoping)
 * NO static hardcoded fallback products!
 */
export async function fetchFullCatalogRaw() {
  const siteConfig = getSiteConfig();
  try {
    const products = await fetchAdminCatalog({
      companyId: siteConfig.companyId,
      websiteId: siteConfig.websiteDocId || siteConfig.websiteId,
    });
    return Array.isArray(products) ? products : [];
  } catch (err) {
    console.error("[data-fetcher-server] Error fetching master catalog:", err);
    return [];
  }
}

/**
 * Server-side full catalog fetcher.
 * Kept dynamic with 0 stale cache for instant reflection of admin changes.
 */
export async function fetchFullCatalog() {
  return await fetchFullCatalogRaw();
}

/**
 * Fetch all districts from SQLite Admin API
 */
export async function fetchDistricts() {
  try {
    const districts = await fetchAdminDistricts();
    return Array.isArray(districts) ? districts : [];
  } catch (err) {
    console.error("[data-fetcher-server] Error fetching districts:", err);
    return [];
  }
}

/**
 * Fetch single district data from SQLite Admin API
 */
export async function fetchDistrictData(districtSlug) {
  if (!districtSlug) return null;
  try {
    return await fetchAdminDistrict(districtSlug);
  } catch (err) {
    console.error(`[data-fetcher-server] Error fetching district ${districtSlug}:`, err);
    return null;
  }
}

/**
 * Fetch generic site data (home, contact, services, etc.) from SQLite Admin API
 */
export async function fetchSiteData(type, options = {}) {
  try {
    return await fetchAdminSiteData(type, options);
  } catch (err) {
    console.error(`[data-fetcher-server] Error fetching site data ${type}:`, err);
    return null;
  }
}