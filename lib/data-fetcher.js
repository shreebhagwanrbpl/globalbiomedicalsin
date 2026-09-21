import { db } from "./firebase.js";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { getSiteConfig, isItemVisibleOnWebsite } from "./site-config.js";

const makeSlug = (text = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

/**
 * Fetch and process the entire products catalog from Master Catalog.
 * Can fetch from dynamic /api/catalog route (client-side) or directly from Firestore.
 */
export async function fetchFullCatalog(options = {}) {
  const { force = false } = options;

  // On client browser, fetch from the zero-cache /api/catalog endpoint for instant real-time sync
  if (typeof window !== "undefined") {
    try {
      const res = await fetch(`/api/catalog?t=${Date.now()}`, {
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
    } catch (apiErr) {
      console.warn("[data-fetcher] API /api/catalog fetch failed, falling back to direct Firestore:", apiErr);
    }
  }

  // Fallback: Direct Firestore Master Catalog Read
  const siteConfig = getSiteConfig();
  const companyId = siteConfig.companyId;
  const allProducts = [];
  const seenProductKeys = new Set();

  try {
    // 1. Master Categories from companies/{companyId}/categories
    const categorySnap = await getDocs(
      collection(db, "companies", companyId, "categories")
    );

    await Promise.all(
      categorySnap.docs.map(async (categoryDoc) => {
        const catData = categoryDoc.data() || {};
        const categoryName = catData.name || catData.category || categoryDoc.id;
        const categorySlug = catData.slug || categoryDoc.id;

        // CASCADE HIDE: Hide entire category if unassigned / unpublished
        if (!isItemVisibleOnWebsite(catData, siteConfig)) {
          return;
        }

        try {
          const subCol = collection(
            db,
            "companies",
            companyId,
            "categories",
            categoryDoc.id,
            "subcategories"
          );
          const subSnap = await getDocs(subCol);

          for (const subDoc of subSnap.docs) {
            const subData = subDoc.data() || {};
            const subCategoryName = subData.name || subData.subCategory || subDoc.id;
            const subCategorySlug = subData.slug || subDoc.id;

            // CASCADE HIDE: Hide entire subcategory if unassigned / unpublished
            if (!isItemVisibleOnWebsite(subData, siteConfig)) {
              continue;
            }

            // A. Embedded products array
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

            // B. Subcollection products
            try {
              const pCol = collection(
                db,
                "companies",
                companyId,
                "categories",
                categoryDoc.id,
                "subcategories",
                subDoc.id,
                "products"
              );
              const pSnap = await getDocs(pCol);
              pSnap.forEach((prodDoc) => {
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
            } catch (pErr) {
              // ignore
            }
          }
        } catch (subErr) {
          console.error(`Error reading subcategories for ${categoryDoc.id}:`, subErr);
        }

        // Direct category products
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
      })
    );

    // 2. Master Normal Products
    try {
      const companyProdsSnap = await getDocs(
        collection(db, "companies", companyId, "products")
      );
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

    // 3. Fallback to website level docs if empty
    if (allProducts.length === 0) {
      const candidates = [
        siteConfig.websiteDocId,
        "globalbiomedicalsin",
        "globalbiomedicals.in",
      ];
      for (const wId of candidates) {
        try {
          const categorySnap = await getDocs(
            collection(
              db,
              "websites",
              wId,
              "pages",
              "categoryproducts",
              "categories"
            )
          );

          await Promise.all(
            categorySnap.docs.map(async (categoryDoc) => {
              const data = categoryDoc.data() || {};
              const categoryName = data.category || data.name || categoryDoc.id;

              if (!isItemVisibleOnWebsite(data, siteConfig) && data.isPublished === false) {
                return;
              }

              const subcategoriesCol = collection(
                db,
                "websites",
                wId,
                "pages",
                "categoryproducts",
                "categories",
                categoryDoc.id,
                "subcategories"
              );

              const subcategoriesSnap = await getDocs(subcategoriesCol);
              subcategoriesSnap.forEach((subDoc) => {
                const subData = subDoc.data() || {};
                const subCategoryName = subData.subCategory || subData.name || subDoc.id;

                (subData.products || [])
                  .filter((p) => isItemVisibleOnWebsite(p, siteConfig))
                  .forEach((item, index) => {
                    const slug = item.slug || makeSlug(item.title);
                    const uid = `${categoryDoc.id}-${subDoc.id}-${index}`;
                    if (!seenProductKeys.has(uid)) {
                      seenProductKeys.add(uid);
                      allProducts.push({
                        ...item,
                        uid,
                        category: categoryName,
                        subCategory: subCategoryName,
                        slug,
                      });
                    }
                  });
              });

              if (data.products?.length) {
                data.products
                  .filter((p) => isItemVisibleOnWebsite(p, siteConfig))
                  .forEach((item, index) => {
                    const slug = item.slug || makeSlug(item.title);
                    const uid = `${categoryDoc.id}-direct-${index}`;
                    if (!seenProductKeys.has(uid)) {
                      seenProductKeys.add(uid);
                      allProducts.push({
                        ...item,
                        uid,
                        category: categoryName,
                        subCategory: item.subCategory || categoryName,
                        slug,
                      });
                    }
                  });
              }
            })
          );

          // Legacy Products
          const oldSnap = await getDoc(
            doc(db, "websites", wId, "pages", "products")
          );

          if (oldSnap.exists()) {
            const oldProducts = (oldSnap.data()?.products || [])
              .filter((p) => isItemVisibleOnWebsite(p, siteConfig))
              .map((item, index) => ({
                ...item,
                uid: `other-${index}`,
                category: "Other Products",
                subCategory: item.subCategory || "Other Products",
                slug: item.slug || makeSlug(item.title),
              }));

            oldProducts.forEach((p) => {
              if (!seenProductKeys.has(p.uid)) {
                seenProductKeys.add(p.uid);
                allProducts.push(p);
              }
            });
          }

          if (allProducts.length > 0) break;
        } catch (e) {
          // ignore
        }
      }
    }
  } catch (err) {
    console.error("[data-fetcher] Error in fetchFullCatalog:", err);
  }

  return allProducts;
}

/**
 * Fetch a single document by relative path
 */
export async function fetchDoc(path) {
  try {
    const parts = path.split("/");
    const docRef = doc(db, ...parts);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (err) {
    console.error(`Error fetching doc at ${path}:`, err);
    return null;
  }
}

export async function fetchHomeData() {
  const siteConfig = getSiteConfig();
  const res = await fetchDoc(`websites/${siteConfig.websiteDocId}/pages/home`);
  if (res) return res;
  return await fetchDoc(`websites/globalbiomedicalorg/pages/home`);
}

export async function fetchContactData() {
  const siteConfig = getSiteConfig();
  const res = await fetchDoc(`websites/${siteConfig.websiteDocId}/pages/contact`);
  if (res) return res;
  return await fetchDoc(`websites/globalbiomedicalorg/pages/contact`);
}

export async function fetchServicesData() {
  const siteConfig = getSiteConfig();
  const res = await fetchDoc(`websites/${siteConfig.websiteDocId}/pages/services`);
  if (res) return res;
  return await fetchDoc(`websites/globalbiomedicalorg/pages/services`);
}

export async function fetchDistrictData(district) {
  if (!district) return null;
  const siteConfig = getSiteConfig();
  const res = await fetchDoc(`websites/${siteConfig.websiteDocId}/districts/${district.toLowerCase()}`);
  if (res) return res;
  return await fetchDoc(`websites/globalbiomedicalorg/districts/${district.toLowerCase()}`);
}
