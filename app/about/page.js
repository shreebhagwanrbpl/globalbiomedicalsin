"use client";

export default function About() {
  return (
    <div className="about-page">

      {/* 🔥 HERO */}
      <section className="about-hero text-center">
        <div className="container">
          <h1 className="fw-bold display-4">
            About <span>Global Biomedicals</span>
          </h1>
          <p className="mt-3">
            Empowering healthcare with advanced diagnostic solutions
          </p>
        </div>
      </section>

      {/* 🔥 ABOUT CONTENT */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center gy-5">

            {/* LEFT */}
            <div className="col-lg-6" data-aos="fade-right">
              <h3 className="fw-bold mb-3">
                Delivering Quality Healthcare Solutions
              </h3>

              <p className="text-muted">
                Global Biomedicals has been providing high-quality diagnostic instruments,
                lab equipment, and medical consumables across India.
              </p>

              <p className="text-muted">
                Our mission is to empower healthcare professionals with reliable
                and advanced technology.
              </p>

              {/* FEATURES */}
              <div className="mt-4">

                <div className="feature">
                  <i className="bi bi-check-circle-fill"></i>
                  Trusted Medical Products
                </div>

                <div className="feature">
                  <i className="bi bi-truck"></i>
                  Pan India Delivery
                </div>

                <div className="feature">
                  <i className="bi bi-headset"></i>
                  24/7 Support Team
                </div>

              </div>

            </div>

            {/* RIGHT IMAGE */}
            <div className="col-lg-6 text-center" data-aos="zoom-in">
              <img
                src="https://cdn.dribbble.com/users/1787323/screenshots/14684624/media/2c9c9d9c6cb3a3c6fd51f54b9cf2d80e.png"
                className="img-fluid about-img"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 🔥 STATS */}
      <section className="stats-section text-center">
        <div className="container">
          <div className="row">

            <div className="col-md-4">
              <h2>1000+</h2>
              <p>Happy Clients</p>
            </div>

            <div className="col-md-4">
              <h2>15+</h2>
              <p>Years Experience</p>
            </div>

            <div className="col-md-4">
              <h2>500+</h2>
              <p>Products Delivered</p>
            </div>

          </div>
        </div>
      </section>

      {/* 🔥 STYLES */}
      <style jsx>{`
        .about-page {
          background: #f8fdfb;
        }

        /* HERO */
        .about-hero {
          padding: 100px 0;
          background: linear-gradient(135deg, #eefaf3, #f8fdfb);
        }

        .about-hero span {
          color: #198754;
        }

        .about-hero p {
          color: #666;
        }

        /* FEATURES */
        .feature {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
          font-weight: 500;
        }

        .feature i {
          color: #198754;
        }

        /* IMAGE */
        .about-img {
          max-width: 400px;
          animation: float 4s ease-in-out infinite;
        }

        /* FLOAT */
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }

        /* STATS */
        .stats-section {
          background: #0f5132;
          color: white;
          padding: 60px 0;
        }

        .stats-section h2 {
          color: #00ffae;
        }

        .stats-section p {
          margin: 0;
        }
      `}</style>

    </div>
  );
}