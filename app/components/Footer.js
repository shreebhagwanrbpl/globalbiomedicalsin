"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
export default function Footer() {

 
  const [contactInfo, setContactInfo] = useState([]);
const [stateName, setStateName] = useState("");
const [validCity, setValidCity] = useState(false);
   const pathname = usePathname();
  const pathParts = pathname
    .split("/")
    .filter(Boolean);
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
  pathParts[0] &&
  !reservedRoutes.includes(pathParts[0])
    ? pathParts[0]
    : null;

  // format city
  const formatCity = (name = "") =>
    name
      .split("-")
      .map(
        (w) =>
          w.charAt(0).toUpperCase() +
          w.slice(1)
      )
      .join(" ");

  const citySlug =
    firstPart &&
    !reservedRoutes.includes(firstPart)
      ? firstPart
      : "jaipur";

const city = formatCity(citySlug);

  // dynamic links
  const makeLink = (path = "") => {

    if (!path) {
      return `/${citySlug}`;
    }

    return `/${citySlug}${path}`;
  };


  const getValue = (key) => {

  return (
    contactInfo.find((x) => {

      const label =
        x.label?.toLowerCase();

      return (
        label?.includes(key) ||
        (key === "address" &&
          label?.includes("location"))
      );

    })?.value || "-"
  );

};


useEffect(() => {

  const fetchContact = async () => {

    try {

      const res = await fetch("/contact.json");

      const data = await res.json();

      setContactInfo(data || []);

    } catch (err) {
      console.log(err);
    }

  };

  fetchContact();

}, []);
useEffect(() => {

  const loadDistrict = async () => {

    if (!district) {
      setValidCity(false);
      return;
    }

    try {

      const snap = await getDoc(
        doc(
          db,
          "websites",
          "globalbiomedicalorg",
          "districts",
          citySlug
        )
      );

      if (snap.exists()) {

        setValidCity(true);

        setStateName(
          snap.data()?.state || ""
        );

      } else {

        setValidCity(false);
        setStateName("");

      }

    } catch (err) {

      console.log(err);

      setValidCity(false);

    }

  };

  loadDistrict();

}, [citySlug, district]);
  return (
    <footer className="footer">

      <div className="container-fluid px-5 py-5">

        <div className="row gy-4">

          {/* COMPANY INFO */}
          <div className="col-lg-4">

            <h4 className="fw-bold text-white">
              Global Bio Medicals
            </h4>

            <p className="small">
              Trusted partner for diagnostic instruments,
              reagents, and medical consumables across India.
            </p>

          </div>

          {/* QUICK LINKS */}
          <div className="col-lg-2">

            <h6 className="footer-title">
              Quick Links
            </h6>

            <ul className="footer-links">

<li>
  <Link
    href={makeLink("")}
    className="footer-link"
  >
    Home
  </Link>
</li>

<li>
  <Link
    href={makeLink("/items")}
    className="footer-link"
  >
    Products
  </Link>
</li>

<li>
  <Link
    href={makeLink("/services")}
    className="footer-link"
  >
    Services
  </Link>
</li>

<li>
  <Link
    href={makeLink("/about")}
    className="footer-link"
  >
    About
  </Link>
</li>

<li>
  <Link
    href={makeLink("/contact")}
    className="footer-link"
  >
    Contact
  </Link>
</li>

            </ul>

          </div>

          {/* SERVICES */}
          <div className="col-lg-3">

            <h6 className="footer-title">
              Our Services
            </h6>

            <ul className="footer-links">

              <li>Diagnostic Equipment</li>

              <li>Medical Consumables</li>

              <li>Lab Solutions</li>

              <li>Support & Maintenance</li>

            </ul>

          </div>

          {/* CONTACT */}
          <div className="col-lg-3">

            <h6 className="footer-title">
              Contact
            </h6>

         <p className="small mb-2">
            <i className="bi bi-geo-alt"></i>
            
        {validCity
  ? stateName
    ? `${city}, ${stateName}, India`
    : `${city}, India`
  : "Amrapali , Vaishali Nagar , Jaipur, India, 302021"}
          </p>

          {/* MAP */}
          <iframe
            src={`https://maps.google.com/maps?q=${
       !validCity
  ? "Amrapali , Vaishali Nagar , Jaipur, India, 302021"
  : stateName
    ? `${city}, ${stateName}, India`
    : `${city}, India`
            }&output=embed`}
            width="100%"
            height="180"
            loading="lazy"
            style={{
              border: 0,
              borderRadius: "10px",
              marginTop: "10px"
            }}
          ></iframe>

            <p className="small mb-1">
              <i className="bi bi-envelope"></i>
              info@rajbiosis.com
            </p>

            <p className="small">
              <i className="bi bi-telephone"></i>
              +91 XXXXX XXXXX
            </p>

          </div>

        </div>

        {/* BOTTOM */}
        <div className="footer-bottom mt-4 pt-3 text-center">

          <p className="mb-0 small">
            © {new Date().getFullYear()}
            {" "}
            Global Bio Medicals |
            All Rights Reserved
          </p>

        </div>

      </div>

      <style jsx>{`
.footer {
  background: #111;
  color: #fff;
}

.footer-title {
  font-weight: 600;
  margin-bottom: 12px;
  position: relative;
  color: #fff;
}

.footer-title::after {
  content: "";
  width: 40px;
  height: 2px;
  background: #198754;
  display: block;
  margin-top: 6px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  color: #fff !important;
  text-decoration: none !important;
  font-size: 15px;
  font-weight: 500;
  transition: 0.3s ease;
  display: inline-block;
}

.footer-links a:hover {
  color: #198754 !important;
}



.footer-bottom {
  border-top: 1px solid #333;
}

.footer p,
.footer small,
.footer li {
  color: #fff;
}

.footer i {
  color: #198754;
}

      `}</style>

    </footer>
  );
}

