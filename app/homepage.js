"use client";

import Hero from "./components/Hero";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { fetchFullCatalog, fetchServicesData } from "@/lib/data-fetcher";
import Link from "next/link";

export default function Home({ city }) {
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const currentCity = city || "";

  const formatCity = (name = "") =>
    name
      .split("-")
      .map(
        (w) =>
          w.charAt(0).toUpperCase() + w.slice(1)
      )
      .join(" ");

  const citySlug = currentCity;
  const cityName = formatCity(currentCity);

  const categoryCards = [
    {
      title: "ICU & OT Equipment",
      description: "Patient Monitors, Ventilators, OT Lights, Defibrillators & Anesthesia Workstations",
      icon: "bi-heart-pulse-fill",
      color: "#0284c7",
      link: "/products?category=ICU%20%26%20Operation%20Theatre%20Equipment"
    },
    {
      title: "Diagnostic & Lab Analyzers",
      description: "Biochemistry, Hematology Cell Counters, Electrolyte & Urine Analyzers",
      icon: "bi-flask-fill",
      color: "#16a34a",
      link: "/products?category=Diagnostic%20%26%20Laboratory%20Analyzers"
    },
    {
      title: "Biomedical Instruments",
      description: "ECG Machines, Microscopes, Autoclaves, Centrifuges & Sterilizers",
      icon: "bi-shield-check",
      color: "#9333ea",
      link: "/products?category=Biomedical%20%26%20Clinical%20Instruments"
    },
    {
      title: "Hospital Furniture",
      description: "ICU Beds, Examination Tables, Stretcher Beds & Crash Carts",
      icon: "bi-hospital-fill",
      color: "#ea580c",
      link: "/products?category=Hospital%20Furniture%20%26%20Patient%20Care"
    },
    {
      title: "Reagents & Disposables",
      description: "Diagnostic Reagents, Rapid Test Kits, Surgical Consumables & Lab Disposables",
      icon: "bi-box-seam-fill",
      color: "#059669",
      link: "/products?category=Medical%20Consumables%20%26%20Reagents"
    }
  ];

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const allProducts = await fetchFullCatalog();
        if (isMounted) {
          setProducts(allProducts || []);
          setLoadingProducts(false);
        }
      } catch (err) {
        console.error("[homepage] fetchProducts error:", err);
        if (isMounted) setLoadingProducts(false);
      }
    };

    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const data = await fetchServicesData();
        if (isMounted && data && Array.isArray(data.services)) {
          setServices(data.services.slice(0, 3));
        }
      } catch (e) {
        // ignore
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const icons = [
    "bi-heart-pulse",
    "bi-capsule",
    "bi-tools",
  ];

  return (
    <>
      <Hero city={city} />

      {/* CATEGORIES SECTION (4-5 CATEGORIES WITH DIRECT CLICK NAVIGATION) */}
      <section className="py-5 bg-white border-bottom">
        <div className="container text-center">
          <span className="badge bg-success-subtle text-success border border-success mb-2 px-3 py-1 rounded-pill fw-semibold">
            Product Categories
          </span>
          <h2 className="fw-bold mb-3 text-dark">
            Explore Medical & Laboratory Solutions
          </h2>
          <p className="text-secondary mb-5 mx-auto" style={{ maxWidth: "680px" }}>
            Click on any category to view specialized equipment, technical specifications, and place inquiries directly with <strong>Global Biomedical LLP</strong>.
          </p>

          <div className="row g-4 justify-content-center">
            {categoryCards.map((cat, idx) => (
              <div key={idx} className="col-12 col-sm-6 col-lg-4">
                <Link href={citySlug ? `/${citySlug}${cat.link}` : cat.link} className="text-decoration-none">
                  <div className="category-card p-4 rounded-4 h-100 border text-start transition-all shadow-sm">
                    <div
                      className="category-icon-box rounded-3 d-flex align-items-center justify-content-center mb-3"
                      style={{ width: "54px", height: "54px", background: `${cat.color}15`, color: cat.color }}
                    >
                      <i className={`bi ${cat.icon} fs-3`}></i>
                    </div>

                    <h5 className="fw-bold text-dark mb-2 d-flex justify-content-between align-items-center">
                      <span>{cat.title}</span>
                      <i className="bi bi-arrow-right-short text-success fs-4"></i>
                    </h5>
                    <p className="text-muted small mb-0">{cat.description}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="fw-bold mb-5">
            Laboratory Equipment & Diagnostic Services
          </h2>

          <div className="row g-4">
            {services.length === 0 ? (
              <p>No Services Found</p>
            ) : (
              services.map((item, i) => (
                <div className="col-12 col-sm-6 col-md-4" key={i}>
                  <div className="p-4 rounded-4 service-card h-100">
                    <i className={`bi ${icons[i] || "bi-heart-pulse"} fs-1 text-success`}></i>
                    <h5 className="mt-3">{item.title}</h5>
                    <p className="text-muted">{item.desc}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-5 bg-white">
        <div className="container text-center">
          <h2 className="section-title fw-bold mb-4">
            Featured Biomedical Products
          </h2>

          <div className="row g-4">
            {loadingProducts ? (
              [...Array(4)].map((_, i) => (
                <div className="col-12 col-sm-6 col-md-3" key={i}>
                  <div className="product-card-pro">
                    <div style={{ height: 260, background: "#f1f1f1", borderRadius: 12 }} />
                    <div className="p-3">
                      <div style={{ height: 20, background: "#f1f1f1", borderRadius: 5, marginBottom: 10 }} />
                      <div style={{ height: 15, background: "#f1f1f1", borderRadius: 5, width: "70%" }} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              products.slice(0, 4).map((item, i) => (
                <div className="col-12 col-sm-6 col-md-3" key={item.id || i}>
                  <div className="product-card-pro h-100 d-flex flex-column justify-content-between">
                    <div className="product-img-pro">
                      <img
                        src={item.images?.[0] || item.image || "/no-image.png"}
                        loading="lazy"
                        alt={item.title}
                        onError={(e) => {
                          e.currentTarget.src = "/no-image.png";
                        }}
                      />
                    </div>

                    <div className="product-body text-start">
                      <h6>{item.title}</h6>
                      <div className="meta mb-2">
                        <span>{item.brand || "-"}</span>
                        <span>{item.size || "-"}</span>
                        <span>{item.usage || "-"}</span>
                      </div>

                      <Link href={citySlug ? `/${citySlug}/products` : "/products"}>
                        <button className="btn btn-success w-100 mt-2">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-5 why-section bg-white">
        <div className="container px-md-5 px-3">
          <div className="row align-items-center gy-5">
            <div className="col-lg-6">

              <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-success-subtle text-success fw-bold small mb-3">
                <i className="bi bi-shield-check-fill"></i>
                <span>Why Global Biomedical LLP</span>
              </div>

              <h2 className="fw-bold mb-3 display-6 text-dark">
                Trusted Medical Equipment & Diagnostic Partner
              </h2>

              <p className="text-secondary mb-4 fs-6">
                We supply high-precision analyzers, ICU equipment, and clinical laboratory consumables to hospitals, pathology labs, and medical institutions across India with guaranteed technical service.
              </p>

              <div className="row g-3 mb-4">
                <div className="col-sm-6">
                  <div className="p-3 rounded-4 bg-light border h-100">
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <div className="badge bg-success-subtle text-success fs-5 p-2 rounded-3">
                        <i className="bi bi-award-fill"></i>
                      </div>
                      <h6 className="fw-bold m-0 text-dark">100% Genuine Brands</h6>
                    </div>
                    <p className="small text-muted mb-0">Authorized equipment from Abbott, Sysmex, Erba & Mindray.</p>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="p-3 rounded-4 bg-light border h-100">
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <div className="badge bg-success-subtle text-success fs-5 p-2 rounded-3">
                        <i className="bi bi-truck"></i>
                      </div>
                      <h6 className="fw-bold m-0 text-dark">Express Shipping</h6>
                    </div>
                    <p className="small text-muted mb-0">Safe, secure express delivery to 400+ cities across India.</p>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="p-3 rounded-4 bg-light border h-100">
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <div className="badge bg-success-subtle text-success fs-5 p-2 rounded-3">
                        <i className="bi bi-headset"></i>
                      </div>
                      <h6 className="fw-bold m-0 text-dark">24/7 Engineer Support</h6>
                    </div>
                    <p className="small text-muted mb-0">Dedicated helpline & on-site AMC calibration service.</p>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="p-3 rounded-4 bg-light border h-100">
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <div className="badge bg-success-subtle text-success fs-5 p-2 rounded-3">
                        <i className="bi bi-tag-fill"></i>
                      </div>
                      <h6 className="fw-bold m-0 text-dark">Best Market Rates</h6>
                    </div>
                    <p className="small text-muted mb-0">Transparent pricing for equipment, reagents & consumables.</p>
                  </div>
                </div>
              </div>

              {/* STATS */}
              <div className="row g-3 text-center border-top pt-3">
                <div className="col-4">
                  <h4 className="fw-extrabold text-success mb-0">1000+</h4>
                  <small className="text-muted fw-medium">Happy Labs</small>
                </div>
                <div className="col-4 border-start border-end">
                  <h4 className="fw-extrabold text-success mb-0">15+</h4>
                  <small className="text-muted fw-medium">Years Excellence</small>
                </div>
                <div className="col-4">
                  <h4 className="fw-extrabold text-success mb-0">500+</h4>
                  <small className="text-muted fw-medium">Products Sold</small>
                </div>
              </div>

            </div>

            {/* RIGHT IMAGE */}
            <div className="col-lg-6">
              <div className="position-relative p-2 rounded-4 bg-light border shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1581594693702-fbdc51b2763b"
                  className="img-fluid rounded-4 w-100"
                  alt="Global Biomedical LLP Laboratory Equipment"
                  style={{ maxHeight: "460px", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER MATCHING MEDICAL GREEN THEME */}
      <section
        className="py-5 text-center text-white no-print"
        style={{
          background: "linear-gradient(135deg, #052e16 0%, #064e3b 50%, #0f5132 100%)",
        }}
      >
        <div className="container py-3">
          <div className="badge bg-warning text-dark px-3 py-1.5 rounded-pill fw-bold mb-3">
            <i className="bi bi-telephone-fill me-1"></i> Direct Helpline Support
          </div>

          <h2 className="fw-bold display-6 mb-3 text-white">
            Need Expert Biomedical Equipment Guidance?
          </h2>

          <p className="mb-4 text-white-50 fs-5 mx-auto" style={{ maxWidth: "650px" }}>
            Speak directly with our technical specialists for instant quotes, product specs, or machine service support across India.
          </p>

          {/* HELPLINE NUMBERS BADGES */}
          <div className="d-flex justify-content-center align-items-center gap-3 flex-wrap mb-4">
            <a href="tel:+919257984336" className="btn btn-outline-light rounded-pill px-3 py-2 text-decoration-none fw-bold">
              <i className="bi bi-telephone-outbound me-2 text-warning"></i>9257984336
            </a>
            <a href="tel:+918529833535" className="btn btn-outline-light rounded-pill px-3 py-2 text-decoration-none fw-bold">
              <i className="bi bi-telephone-outbound me-2 text-warning"></i>8529833535
            </a>
            <a href="tel:+919983301657" className="btn btn-outline-light rounded-pill px-3 py-2 text-decoration-none fw-bold">
              <i className="bi bi-telephone-outbound me-2 text-warning"></i>9983301657
            </a>
          </div>

          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <a
              href="https://wa.me/919257984336?text=Hello%20Global%20Biomedical%20LLP,%20I%20need%20equipment%20details"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-success btn-lg px-4 py-2.5 fw-bold shadow rounded-pill text-decoration-none d-inline-flex align-items-center gap-2"
            >
              <i className="bi bi-whatsapp"></i>
              <span>Chat on WhatsApp</span>
            </a>

            <Link href={citySlug ? `/${citySlug}/contact` : "/contact"} className="text-decoration-none">
              <button className="btn btn-light btn-lg px-4 py-2.5 text-success fw-bold rounded-pill shadow-sm">
                Get In Touch
              </button>
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .category-card {
          background: #ffffff;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .category-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08) !important;
          border-color: #198754 !important;
        }
      `}</style>
    </>
  );
}