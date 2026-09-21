import { adminDb } from "./firebase-admin.js";
import { getSiteConfig, isItemVisibleOnWebsite, normalizeWebsiteId } from "./site-config.js";

const makeSlug = (text = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

/**
 * Fetch fresh products catalog from Firestore Master Catalog (companies/{companyId})
 * with strict cascade visibility and domain normalization.
 */
export async function fetchFullCatalogRaw() {
  const siteConfig = getSiteConfig();
  const companyId = siteConfig.companyId;
  const allProducts = [];
  const seenProductKeys = new Set();

  try {
    // ==========================================
    // 1. MASTER CATALOG: Companies/{companyId}/categories
    // ==========================================
    const companyRef = adminDb.collection("companies").doc(companyId);
    const categorySnap = await companyRef.collection("categories").get();

    for (const categoryDoc of categorySnap.docs) {
      const catData = categoryDoc.data() || {};
      const categoryName = catData.name || catData.category || categoryDoc.id;
      const categorySlug = catData.slug || categoryDoc.id;

      // HIERARCHY CASCADE RULE: If category is hidden/unassigned, hide ALL its subcategories & products!
      if (!isItemVisibleOnWebsite(catData, siteConfig)) {
        continue;
      }

      // Fetch subcategories
      const subSnap = await categoryDoc.ref.collection("subcategories").get();

      for (const subDoc of subSnap.docs) {
        const subData = subDoc.data() || {};
        const subCategoryName = subData.name || subData.subCategory || subDoc.id;
        const subCategorySlug = subData.slug || subDoc.id;

        // HIERARCHY CASCADE RULE: If subcategory is hidden/unassigned, hide ALL its products!
        if (!isItemVisibleOnWebsite(subData, siteConfig)) {
          continue;
        }

        // A. Products embedded in subcategory document array
        if (Array.isArray(subData.products)) {
          subData.products.forEach((item, index) => {
            if (isItemVisibleOnWebsite(item, siteConfig)) {
              const slug = item.slug || makeSlug(item.title || item.name || "");
              const uid = item.id || `${categoryDoc.id}-${subDoc.id}-${index}`;
              const dedupKey = item.id || `${categorySlug}-${subCategorySlug}-${slug}`;

              if (!seenProductKeys.has(dedupKey)) {
                seenProductKeys.add(dedupKey);
                allProducts.push({
                  ...item,
                  id: item.id || uid,
                  uid,
                  title: item.title || item.name || "Untitled Product",
                  name: item.title || item.name || "Untitled Product",
                  category: categoryName,
                  categoryId: categorySlug,
                  subCategory: subCategoryName,
                  subcategoryId: subCategorySlug,
                  slug,
                  companyId,
                });
              }
            }
          });
        }

        // B. Products stored in subcollection subcategories/{subId}/products
        try {
          const prodsSubSnap = await subDoc.ref.collection("products").get();
          prodsSubSnap.forEach((prodDoc) => {
            const pData = prodDoc.data() || {};
            if (isItemVisibleOnWebsite(pData, siteConfig)) {
              const slug = pData.slug || makeSlug(pData.title || pData.name || "");
              const uid = prodDoc.id;
              const dedupKey = prodDoc.id;

              if (!seenProductKeys.has(dedupKey)) {
                seenProductKeys.add(dedupKey);
                allProducts.push({
                  ...pData,
                  id: prodDoc.id,
                  uid,
                  title: pData.title || pData.name || "Untitled Product",
                  name: pData.title || pData.name || "Untitled Product",
                  category: categoryName,
                  categoryId: categorySlug,
                  subCategory: subCategoryName,
                  subcategoryId: subCategorySlug,
                  slug,
                  companyId,
                });
              }
            }
          });
        } catch (e) {
          // Subcollection might not exist, ignore
        }
      }

      // Direct category products (if any)
      if (Array.isArray(catData.products)) {
        catData.products.forEach((item, index) => {
          if (isItemVisibleOnWebsite(item, siteConfig)) {
            const slug = item.slug || makeSlug(item.title || item.name || "");
            const uid = item.id || `${categoryDoc.id}-direct-${index}`;
            const dedupKey = item.id || `${categorySlug}-direct-${slug}`;

            if (!seenProductKeys.has(dedupKey)) {
              seenProductKeys.add(dedupKey);
              allProducts.push({
                ...item,
                id: item.id || uid,
                uid,
                title: item.title || item.name || "Untitled Product",
                name: item.title || item.name || "Untitled Product",
                category: categoryName,
                categoryId: categorySlug,
                subCategory: item.subCategory || categoryName,
                subcategoryId: categorySlug,
                slug,
                companyId,
              });
            }
          }
        });
      }
    }

    // ==========================================
    // 2. MASTER NORMAL PRODUCTS: Companies/{companyId}/products
    // ==========================================
    try {
      const companyProdsSnap = await companyRef.collection("products").get();
      companyProdsSnap.forEach((prodDoc) => {
        const pData = prodDoc.data() || {};
        if (isItemVisibleOnWebsite(pData, siteConfig)) {
          const slug = pData.slug || makeSlug(pData.title || pData.name || "");
          const dedupKey = prodDoc.id;

          if (!seenProductKeys.has(dedupKey)) {
            seenProductKeys.add(dedupKey);
            allProducts.push({
              ...pData,
              id: prodDoc.id,
              uid: prodDoc.id,
              title: pData.title || pData.name || "Untitled Product",
              name: pData.title || pData.name || "Untitled Product",
              category: pData.category || "Other Products",
              subCategory: pData.subCategory || pData.category || "Other Products",
              slug,
              companyId,
            });
          }
        }
      });
    } catch (e) {
      // ignore
    }

    // ==========================================
    // 3. FALLBACK: Website-level documents (if master catalog is empty)
    // ==========================================
    if (allProducts.length === 0) {
      const websiteIdsToCheck = [
        siteConfig.websiteDocId,
        "globalbiomedicalsin",
        "globalbiomedicals.in",
      ];

      for (const wId of websiteIdsToCheck) {
        try {
          const catSnap = await adminDb
            .collection("websites")
            .doc(wId)
            .collection("pages")
            .doc("categoryproducts")
            .collection("categories")
            .get();

          for (const cDoc of catSnap.docs) {
            const data = cDoc.data() || {};
            const catName = data.category || data.name || cDoc.id;

            if (!isItemVisibleOnWebsite(data, siteConfig) && data.isPublished === false) {
              continue;
            }

            const sSnap = await cDoc.ref.collection("subcategories").get();
            for (const sDoc of sSnap.docs) {
              const sData = sDoc.data() || {};
              const subName = sData.subCategory || sData.name || sDoc.id;

              (sData.products || [])
                .filter((p) => isItemVisibleOnWebsite(p, siteConfig))
                .forEach((item, index) => {
                  const slug = item.slug || makeSlug(item.title);
                  const uid = `${cDoc.id}-${sDoc.id}-${index}`;
                  if (!seenProductKeys.has(uid)) {
                    seenProductKeys.add(uid);
                    allProducts.push({
                      ...item,
                      uid,
                      category: catName,
                      subCategory: subName,
                      slug,
                    });
                  }
                });
            }

            // Direct category products
            (data.products || [])
              .filter((p) => isItemVisibleOnWebsite(p, siteConfig))
              .forEach((item, index) => {
                const slug = item.slug || makeSlug(item.title);
                const uid = `${cDoc.id}-direct-${index}`;
                if (!seenProductKeys.has(uid)) {
                  seenProductKeys.add(uid);
                  allProducts.push({
                    ...item,
                    uid,
                    category: catName,
                    subCategory: item.subCategory || catName,
                    slug,
                  });
                }
              });
          }

          // Legacy products
          const oldDoc = await adminDb
            .collection("websites")
            .doc(wId)
            .collection("pages")
            .doc("products")
            .get();

          if (oldDoc.exists) {
            const oldProducts = oldDoc.data()?.products || [];
            oldProducts
              .filter((p) => isItemVisibleOnWebsite(p, siteConfig))
              .forEach((item, index) => {
                const slug = item.slug || makeSlug(item.title);
                const uid = `legacy-${index}`;
                if (!seenProductKeys.has(uid)) {
                  seenProductKeys.add(uid);
                  allProducts.push({
                    ...item,
                    uid,
                    category: "Other Products",
                    subCategory: item.subCategory || "Other Products",
                    slug,
                  });
                }
              });
          }

          if (allProducts.length > 0) break;
        } catch (err) {
          // ignore fallback error
        }
      }
    }
  } catch (err) {
    console.error("[data-fetcher-server] Error fetching master catalog:", err);
  }

  return allProducts;
}

/**
 * Server-side full catalog fetcher.
 * Kept dynamic with 0 stale cache for instant reflection of admin visibility changes.
 */
export async function fetchFullCatalog() {
  return await fetchFullCatalogRaw();
}

/**
 * Fetch all districts from websites/{websiteId}/districts
 */
export async function fetchDistricts() {
  const siteConfig = getSiteConfig();
  const districtIds = [siteConfig.websiteDocId, "globalbiomedicalsin", "globalbiomedicalorg"];

  for (const wId of districtIds) {
    try {
      const snap = await adminDb
        .collection("websites")
        .doc(wId)
        .collection("districts")
        .get();

      if (!snap.empty) {
        return snap.docs.map((doc) => ({
          id: doc.id,
          slug: doc.id,
          ...doc.data(),
        }));
      }
    } catch (err) {
      // continue to next candidate
    }
  }
  return [];
}

/**
 * Fetch single district data
 */
export async function fetchDistrictData(districtSlug) {
  if (!districtSlug) return null;
  const siteConfig = getSiteConfig();
  const districtIds = [siteConfig.websiteDocId, "globalbiomedicalsin", "globalbiomedicalorg"];

  for (const wId of districtIds) {
    try {
      const snap = await adminDb
        .collection("websites")
        .doc(wId)
        .collection("districts")
        .doc(districtSlug.toLowerCase())
        .get();

      if (snap.exists) {
        return {
          id: snap.id,
          slug: snap.id,
          ...snap.data(),
        };
      }
    } catch (err) {
      // continue
    }
  }
  return null;
}