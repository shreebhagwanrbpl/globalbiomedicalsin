"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {

  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);

  // current path
  const pathParts = pathname
    .split("/")
    .filter(Boolean);

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
  pathParts[0] &&
  !reservedRoutes.includes(pathParts[0])
    ? pathParts[0]
    : null;

  // dynamic links
  // const makeLink = (path = "") => {
  //   if (!path) {
  //     return `/${district}`;
  //   }
  //   return `/${district}${path}`;
  // };
  const makeLink = (path = "") => {
  if (!district) {
    return path || "/";
  }

  return `/${district}${path}`;
};



  return (
    <nav className="navbar navbar-expand-lg custom-navbar">

      <div className="container-fluid px-5">

        {/* LOGO */}
        <Link
          href={makeLink("")}
          className="navbar-brand"
        >
          <Image
            src="/globallogo.png"
            alt="Global Biomedicals"
            width={140}
            height={50}
            style={{ objectFit: "contain" }}
            priority
          />
        </Link>

        {/* TOGGLE */}
        <button
          className="navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* MENU */}
        <div
          className={`collapse navbar-collapse ${
            menuOpen ? "show" : ""
          }`}
          id="nav"
        >

          <ul className="navbar-nav ms-auto align-items-center gap-4">

            <li>
              <Link
                href={makeLink("/about")}
                className="nav-link"
              >
                About
              </Link>
            </li>

            <li>
              <Link
                href={makeLink("/services")}
                className="nav-link"
              >
                Services
              </Link>
            </li>
              <li>
                <Link
                  href={makeLink("/products")}
                  className="nav-link"
                >
                  Products
                </Link>
              </li>

            <li>
              <Link
                href={makeLink("/contact")}
                className="nav-link"
              >
                Contact
              </Link>
            </li>

            {/* <li>
              <Link
                href={makeLink("/contact")}
                className="btn btn-success px-3"
              >
                Get Quote
              </Link>
            </li> */}

          </ul>

        </div>

      </div>

      {/* STYLES */}
      <style jsx>{`
        .custom-navbar {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(10px);
          padding: 10px 0;
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .logo {
          height: 50px;
          object-fit: contain;
        }

        .nav-link {
          font-weight: 500;
          color: #333;
          transition: 0.3s;
        }

        .nav-link:hover {
          color: #198754;
        }

        .btn {
          border-radius: 8px;
        }
      `}</style>
    </nav>
  );
}