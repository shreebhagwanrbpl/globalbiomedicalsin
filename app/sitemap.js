import { adminDb } from "@/lib/firebase-admin";
export default async function sitemap() {
  const baseUrl =
    "https://globalbiomedicals.in";
  const staticPages = [
    "",
    "/about",
    "/contact",
    "/services",
    "/products",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified:
      new Date(),
  }));

  try {
    const snapshot =
      await adminDb
        .collection("websites")
        .doc(
          "globalbiomedicalsin"
        )
        .collection(
          "districts"
        )
        .get();

    const districtPages =
      [];

    snapshot.forEach(
      (districtDoc) => {
        const slug =
          districtDoc.id;

        districtPages.push(
          {
            url:
              `${baseUrl}/${slug}`,
            lastModified:
              new Date(),
          },

          {
            url:
              `${baseUrl}/${slug}/products`,
            lastModified:
              new Date(),
          },

          {
            url:
              `${baseUrl}/${slug}/services`,
            lastModified:
              new Date(),
          },

          {
            url:
              `${baseUrl}/${slug}/about`,
            lastModified:
              new Date(),
          },

          {
            url:
              `${baseUrl}/${slug}/contact`,
            lastModified:
              new Date(),
          }
        );
      }
    );

    return [
      ...staticPages,
      ...districtPages,
    ];
  } catch (error) {
    console.error(
      "Sitemap Error:",
      error
    );

    return staticPages;
  }
}

