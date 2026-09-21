"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchContactData, fetchDistrictData } from "@/lib/data-fetcher";
export default function Footer() {
  const [contactInfo, setContactInfo] = useState([]);
  const [stateName, setStateName] = useState("");
  const [validCity, setValidCity] = useState(false);

  const pathname = usePathname();
  const pathParts = pathname.split("/").filter(Boolean);
  const firstPart = pathParts[0];
  const reservedRoutes = [
    "about",
    "contact",
    "items",
    "products",
    "services",
  ];

  // district slug
  const district =
    pathParts[0] && !reservedRoutes.includes(pathParts[0])
      ? pathParts[0]
      : null;

  // format city
  const formatCity = (name = "") =>
    name
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const citySlug =
    firstPart && !reservedRoutes.includes(firstPart)
      ? firstPart
      : "jaipur";

  const city = formatCity(citySlug);

  const makeLink = (path = "") => {
    if (!path) {
      return `/${citySlug}`;
    }
    return `/${citySlug}${path}`;
  };

  const categories = [
    { name: "ICU & OT Equipment", path: "/products?category=ICU%20%26%20Operation%20Theatre%20Equipment" },
    { name: "Diagnostic Analyzers", path: "/products?category=Diagnostic%20%26%20Laboratory%20Analyzers" },
    { name: "Biomedical Instruments", path: "/products?category=Biomedical%20%26%20Clinical%20Instruments" },
    { name: "Hospital Furniture", path: "/products?category=Hospital%20Furniture%20%26%20Patient%20Care" },
    { name: "Medical Reagents", path: "/products?category=Medical%20Consumables%20%26%20Reagents" },
  ];

  const phoneNumbers = [
    { number: "9257984336", label: "Sales & Inquiry" },
    { number: "8529833535", label: "Support & Orders" },
    { number: "9983301657", label: "Helpline" },
  ];

  useEffect(() => {
    let isMounted = true;
    const fetchContact = async () => {
      try {
        const data = await fetchContactData();
        if (isMounted && data) {
          setContactInfo(data.contactInfo || []);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchContact();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadDistrict = async () => {
      if (!district) {
        setValidCity(false);
        return;
      }
      try {
        const data = await fetchDistrictData(citySlug);
        if (isMounted) {
          if (data) {
            setValidCity(true);
            setStateName(data?.state || "");
          } else {
            setValidCity(false);
            setStateName("");
          }
        }
      } catch (err) {
        console.log(err);
        if (isMounted) setValidCity(false);
      }
    };
    loadDistrict();
    return () => {
      isMounted = false;
    };
  }, [citySlug, district]);

  return (
    <>
      <footer className="footer bg-dark text-white pt-5 pb-3 position-relative no-print">
        <div className="container py-4">
          <div className="row gy-4 justify-content-between">

            {/* COMPANY INFO */}
            <div className="col-lg-3 col-md-6">
              <h4 className="fw-bold text-white mb-2" style={{ color: "#fff" }}>
                Global Biomedical LLP
              </h4>
              <p className="small text-white-50 mb-3">
                Trusted partner for diagnostic instruments, laboratory analyzers, hospital furniture, and medical consumables across India.
              </p>

              {/* SOCIAL MEDIA ICONS */}
              <div className="social-media-container mt-2">
                <h6 className="small fw-bold text-uppercase text-light mb-2">Connect With Us</h6>
                <div className="d-flex gap-2">
                  <a
                    href="https://wa.me/919257984336?text=Hello%20Global%20Biomedical%20LLP"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-btn whatsapp"
                    title="WhatsApp"
                  >
                    <i className="bi bi-whatsapp"></i>
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-btn facebook"
                    title="Facebook"
                  >
                    <i className="bi bi-facebook"></i>
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-btn instagram"
                    title="Instagram"
                  >
                    <i className="bi bi-instagram"></i>
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-btn linkedin"
                    title="LinkedIn"
                  >
                    <i className="bi bi-linkedin"></i>
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-btn youtube"
                    title="YouTube"
                  >
                    <i className="bi bi-youtube"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* QUICK LINKS */}
            <div className="col-lg-2 col-md-6">
              <h6 className="footer-title fw-bold text-white mb-3">Quick Links</h6>
              <ul className="footer-links">
                <li><Link href={makeLink("")} className="footer-link">Home</Link></li>
                <li><Link href={makeLink("/products")} className="footer-link">Products Catalog</Link></li>
                <li><Link href={makeLink("/services")} className="footer-link">Our Services</Link></li>
                <li><Link href={makeLink("/about")} className="footer-link">About Us</Link></li>
                <li><Link href={makeLink("/contact")} className="footer-link">Contact Us</Link></li>
              </ul>
            </div>

            {/* PRODUCT CATEGORIES */}
            <div className="col-lg-3 col-md-6">
              <h6 className="footer-title fw-bold text-white mb-3">Product Categories</h6>
              <ul className="footer-links">
                {categories.map((cat, i) => (
                  <li key={i}>
                    <Link href={makeLink(cat.path)} className="footer-link d-flex align-items-center gap-1">
                      <i className="bi bi-chevron-right small text-success"></i>
                      <span>{cat.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CONTACT NUMBERS & ADDRESS */}
            <div className="col-lg-4 col-md-6">
              <h6 className="footer-title fw-bold text-white mb-3">Contact Us</h6>

              {/* 3 PHONE NUMBERS */}
              <div className="mb-3">
                <div className="small text-light fw-bold mb-1">
                  <i className="bi bi-telephone-fill text-success me-2"></i>
                  Phone & Helpline Numbers:
                </div>
                <div className="ms-4 d-flex flex-column gap-1">
                  {phoneNumbers.map((p, idx) => (
                    <div key={idx} className="small">
                      <a href={`tel:+91${p.number}`} className="footer-link fw-semibold">
                        +91 {p.number}
                      </a>
                      <span className="text-white-50 ms-2" style={{ fontSize: "11px" }}>({p.label})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* LOCATION */}
              <p className="small mb-2 text-white-50">
                <i className="bi bi-geo-alt-fill text-success me-2"> </i>
                {validCity
                  ? stateName
                    ? `${city}, ${stateName}, India`
                    : `${city}, India`
                  : "Amrapali Circle, Vaishali Nagar, Jaipur, Rajasthan - 302021"}
              </p>

              {/* EMAIL */}
              <p className="small mb-3 text-white-50">
                <i className="bi bi-envelope-fill text-success me-2"> </i>
                info@globalbiomedicals.in
              </p>

              {/* GOOGLE MAP EMBED */}
              <iframe
                src={`https://maps.google.com/maps?q=${!validCity
                  ? "Amrapali Circle, Vaishali Nagar, Jaipur, India, 302021"
                  : stateName
                    ? `${city}, ${stateName}, India`
                    : `${city}, India`
                  }&output=embed`}
                width="100%"
                height="130"
                loading="lazy"
                style={{
                  border: 0,
                  borderRadius: "8px",
                }}
              ></iframe>
            </div>

          </div>

          {/* BOTTOM COPYRIGHT */}
          <div className="footer-bottom mt-4 pt-3 text-center border-top border-secondary border-opacity-25">
            <p className="mb-0 small text-white-50">
              © {new Date().getFullYear()} <strong className="text-white">Global Biomedical LLP</strong> | All Rights Reserved.
            </p>
          </div>
        </div>

        <style jsx>{`
          .footer {
            background-color: #0f172a !important;
          }

          .footer-title {
            font-size: 16px;
            letter-spacing: 0.5px;
          }

          .footer-links {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .footer-links li {
            margin-bottom: 8px;
          }

          .footer-social-btn {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            transition: all 0.3s ease;
            text-decoration: none !important;
          }

          .footer-social-btn:hover {
            transform: translateY(-3px);
            color: white;
          }

          .footer-social-btn.whatsapp:hover { background: #25d366; }
          .footer-social-btn.facebook:hover { background: #1877f2; }
          .footer-social-btn.instagram:hover { background: #e4405f; }
          .footer-social-btn.linkedin:hover { background: #0a66c2; }
          .footer-social-btn.youtube:hover { background: #ff0000; }

          .footer :global(.footer-link) {
            color: rgba(255, 255, 255, 0.75) !important;
            text-decoration: none !important;
            font-size: 14px;
            transition: all 0.2s ease;
          }

          .footer :global(.footer-link:hover) {
            color: #10b981 !important;
            transform: translateX(3px);
          }
        `}</style>
      </footer>
    </>
  );
}
