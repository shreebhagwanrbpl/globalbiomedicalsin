"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
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

  const citySlug = currentCity;

  useEffect(() => {
    const fetchData = async () => {
      const startTime = Date.now();

      try {
        const snap = await getDoc(
          doc(db, "websites", "globalbiomedicalsin", "pages", "home")
        );

        if (snap.exists()) {
          setData(snap.data());
        }
      } catch (error) {
        console.error(error);
      } finally {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(3000 - elapsed, 0);

        setTimeout(() => {
          setLoading(false);
        }, remaining);
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
            src="/globallogo.png" // apna logo path yaha rakho
            alt="Global Biomedical"
            className="loader-logo"
          />

          <div className="loader-spinner"></div>

          <p className="loader-text">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="hero-section text-white">
      <div className="container">
        <div className="row align-items-center">
          {/* LEFT */}
          <div className="col-lg-6">
            <span className="badge bg-success mb-3 px-3 py-2">
              Trusted Since 2009
            </span>

           <h1 className="fw-bold display-4">
            {data?.title ||
              "Laboratory Equipment Supplier"}

            {city
              ? ` in ${formatCity(city)}`
              : " in India"}
          </h1>

            <p className="mt-3 text-light">
              {data?.description}
              {city ? ` available in ${formatCity(city)}` : ""}
            </p>

            <div className="mt-4 d-flex gap-3">
              <Link
                href={city ? `/${city}/products` : "/products"}
              >
                <button className="btn btn-outline-light px-4 py-2">
                  {data?.button1Text || "Explore Services"}
                </button>
              </Link>

              <Link
                href={city ? `/${city}/contact` : "/contact"}
              >
                <button className="btn btn-outline-light px-4 py-2">
                  {data?.button2Text || "Contact Us"}
                </button>
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-lg-6 text-center position-relative">
            <div className="hero-glow"></div>

            <img
              src="https://images.unsplash.com/photo-1579154204601-01588f351e67"
              className="img-fluid rounded-4 shadow-lg"
              alt="Laboratory Equipment Supplier India"
            />
          </div>
        </div>
      </div>
    </section>
  );
}