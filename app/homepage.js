"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
export default function Home() {
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    const snap = await getDoc(
      doc(db, "websites", "RbplWebThree", "pages", "products")
    );

    if (snap.exists()) {
      const data = snap.data().products || [];
      const visible = data.filter((p) => p.isPublished !== false);
      setProducts(visible);
    }
  };

  fetchData();
}, []);

  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDoc(
        doc(db, "websites", "RbplWebThree", "pages", "services")
      );

      if (snap.exists()) {
        const data = snap.data().services || [];

        // 🔥 sirf first 3
        setServices(data.slice(0, 3));
      }
    };

    fetchData();
  }, []);

  const icons = [
    "bi-heart-pulse",
    "bi-capsule",
    "bi-tools",
  ];

  return (
    <>
      {/* SERVICES */}
  <section className="py-5 bg-light">
      <div className="container-fluid px-5 text-center">
        <h2 className="fw-bold mb-5">Our Core Services</h2>

        <div className="row g-4">
          {services.length === 0 ? (
            <p>No Services Found</p>
          ) : (
            services.map((item, i) => (
              <div className="col-md-4" key={i}>
                <div className="p-4 rounded-4 service-card h-100">

                  {/* ICON */}
                  <i className={`bi ${icons[i] || "bi-heart-pulse"} fs-1 text-success`}></i>

                  {/* DATA */}
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
  <div className="container-fluid px-5 text-center">

    <h2 className="section-title">Our Products</h2>

    <div className="row g-4">

      {products.slice(0, 4).map((item, i) => (
        <div className="col-md-3" key={item.id || i}>

          <div className="product-card-pro">

            <div className="product-img-pro">
              <img src={item.image || "/no-image.png"} />
            </div>

            <div className="product-body text-start">

              <h6>{item.title}</h6>

              <div className="meta">
                <span>{item.brand || "-"}</span>
                <span>{item.size || "-"}</span>
                <span>{item.usage || "-"}</span>
              </div>

              <Link href={`/products`}>
                <button className="btn btn-success w-100 mt-3">
                  View Details
                </button>
              </Link>

            </div>

          </div>

        </div>
      ))}

    </div>

  </div>
</section>


      {/* WHY CHOOSE US */}
  {/* <section className="py-5" style={{background:"#f8fafc"}}>
  <div className="container-fluid px-5">

    <div className="row align-items-center gy-5">

      <div className="col-lg-6" data-aos="fade-right">

        <h2 className="fw-bold mb-4 display-5">
          Why Choose <span style={{color:"#198754"}}>Raj Biosis?</span>
        </h2>

        <p className="text-muted fs-5">
          We deliver trusted diagnostic solutions with high precision
          and reliability for hospitals and laboratories.
        </p>

        <div className="mt-4">

          <div className="d-flex align-items-center mb-3 feature-item">
            <i className="bi bi-check-circle-fill text-success fs-4 me-3"></i>
            <span>Certified Medical Products</span>
          </div>

          <div className="d-flex align-items-center mb-3 feature-item">
            <i className="bi bi-truck text-success fs-4 me-3"></i>
            <span>Pan India Delivery</span>
          </div>

          <div className="d-flex align-items-center mb-3 feature-item">
            <i className="bi bi-headset text-success fs-4 me-3"></i>
            <span>Expert Support Team</span>
          </div>

        </div>

      </div>

  
      <div className="col-lg-6 text-center" data-aos="zoom-in">

        <div className="image-wrapper">
          <img
            src="https://images.unsplash.com/photo-1581594693702-fbdc51b2763b"
            className="img-fluid rounded-4 shadow-lg"
          />
        </div>

      </div>

    </div>

  </div>
</section> */}

    <section className="py-5 why-section">
      <div className="container-fluid px-5">
        <div className="row align-items-center gy-5">
          {/* LEFT */}
          <div className="col-lg-6" data-aos="fade-right">
            <h2 className="fw-bold mb-4 display-5">
              Why Choose <span className="text-success">Raj Biosis?</span>
            </h2>

            <p className="fs-5">
              We deliver trusted diagnostic solutions with high precision
              and reliability for hospitals and laboratories.
            </p>

            {/* FEATURES */}
            <div className="mt-4">
              <div className="feature-item">
                <i className="bi bi-check-circle-fill"></i>
                Certified Medical Products
              </div>

              <div className="feature-item">
                <i className="bi bi-truck"></i>
                Pan India Delivery
              </div>

              <div className="feature-item">
                <i className="bi bi-headset"></i>
                Expert Support Team
              </div>
            </div>

            {/* STATS */}
            <div className="row mt-5 stats">
              <div className="col-4">
                <h3>1000+</h3>
                <p>Clients</p>
              </div>

              <div className="col-4">
                <h3>15+</h3>
                <p>Years</p>
              </div>

              <div className="col-4">
                <h3>500+</h3>
                <p>Products</p>
              </div>
            </div>
          </div>
          <div className="col-lg-6 text-center" data-aos="zoom-in">
            <div className="image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1581594693702-fbdc51b2763b"
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

      <section className="py-5 bg-light">
      <div className="container-fluid px-5 text-center">
        <h2 className="fw-bold mb-4">Our Trusted Partners</h2>

        <div className="partner-slider">
          <div className="partner-track">

            {[1,2,3,4,5,6,7,8].map((i)=>(
              <img
                key={i}
                src="https://upload.wikimedia.org/wikipedia/commons/3/3f/Logo_placeholder.png"
              />
            ))}
          </div>
        </div>
      </div>
    </section>

      {/* CTA */}
      <section className="py-5 text-center text-white" style={{background:"#0f5132"}}>
        <div className="container">
          <h2 className="fw-bold">Need Medical Solutions?</h2>
          <p>Contact us today for best diagnostic equipment</p>
          <button className="btn btn-light px-4">Get in Touch</button>
        </div>
      </section>
      
    </>
  );
}