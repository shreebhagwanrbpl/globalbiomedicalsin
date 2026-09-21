"use client";

import { use, useEffect, useState } from "react";
import Home from "../homepage";
import { fetchDistrictData } from "@/lib/data-fetcher";

export default function Page({ params }) {
  const resolvedParams = use(params);
  const district = resolvedParams?.district || "";
  const [city, setCity] = useState("");

  useEffect(() => {
    const checkDistrict = async () => {
      let validDistrict = district;
      try {
        const snapData = await fetchDistrictData(district);
        if (!snapData && district) {
          // fallback to formatting district name
          validDistrict = district;
        }
      } catch (err) {
        validDistrict = district;
      }

      const formatted = (validDistrict || "")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      setCity(formatted);
    };

    checkDistrict();
  }, [district]);

  return <Home city={city} />;
}