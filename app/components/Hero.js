"use client";

import { useEffect, useState } from "react";
import { fetchHomeData } from "@/lib/data-fetcher";
import Link from "next/link";

export default function Hero({ city }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const currentCity = city || "";

  // Format city name
  const formatCity = (name = "") =>
    name
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const homeData = await fetchHomeData();
        if (homeData) {
          setData(homeData);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Loader
  if (loading) {
    return (
      <div className="hero-loader">
        <div className="loader-content">
          <img
            src="/globallogo.png"
            alt="Global Biomedical"
            className="loader-logo"
          />
          <div className="loader-spinner"></div>
          <p className="loader-text">Loading Global Biomedical...</p>
        </div>
      </div>
    );
  }

  const headlineText = data?.title || data?.heading || "";
  const descText = data?.description || data?.desc || "";
  const btn1Text = data?.button1Text || data?.btn1Text || data?.button1 || data?.btn1 || data?.buttonText || data?.btnText || data?.exploreBtnText || "";
  const btn2Text = data?.button2Text || data?.btn2Text || data?.button2 || data?.btn2 || data?.contactBtnText || data?.btnText2 || data?.buttonText2 || "";

  return (
    <section className="hero-section position-relative text-white no-print">
      {/* BACKGROUND AMBIENT GLOWS */}
      <div className="hero-bg-glow glow-1" aria-hidden="true"></div>
      <div className="hero-bg-glow glow-2" aria-hidden="true"></div>

      <div className="container position-relative" style={{ zIndex: 2 }}>
        <div className="row align-items-center gy-5 py-4">
          
          {/* LEFT CONTENT */}
          <div className="col-lg-6">
            
            {/* TRUST BADGE */}
            <div className="d-inline-flex align-items-center gap-2 hero-trust-badge mb-4">
              <i className="bi bi-patch-check-fill text-warning fs-6"></i>
              <span>ISO Certified Biomedical Equipment Supplier</span>
            </div>

            {/* MAIN HEADLINE */}
            {headlineText ? (
              <h1 className="fw-bold hero-main-title mb-3">
                {headlineText}{" "}
                <span className="hero-city-accent">
                  {city ? `in ${formatCity(city)}` : "Across India"}
                </span>
              </h1>
            ) : null}

            {/* DESCRIPTION */}
            {descText ? (
              <p className="hero-desc-text mb-4">
                {descText}
                {city ? ` available for instant installation in ${formatCity(city)}.` : ""}
              </p>
            ) : null}

            {/* ACTION BUTTONS */}
            {(btn1Text || btn2Text) ? (
              <div className="d-flex flex-wrap gap-3 mb-5">
                {btn1Text ? (
                  <Link href={city ? `/${city}/products` : "/products"} className="text-decoration-none">
                    <button className="btn btn-hero-primary d-flex align-items-center gap-2 shadow-lg">
                      <i className="bi bi-grid-3x3-gap-fill"></i>
                      <span>{btn1Text}</span>
                    </button>
                  </Link>
                ) : null}

                {btn2Text ? (
                  <Link href={city ? `/${city}/contact` : "/contact"} className="text-decoration-none">
                    <button className="btn btn-hero-secondary d-flex align-items-center gap-2">
                      <i className="bi bi-telephone-fill"></i>
                      <span>{btn2Text}</span>
                    </button>
                  </Link>
                ) : null}
              </div>
            ) : null}

            {/* STATS / TRUST METRICS */}
            <div className="hero-stats-grid pt-3 border-top border-white-10">
              <div className="stat-item">
                <div className="stat-num">15+</div>
                <div className="stat-label">Years Experience</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-num">1000+</div>
                <div className="stat-label">Lab Clients</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-num">24/7</div>
                <div className="stat-label">Engineer Support</div>
              </div>
            </div>

          </div>

          {/* RIGHT IMAGE WITH GLASSMORPHISM FRAME */}
          <div className="col-lg-6 text-center">
            <div className="hero-image-wrapper">
              
              {/* MAIN HERO IMAGE */}
              <img
                src={data?.image || data?.imageUrl || (Array.isArray(data?.images) && data.images.length > 0 ? data.images[0] : "") || data?.heroImage || "https://images.unsplash.com/photo-1579154204601-01588f351e67"}
                className="img-fluid hero-main-img"
                alt="Global Biomedical Laboratory Equipment Supplier"
              />

              {/* OVERLAY BADGE 1: FAST DISPATCH */}
              <div className="hero-floating-badge badge-top-left">
                <div className="badge-icon-box bg-success text-white">
                  <i className="bi bi-truck"></i>
                </div>
                <div className="badge-text-box">
                  <div className="badge-title">Pan-India Express</div>
                  <div className="badge-sub">Fast Equipment Delivery</div>
                </div>
              </div>

              {/* OVERLAY BADGE 2: WARRANTY */}
              <div className="hero-floating-badge badge-bottom-right">
                <div className="badge-icon-box bg-warning text-dark">
                  <i className="bi bi-shield-lock-fill"></i>
                </div>
                <div className="badge-text-box">
                  <div className="badge-title">100% Genuine</div>
                  <div className="badge-sub">Warranty & AMC Support</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        .hero-section {
          background: linear-gradient(135deg, #052e16 0%, #064e3b 45%, #0f5132 100%);
          padding: 80px 0 90px;
          overflow: hidden;
          color: #ffffff;
        }

        /* GLOW ACCENTS */
        .hero-bg-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
          z-index: 1;
        }

        .glow-1 {
          width: 350px;
          height: 350px;
          background: rgba(16, 185, 129, 0.25);
          top: -50px;
          left: -50px;
        }

        .glow-2 {
          width: 400px;
          height: 400px;
          background: rgba(245, 158, 11, 0.15);
          bottom: -80px;
          right: -50px;
        }

        /* TRUST BADGE */
        .hero-trust-badge {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          padding: 6px 16px;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.3px;
        }

        /* HEADLINE */
        .hero-main-title {
          font-size: 44px;
          line-height: 1.2;
          letter-spacing: -0.5px;
          color: #ffffff;
        }

        .hero-city-accent {
          background: linear-gradient(90deg, #fde047, #f59e0b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
          font-weight: 800;
        }

        /* DESC */
        .hero-desc-text {
          font-size: 17px;
          color: #d1fae5;
          line-height: 1.6;
          max-width: 540px;
        }

        /* BUTTONS */
        .btn-hero-primary {
          background: linear-gradient(135deg, #10b981, #059669);
          color: #ffffff;
          border: none;
          font-weight: 700;
          font-size: 16px;
          padding: 13px 28px;
          border-radius: 30px;
          transition: all 0.3s ease;
        }

        .btn-hero-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4) !important;
          background: linear-gradient(135deg, #34d399, #10b981);
        }

        .btn-hero-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(8px);
          font-weight: 600;
          font-size: 16px;
          padding: 13px 28px;
          border-radius: 30px;
          transition: all 0.3s ease;
        }

        .btn-hero-secondary:hover {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
          border-color: #ffffff;
          transform: translateY(-3px);
        }

        /* STATS GRID */
        .hero-stats-grid {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .border-white-10 {
          border-color: rgba(255, 255, 255, 0.15) !important;
        }

        .stat-item {
          text-align: left;
        }

        .stat-num {
          font-size: 24px;
          font-weight: 800;
          color: #fde047;
          line-height: 1;
          margin-bottom: 3px;
        }

        .stat-label {
          font-size: 12px;
          color: #a7f3d0;
          font-weight: 500;
        }

        .stat-divider {
          width: 1px;
          height: 32px;
          background: rgba(255, 255, 255, 0.2);
        }

        /* IMAGE WRAPPER */
        .hero-image-wrapper {
          position: relative;
          display: inline-block;
          border-radius: 24px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          transition: transform 0.4s ease;
        }

        .hero-image-wrapper:hover {
          transform: translateY(-5px);
        }

        .hero-main-img {
          border-radius: 18px;
          width: 100%;
          max-height: 420px;
          object-fit: cover;
          display: block;
        }

        /* FLOATING OVERLAY BADGES */
        .hero-floating-badge {
          position: absolute;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 10px 16px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          z-index: 5;
        }

        .badge-top-left {
          top: 25px;
          left: -20px;
        }

        .badge-bottom-right {
          bottom: 25px;
          right: -20px;
        }

        .badge-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .badge-title {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          text-align: left;
        }

        .badge-sub {
          font-size: 11px;
          color: #94a3b8;
          text-align: left;
        }

        @media (max-width: 991px) {
          .hero-section {
            padding: 50px 0 60px;
          }
          .hero-main-title {
            font-size: 32px;
          }
          .hero-desc-text {
            font-size: 15px;
          }
          .badge-top-left {
            top: 15px;
            left: 10px;
          }
          .badge-bottom-right {
            bottom: 15px;
            right: 10px;
          }
        }
      `}</style>
    </section>
  );
}