import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "aos/dist/aos.css";
import "./globals.css";

import AOSInit from "./components/AOSInit";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingContact from "./components/FloatingContact";

export const metadata = {
  metadataBase: new URL("https://globalbiomedicals.in"),

  title: {
    default: "Global Biomedical LLP | Laboratory & Medical Equipment Supplier",
    template: "%s | Global Biomedical LLP",
  },

  description:
    "Global Biomedical LLP is a trusted supplier of laboratory equipment, diagnostic analyzers, biomedical instruments, reagents, hospital furniture, and healthcare solutions across India.",

  keywords: [
    "Global Biomedical LLP",
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
      name: "Global Biomedical LLP",
    },
  ],

  creator: "Global Biomedical LLP",
  publisher: "Global Biomedical LLP",

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
    title: "Global Biomedical LLP | Laboratory & Medical Equipment Supplier",
    description:
      "Trusted supplier of laboratory equipment, diagnostic analyzers, biomedical instruments, reagents, and healthcare solutions.",
    url: "https://globalbiomedicals.in",
    siteName: "Global Biomedical LLP",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Global Biomedical LLP",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Global Biomedical LLP | Laboratory & Medical Equipment Supplier",
    description:
      "Trusted supplier of laboratory equipment, biomedical instruments, analyzers, and healthcare solutions.",
    images: ["/og-image.jpg"],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Global Biomedical LLP",
              url: "https://globalbiomedicals.in",
              logo: "https://globalbiomedicals.in/globallogo.png",
              image: "https://globalbiomedicals.in/og-image.jpg",
              description:
                "Trusted supplier of laboratory equipment, diagnostic analyzers, biomedical instruments, reagents, and healthcare solutions.",
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  telephone: "+91-9257984336",
                  contactType: "sales",
                },
                {
                  "@type": "ContactPoint",
                  telephone: "+91-8529833535",
                  contactType: "customer service",
                },
                {
                  "@type": "ContactPoint",
                  telephone: "+91-9983301657",
                  contactType: "helpline",
                },
              ],
            }),
          }}
        />

        <AOSInit />

        <Navbar />

        <main style={{ position: "relative", zIndex: 1 }}>
          {children}
        </main>

        <Footer />

        <FloatingContact />
      </body>
    </html>
  );
}