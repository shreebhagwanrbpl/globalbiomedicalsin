import { adminDb } from "@/lib/firebase-admin";
import { redirect } from "next/navigation";

async function getProduct(slug) {
  const snap = await adminDb
    .collection("websites")
    .doc("globalbiomedicalsin")
    .collection("pages")
    .doc("products")
    .get();

  if (!snap.exists) return null;

  const products = snap.data().products || [];

  return (
    products.find((p) => {
      const generatedSlug = p.title
        ?.toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

      return generatedSlug === slug;
    }) || null
  );
}

export async function generateMetadata({ params }) {
  const product = await getProduct(params.slug);

  if (!product) {
    return {
      title: "Product",
    };
  }

  return {
    title: product.title,
    description: product.desc,

    openGraph: {
      title: product.title,
      description: product.desc,
      url: `https://globalbiomedicals.in/share/${params.slug}`, // <-- apna domain
      siteName: "Global Biomedicals",
      images: [
        {
          url: product.images?.[0],
          width: 1200,
          height: 630,
        },
      ],
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.desc,
      images: [product.images?.[0]],
    },
  };
}

export default async function SharePage({ params }) {

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            setTimeout(() => {
              window.location.href="/products/${params.slug}";
            },1500);
          `,
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "20px",
          fontWeight: "600",
        }}
      >
        Redirecting...
      </div>
    </>
  );
}