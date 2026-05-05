"use client";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid px-5">
      <Link href="/" className="navbar-brand">
        <Image
          src="/logo.png"
          alt="Raj Biosis"
          width={140}
          height={50}
          style={{ objectFit: "contain" }}
          priority
        />
      </Link>
        <button
          className="navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav ms-auto align-items-center gap-4">
            <li><Link href="/about" className="nav-link">About</Link></li>
            <li><Link href="/services" className="nav-link">Services</Link></li>
            <li><Link href="/products" className="nav-link">Products</Link></li>
            <li><Link href="/contact" className="nav-link">Contact</Link></li>
            {/* <li>
              <Link href="/contact" className="btn btn-success px-3">
                Get Quote
              </Link>
            </li> */}
          </ul>
        </div>
      </div>

      {/* 🔥 STYLES */}
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