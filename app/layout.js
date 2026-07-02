import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "aos/dist/aos.css";
import "./globals.css";
// import Script from "next/script";

import AOSInit from "./components/AOSInit";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata = {
  metadataBase: new URL("https://globalbiomedicals.in"),

  title: {
    default: "Global Biomedical | Laboratory & Medical Equipment Supplier",
    template: "%s | Global Biomedical",
  },

  description:
    "Global Biomedical is a trusted supplier of laboratory equipment, diagnostic analyzers, biomedical instruments, reagents, hospital equipment, and healthcare solutions across India.",

  keywords: [
    "Global Biomedical",
    "Laboratory Equipment",
    "Medical Equipment",
    "Biomedical Equipment",
    "Diagnostic Instruments",
    "Laboratory Analyzers",
    "Hospital Equipment",
    "Medical Devices",
    "Laboratory Reagents",
    "Healthcare Solutions",
    "Diagnostic Lab Equipment",
    "Clinical Instruments",
    "Pathology Equipment",
    "Biomedical Supplier India",
  ],

  authors: [
    {
      name: "Global Biomedical",
    },
  ],

  creator: "Global Biomedical",
  publisher: "Global Biomedical",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },

  openGraph: {
    title: "Global Biomedical | Laboratory & Medical Equipment Supplier",
    description:
      "Trusted supplier of laboratory equipment, diagnostic analyzers, biomedical instruments, reagents, and healthcare solutions.",
    url: "https://globalbiomedicals.in",
    siteName: "Global Biomedical",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", // Replace with your OG image
        width: 1200,
        height: 630,
        alt: "Global Biomedical",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Global Biomedical | Laboratory & Medical Equipment Supplier",
    description:
      "Trusted supplier of laboratory equipment, biomedical instruments, analyzers, and healthcare solutions.",
    images: ["/og-image.jpg"], // Replace with your OG image
  },

  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },

  category: "Healthcare",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      
      <body>
         {/* <Script
    id="organization-schema"
    type="application/ld+json"
    strategy="beforeInteractive"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Global Biomedical",
        url: "https://globalbiomedical.in",
        logo: "https://globalbiomedical.in/logo.png",
        image: "https://globalbiomedical.in/og-image.jpg",
        description:
          "Trusted supplier of laboratory equipment, diagnostic analyzers, biomedical instruments, reagents, and healthcare solutions.",
        sameAs: [],
      }),
    }}
  /> */}

  <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Global Biomedical",
      url: "https://globalbiomedicals.in",
      logo: "https://globalbiomedicals.in/logo.png",
      image: "https://globalbiomedicals.in/og-image.jpg",
      description:
        "Trusted supplier of laboratory equipment, diagnostic analyzers, biomedical instruments, reagents, and healthcare solutions.",
      sameAs: [],
    }),
  }}
/>

        <AOSInit />

        <Navbar />

        {children}

        <Footer />
      </body>
    </html>
  );
}