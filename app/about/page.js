"use client";

export default function About() {

  return (
    <div className="about-page">

      {/* HERO */}
      <section className="about-hero text-center">
        <div className="container">
          <h1 className="fw-bold display-4">
            About <span>Global Biomedical LLP</span>
          </h1>
          <p className="mt-3 fs-5">
            Empowering healthcare & clinical diagnostics with reliable, high-precision equipment across India
          </p>
        </div>
      </section>

      {/* ABOUT CONTENT */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center gy-5">

            {/* LEFT */}
            <div className="col-lg-6" data-aos="fade-right">
              <h3 className="fw-bold mb-3 text-dark">
                Delivering Premium Medical & Laboratory Solutions
              </h3>

              <p className="text-secondary">
                <strong>Global Biomedical LLP</strong> is a premier supplier and service provider of advanced laboratory equipment,
                pathology analyzers, ICU monitors, surgical instruments, and clinical consumables.
              </p>

              <p className="text-secondary">
                Our mission is to support doctors, path labs, and hospitals with state-of-the-art technology, transparent pricing, and instant technical service support.
              </p>

              {/* FEATURES */}
              <div className="mt-4">
                <div className="feature">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Certified Medical & Laboratory Products</span>
                </div>

                <div className="feature">
                  <i className="bi bi-truck"></i>
                  <span>Pan-India Fast Delivery & Logistics</span>
                </div>

                <div className="feature">
                  <i className="bi bi-headset"></i>
                  <span>Dedicated Helpline Support (9257984336, 8529833535, 9983301657)</span>
                </div>
              </div>

              <a
                href="/products"
                className="btn btn-success mt-4 px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2 text-white text-decoration-none"
              >
                <i className="bi bi-file-earmark-pdf-fill text-white"></i>
                <span>Explore Products Catalog (PDF)</span>
              </a>
            </div>

            {/* RIGHT IMAGE */}
            <div className="col-lg-6 text-center" data-aos="zoom-in">
              <img
                src="https://cdn.dribbble.com/users/1787323/screenshots/14684624/media/2c9c9d9c6cb3a3c6fd51f54b9cf2d80e.png"
                className="img-fluid about-img rounded-4 shadow-sm"
                alt="Global Biomedical LLP About Us"
              />
            </div>

          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section text-center">
        <div className="container">
          <div className="row g-4">

            <div className="col-md-4">
              <h2 className="fw-bold">1000+</h2>
              <p className="lead text-light">Satisfied Hospitals & Labs</p>
            </div>

            <div className="col-md-4">
              <h2 className="fw-bold">15+</h2>
              <p className="lead text-light">Years Industry Experience</p>
            </div>

            <div className="col-md-4">
              <h2 className="fw-bold">500+</h2>
              <p className="lead text-light">Quality Medical Products</p>
            </div>

          </div>
        </div>
      </section>

      {/* STYLES */}
      <style jsx>{`
        .about-page {
          background: #f8fdfb;
        }

        .about-hero {
          padding: 80px 0;
          background: linear-gradient(135deg, #eefaf3, #f8fdfb);
        }

        .about-hero span {
          color: #198754;
        }

        .about-hero p {
          color: #555;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          font-weight: 500;
          color: #333;
        }

        .feature i {
          color: #198754;
          font-size: 20px;
        }

        .about-img {
          max-width: 420px;
          animation: float 4s ease-in-out infinite;
        }

        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }

        .stats-section {
          background: linear-gradient(135deg, #155e75, #164e63);
          color: white;
          padding: 60px 0;
        }

        .stats-section h2 {
          color: #00ffae;
        }
      `}</style>
    </div>
  );
}