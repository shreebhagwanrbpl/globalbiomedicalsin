"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

export default function Hero({city}) {
   const [data, setData] = useState({
  // title: "Advanced Diagnostic Solutions",
  // description: "Delivering high-quality medical equipment & consumables for hospitals, labs & healthcare professionals.",
  // button1Text: "Explore Services",
  // button2Text: "Contact Us",
});
const currentCity = city || "";

// format city
const formatCity = (name = "") =>
  name
    .split("-")
    .map(
      (w) =>
        w.charAt(0).toUpperCase() + w.slice(1)
    )
    .join(" ");

const citySlug = currentCity;

const cityName =
  typeof window === "undefined"
    ? formatCity(city)
    : formatCity(currentCity);
  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDoc(
        doc(db, "websites", "globalbiomedicalsin", "pages", "home")
      );

      if (snap.exists()) {
        setData(snap.data());
      }
    };

    fetchData();
  }, []);

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
  {data?.title}
  {city ? ` in ${formatCity(city)}` : ""}
</h1>

     <p className="mt-3 text-light">
  {data?.description}
  {city ? ` available in ${formatCity(city)}` : ""}
</p>

            <div className="mt-4 d-flex gap-3">
              <Link
                href={data?.button1Link || `/${citySlug}/services`}
                className="btn btn-success px-4 py-2"
              >
                {data?.button1Text }
              </Link>

              <Link href={data?.button2Link || `/${citySlug}/contact`}>
                <button className="btn btn-outline-light px-4 py-2">
                  {data?.button2Text}
                </button>
              </Link>
            </div>
          </div>

          {/* RIGHT (STATIC) */}
          <div className="col-lg-6 text-center position-relative">
            <div className="hero-glow"></div>
            <img
              src="https://images.unsplash.com/photo-1579154204601-01588f351e67"
              className="img-fluid rounded-4 shadow-lg"
              alt="medical lab"
            />
          </div>

        </div>
      </div>
    </section>
  );
}