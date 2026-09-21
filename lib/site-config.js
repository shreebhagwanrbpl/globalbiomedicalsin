/**
 * Site Configuration & Master Catalog Dynamic Identification
 */

// Helper to normalize website IDs and domain names (strip protocol, www, dots, dashes, spaces, slashes)
export function normalizeWebsiteId(str = "") {
  if (!str || typeof str !== "string") return "";
  return str
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "")
    .replace(/[^a-z0-9]/g, "");
}

// Known company websites registry for company detection
export const COMPANY_WEBSITES = {
  human: [
    "humanbiomedical.com",
    "humanbiomedical.org",
    "humanbiomedical.in",
    "humanbiomedical.co.in",
    "humanbiomedicals.com",
    "humanbiomedicals.org",
    "humanbiomedicals.in",
    "humanbiomedicals.co.in",
    "humanbiomedicalsin",
    "humanbiomedicalorg",
    "humanbiomedicalin",
    "humanbiomedicalcom",
  ],
  global: [
    "globalbiomedicals.in",
    "globalbiomedical.org",
    "globalbiomedical.in",
    "globalbiomedical.co.in",
    "globalbiomedicals.org",
    "globalbiomedicals.co.in",
    "globalbiomedical.com",
    "globalbiomedicals.com",
    "globalbiomedicalsin",
    "globalbiomedicalorg",
    "globalbiomedicalin",
    "globalbiomedicalcom",
    "globalbiomedicalsnet",
    "globalhealthkartcom",
  ],
  rajbiosis: [
    "rajbiosis.com",
    "rajbiosis.in",
    "rajbiosis.org",
    "rajbiosis.co.in",
    "rajbiosiscom",
    "rajbiosisorg",
    "rajbiosiscoin",
    "rajbiosis",
  ],
};

/**
 * Detect current website ID, domain, and company ID automatically.
 */
export function getSiteConfig() {
  // 1. Check environment variables
  const envWebsiteId =
    process.env.NEXT_PUBLIC_WEBSITE_ID ||
    process.env.WEBSITE_ID ||
    process.env.NEXT_PUBLIC_SITE_DOMAIN ||
    process.env.SITE_DOMAIN ||
    "";

  // 2. Default domain for this website
  const defaultDomain = "https://globalbiomedicals.in";
  const defaultWebsiteId = "globalbiomedicals.in";
  const defaultWebsiteDocId = "globalbiomedicalsin";

  const rawWebsiteId = envWebsiteId || defaultWebsiteId;
  const normalizedCurrent = normalizeWebsiteId(rawWebsiteId);

  // 3. Detect company (human | global | rajbiosis)
  let companyId = "global";
  if (
    normalizedCurrent.includes("human") ||
    process.env.NEXT_PUBLIC_COMPANY_ID === "human"
  ) {
    companyId = "human";
  } else if (
    normalizedCurrent.includes("rajbiosis") ||
    process.env.NEXT_PUBLIC_COMPANY_ID === "rajbiosis"
  ) {
    companyId = "rajbiosis";
  } else {
    companyId = "global";
  }

  // 4. Candidate normalized IDs that strictly represent THIS website
  // Note: Only globalbiomedicals.in / globalbiomedicalsin.
  // DO NOT include other separate domains like globalbiomedical.org, globalbiomedical.in, globalhealthkart.com, etc.
  const websiteAliases = [
    rawWebsiteId,
    defaultWebsiteId,
    defaultWebsiteDocId,
    "globalbiomedicals.in",
    "globalbiomedicalsin",
  ];

  const normalizedCandidates = Array.from(
    new Set(websiteAliases.map((s) => normalizeWebsiteId(s)).filter(Boolean))
  );

  return {
    companyId,
    websiteId: rawWebsiteId,
    websiteDocId: defaultWebsiteDocId,
    domain: process.env.NEXT_PUBLIC_DOMAIN || defaultDomain,
    normalizedWebsiteId: normalizedCurrent,
    normalizedCandidates,
    companyName:
      companyId === "human"
        ? "Human Biomedical"
        : companyId === "rajbiosis"
        ? "RajBiosis"
        : "Global Biomedical",
  };
}

/**
 * Bulletproof check if an entity (Category, Subcategory, or Product) is visible on this website.
 *
 * Rules:
 * 1. isPublished === false -> false (Hidden)
 * 2. websiteIds is missing or empty array ([]) -> false (Hidden, 0 websites selected)
 * 3. websiteIds includes "all" -> true (Shown)
 * 4. Normalized match between item.websiteIds and this website's normalized IDs.
 */
export function isItemVisibleOnWebsite(item, customSiteConfig = null) {
  if (!item || typeof item !== "object") return false;

  // Rule 1: isPublished check
  if (item.isPublished === false) {
    return false;
  }

  // Rule 2: websiteIds array check
  const websiteIds = item.websiteIds;
  if (!websiteIds || !Array.isArray(websiteIds) || websiteIds.length === 0) {
    // Empty array means unassigned from all websites (0 selected) -> Hide
    return false;
  }

  // Rule 3: websiteIds includes "all"
  if (websiteIds.some((id) => String(id).trim().toLowerCase() === "all")) {
    return true;
  }

  // Rule 4: Domain normalization matching
  const config = customSiteConfig || getSiteConfig();
  const currentNormalized = config.normalizedCandidates || [
    config.normalizedWebsiteId,
  ];

  const itemNormalizedIds = websiteIds
    .map((id) => normalizeWebsiteId(String(id)))
    .filter(Boolean);

  const hasMatch = itemNormalizedIds.some((itemId) =>
    currentNormalized.includes(itemId)
  );

  return hasMatch;
}
