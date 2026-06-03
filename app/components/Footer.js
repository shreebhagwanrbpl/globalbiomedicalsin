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
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "globalbiomedicalsin",
            "pages",
            "contact"
          )
        );

        if (snap.exists()) {
          setContactInfo(
            snap.data().contactInfo || []
          );
        }
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

      {/* <div className="container-fluid px-5 py-5"> */}
      <div className="container py-5">

        {/* <div className="row gy-4"> */}
        <div className="row gy-5 justify-content-between">

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
              <li><Link href={makeLink("")} className="footer-link">Home</Link></li>
              <li><Link href={makeLink("/items")} className="footer-link">Products</Link></li>
              <li><Link href={makeLink("/services")} className="footer-link">Services</Link></li>
              <li><Link href={makeLink("/about")} className="footer-link">About</Link></li>
              <li><Link href={makeLink("/contact")} className="footer-link">Contact</Link></li>
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
              <i className="bi bi-geo-alt"> </i>

              {validCity
                ? stateName
                  ? `${city}, ${stateName}, India`
                  : `${city}, India`
                : getValue("address")}
            </p>

            <p className="small mb-1">
              <i className="bi bi-envelope"> </i>
              {getValue("email")}
            </p>

            <p className="small">
              <i className="bi bi-telephone"> </i>
              {getValue("phone")}
            </p>
            {/* MAP */}
            <iframe
              src={`https://maps.google.com/maps?q=${!validCity
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
.footer :global(.footer-link) {
  color: #fff !important;
  text-decoration: none !important;
  font-size: 15px;
  font-weight: 500;
  display: inline-block;
  transition: all 0.3s ease;
}

.footer :global(.footer-link:hover) {
  color: #198754 !important;
  transform: translateX(4px);
}

.footer :global(a) {
  color: #fff !important;
  text-decoration: none !important;
}

.footer :global(a:hover) {
  color: #198754 !important;
}
  .footer {
  color: #fff;
}

.footer p,
.footer li,
.footer h6,
.footer h4,
.footer i {
  color: #fff !important;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 10px;
}

.footer-bottom {
  border-top: 1px solid rgba(255,255,255,0.15);
}

.footer iframe {
  width: 100%;
  border-radius: 12px;
}

@media (max-width: 991px) {
  .footer {
    text-align: center;
  }

  .footer .col-lg-4,
  .footer .col-lg-3,
  .footer .col-lg-2 {
    margin-bottom: 30px;
  }

  .footer iframe {
    max-width: 450px;
    margin: 15px auto;
    display: block;
  }
}

@media (max-width: 768px) {
  .footer .container-fluid {
    padding-left: 20px !important;
    padding-right: 20px !important;
  }

  .footer h4 {
    font-size: 28px;
  }

  .footer h6 {
    margin-bottom: 15px;
  }

  .footer iframe {
    height: 220px;
  }
}
`}</style>

    </footer>
  );
}

