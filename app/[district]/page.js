"use client";

import { use, useEffect, useState } from "react";
import Home from "../homepage";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";



export default function Page({ params }) {
  // ✅ unwrap params Promise
  const resolvedParams = use(params);

  const district =
    resolvedParams?.district || "";

  const [city, setCity] =
    useState("");

  useEffect(() => {

    const checkDistrict = async () => {

      let validDistrict = district;

      try {

        const snap = await getDoc(
          doc(
            db,
            "websites",
            "indiandiagnostic",
            "districts",
            district
          )
        );

        // ❌ invalid district
        if (!snap.exists()) {
          validDistrict = "";
        }

      } catch (err) {

        validDistrict = "";

      }

      const formatted = validDistrict
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) =>
          char.toUpperCase()
        );

      setCity(formatted);

    };

    checkDistrict();

  }, [district]);

  return <Home city={city} />;

}