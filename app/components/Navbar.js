"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);

  // current path
  const pathParts = pathname.split("/").filter(Boolean);

  // reserved routes
  const reservedRoutes = [
    "about",
    "contact",
    "item",
    "items",
    "products",
    "services",
  ];

  // district slug
  const district =
    pathParts[0] && !reservedRoutes.includes(pathParts[0])
      ? pathParts[0]
      : null;

  const makeLink = (path = "") => {
    if (!district) {
      return path || "/";
    }
    return `/${district}${path}`;
  };

  const categories = [
    { name: "ICU & Operation Theatre Equipment", slug: "icu-ot-equipment", icon: "bi-heart-pulse" },
    { name: "Diagnostic & Laboratory Analyzers", slug: "diagnostic-analyzers", icon: "bi-flask" },
    { name: "Biomedical & Clinical Instruments", slug: "biomedical-instruments", icon: "bi-shield-check" },
    { name: "Hospital Furniture & Patient Care", slug: "hospital-furniture", icon: "bi-hospital" },
    { name: "Medical Consumables & Reagents", slug: "medical-consumables", icon: "bi-box-seam" },
  ];

  return (
    <>
      {/* TOP HEADER BAR WITH CONTACT NUMBERS & SOCIAL ICONS */}
      <div className="top-header-bar py-2 px-3 no-print">
        <div className="container-fluid px-md-5 d-flex justify-content-between align-items-center flex-wrap gap-2">
          
          {/* 3 CONTACT NUMBERS */}
          <div className="d-flex align-items-center gap-3 flex-wrap small">
            <span className="helpline-badge">
              <i className="bi bi-telephone-fill me-1"></i> Helpline:
            </span>
            <a href="tel:+919257984336" className="top-phone-link">
              <i className="bi bi-telephone me-1 text-success"></i>9257984336
            </a>
            <span className="divider-dot">•</span>
            <a href="tel:+918529833535" className="top-phone-link">
              <i className="bi bi-telephone me-1 text-success"></i>8529833535
            </a>
            <span className="divider-dot">•</span>
            <a href="tel:+919983301657" className="top-phone-link">
              <i className="bi bi-telephone me-1 text-success"></i>9983301657
            </a>
          </div>

          {/* SOCIAL MEDIA ICONS */}
          <div className="d-flex align-items-center gap-2">
            <a href="https://wa.me/919257984336?text=Hello%20Global%20Biomedical%20LLP" target="_blank" rel="noopener noreferrer" className="top-social-icon whatsapp" title="WhatsApp">
              <i className="bi bi-whatsapp"></i>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="top-social-icon facebook" title="Facebook">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="top-social-icon instagram" title="Instagram">
              <i className="bi bi-instagram"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="top-social-icon linkedin" title="LinkedIn">
              <i className="bi bi-linkedin"></i>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="top-social-icon youtube" title="YouTube">
              <i className="bi bi-youtube"></i>
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="top-social-icon twitter" title="Twitter / X">
              <i className="bi bi-twitter-x"></i>
            </a>
          </div>

        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav className="navbar navbar-expand-lg custom-navbar">
        <div className="container-fluid px-md-5">

          {/* LOGO & BRAND */}
          <Link href={makeLink("")} className="navbar-brand d-flex align-items-center gap-2">
            <Image
              src="/globallogo.png"
              alt="Global Biomedical LLP"
              width={140}
              height={50}
              style={{ objectFit: "contain" }}
              priority
            />
            <div className="brand-text-container d-none d-sm-block">
              <div className="fw-bold text-dark lh-1" style={{ fontSize: "16px" }}>GLOBAL BIOMEDICAL LLP</div>
              <small className="text-success fw-semibold" style={{ fontSize: "10px", letterSpacing: "0.5px" }}>
                MEDICAL & DIAGNOSTIC SOLUTIONS
              </small>
            </div>
          </Link>

          {/* TOGGLE BUTTON */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#nav"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* MENU ITEMS */}
          <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`} id="nav">
            <ul className="navbar-nav ms-auto align-items-center gap-lg-4 gap-2 mt-3 mt-lg-0">
              
              <li>
                <Link href={makeLink("")} className="nav-link">
                  Home
                </Link>
              </li>

              {/* CATEGORIES DROPDOWN */}
              <li
                className="nav-item dropdown position-relative"
                onMouseEnter={() => setCategoryDropdown(true)}
                onMouseLeave={() => setCategoryDropdown(false)}
              >
                <Link
                  href={makeLink("/products")}
                  className="nav-link dropdown-toggle d-flex align-items-center gap-1"
                  onClick={() => setCategoryDropdown(!categoryDropdown)}
                >
                  Categories
                </Link>

                <div className={`dropdown-menu shadow-lg border-0 rounded-3 p-2 ${categoryDropdown ? "show" : ""}`} style={{ minWidth: "280px" }}>
                  <div className="px-3 py-1 fw-bold text-uppercase text-muted" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                    Select Category
                  </div>
                  <div className="dropdown-divider my-1"></div>
                  {categories.map((cat, i) => (
                    <Link
                      key={i}
                      href={makeLink(`/products?category=${encodeURIComponent(cat.name)}`)}
                      className="dropdown-item py-2 px-3 rounded d-flex align-items-center gap-2"
                      onClick={() => {
                        setCategoryDropdown(false);
                        setMenuOpen(false);
                      }}
                    >
                      <i className={`bi ${cat.icon} text-success`}></i>
                      <span style={{ fontSize: "13.5px" }}>{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </li>

              <li>
                <Link href={makeLink("/products")} className="nav-link">
                  Products
                </Link>
              </li>

              <li>
                <Link href={makeLink("/services")} className="nav-link">
                  Services
                </Link>
              </li>

              <li>
                <Link href={makeLink("/about")} className="nav-link">
                  About
                </Link>
              </li>

              <li>
                <Link href={makeLink("/contact")} className="nav-link">
                  Contact
                </Link>
              </li>

            </ul>
          </div>

        </div>

        {/* STYLES */}
        <style jsx global>{`
          .top-header-bar {
            background: #f8fafc !important;
            border-bottom: 1px solid #e2e8f0 !important;
            font-size: 13px !important;
          }

          .helpline-badge {
            background: #e6f4ea !important;
            color: #0f5132 !important;
            font-weight: 700 !important;
            padding: 3px 10px !important;
            border-radius: 20px !important;
            font-size: 12px !important;
            display: inline-flex !important;
            align-items: center !important;
          }

          .divider-dot {
            color: #cbd5e1 !important;
            font-size: 14px !important;
          }

          .top-header-bar a.top-phone-link,
          .top-header-bar a.top-phone-link:link,
          .top-header-bar a.top-phone-link:visited {
            color: #334155 !important;
            font-weight: 600 !important;
            text-decoration: none !important;
            transition: color 0.2s ease !important;
            font-size: 13px !important;
          }

          .top-header-bar a.top-phone-link:hover,
          .top-header-bar a.top-phone-link:focus {
            color: #198754 !important;
            text-decoration: none !important;
          }

          .top-header-bar a.top-social-icon,
          .top-header-bar a.top-social-icon:link,
          .top-header-bar a.top-social-icon:visited {
            color: #475569 !important;
            background: #ffffff !important;
            border: 1px solid #e2e8f0 !important;
            width: 28px !important;
            height: 28px !important;
            border-radius: 50% !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 13px !important;
            text-decoration: none !important;
            transition: all 0.2s ease !important;
          }

          .top-header-bar a.top-social-icon:hover {
            color: #ffffff !important;
            border-color: transparent !important;
            transform: translateY(-2px) !important;
          }

          .top-header-bar a.top-social-icon.whatsapp:hover { background: #25d366 !important; }
          .top-header-bar a.top-social-icon.facebook:hover { background: #1877f2 !important; }
          .top-header-bar a.top-social-icon.instagram:hover { background: #e4405f !important; }
          .top-header-bar a.top-social-icon.linkedin:hover { background: #0a66c2 !important; }
          .top-header-bar a.top-social-icon.youtube:hover { background: #ff0000 !important; }
          .top-header-bar a.top-social-icon.twitter:hover { background: #0f172a !important; }

          .custom-navbar {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 10px 0;
            position: sticky;
            top: 0;
            z-index: 1000;
            border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          }

          .nav-link {
            font-weight: 500;
            color: #333;
            transition: 0.3s;
          }

          .nav-link:hover {
            color: #198754;
          }

          .dropdown-item {
            color: #374151;
            transition: all 0.2s ease;
          }

          .dropdown-item:hover {
            background: #f0fdf4;
            color: #15803d;
          }

          .btn {
            border-radius: 8px;
            font-weight: 500;
          }
        `}</style>
      </nav>
    </>
  );
}