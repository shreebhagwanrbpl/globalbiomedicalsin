"use client";

export default function ProductPdfModal({ isOpen, onClose, product }) {
  if (!isOpen || !product) return null;

  const handlePrint = () => {
    window.print();
  };

  const pTitle = product.title || "Biomedical Equipment";
  const pImage = product.images?.[0] || product.image || "/placeholder.jpg";
  const pBrand = product.brand || "Global Biomedical LLP Partner";
  const pModel = product.model || "N/A";
  const pInstrument = product.instrument || product.category || "Diagnostic Equipment";
  const pUsage = product.usage || "Clinical Laboratory / Hospital";
  const pAutomation = product.automation || "Semi / Fully Automatic";
  const pCapacity = product.size || product.capacity || "Standard";
  const pAvailability = product.availability || "In Stock";
  const pDesc = product.desc || product.description || `The ${pTitle} is an advanced diagnostic analyzer designed for high performance, accuracy, and reliability in medical laboratories, hospitals, and clinical settings.`;

  return (
    <div className="product-pdf-overlay">
      <div className="product-pdf-container">

        {/* MODAL ACTION BAR (Hidden in print) */}
        <div className="pdf-action-bar no-print">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-file-earmark-pdf-fill text-danger fs-4"></i>
            <span className="fw-bold fs-5 text-dark">Product Specification Brochure (PDF)</span>
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-success btn-sm px-4 fw-bold d-flex align-items-center gap-2" onClick={handlePrint}>
              <i className="bi bi-download"></i>
              <span>Download PDF / Print</span>
            </button>
            <button className="btn btn-outline-secondary btn-sm px-3" onClick={onClose}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        </div>

        {/* PRINTABLE PAGE MATCHING USER SCREENSHOT */}
        <div className="product-brochure-page" id="printable-product-brochure">
          
          {/* WATERMARK BACKGROUND (GLOBAL BIOMEDICAL LLP) */}
          <div className="brochure-watermark-grid" aria-hidden="true">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="watermark-text-item">
                GLOBAL BIOMEDICAL LLP
              </div>
            ))}
          </div>

          {/* TOP HEADER BAR (TEAL BLUE) */}
          <div className="brochure-header">
            <div className="header-left">
              <h2 className="company-title">Global Biomedical LLP</h2>
            </div>
            <div className="header-right">
              <div>Phone: +91 9257984336, 8529833535, 9983301657</div>
              <div>Web: www.globalbiomedicals.in</div>
            </div>
          </div>

          {/* MAIN CONTENT WRAPPER */}
          <div className="brochure-body">

            {/* PRODUCT TITLE */}
            <h1 className="product-main-title">{pTitle}</h1>

            {/* AMBER BANNER */}
            <div className="brochure-banner">
              OFFICIAL PRODUCT SPECIFICATION BROCHURE
            </div>

            {/* TOP SECTION: IMAGE + KEY SPECIFICATIONS */}
            <div className="top-specs-row">
              {/* IMAGE BOX */}
              <div className="product-img-box">
                <img src={pImage} alt={pTitle} />
              </div>

              {/* SPECIFICATIONS TABLE */}
              <div className="specs-table-box">
                <div className="specs-table-header">
                  KEY SPECIFICATIONS
                </div>
                <div className="specs-table-body">
                  <div className="spec-row alt">
                    <span className="spec-label">Brand:</span>
                    <span className="spec-value">{pBrand}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Model:</span>
                    <span className="spec-value">{pModel}</span>
                  </div>
                  <div className="spec-row alt">
                    <span className="spec-label">Instrument:</span>
                    <span className="spec-value">{pInstrument}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Usage:</span>
                    <span className="spec-value">{pUsage}</span>
                  </div>
                  <div className="spec-row alt">
                    <span className="spec-label">Automation:</span>
                    <span className="spec-value">{pAutomation}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Size / Capacity:</span>
                    <span className="spec-value">{pCapacity}</span>
                  </div>
                  <div className="spec-row alt">
                    <span className="spec-label">Availability:</span>
                    <span className="spec-value text-success font-weight-bold">{pAvailability}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PRODUCT OVERVIEW */}
            <div className="section-block">
              <h3 className="section-title">PRODUCT OVERVIEW</h3>
              <p className="overview-text">{pDesc}</p>
            </div>

            {/* TWO BOTTOM CARDS: APPLICATIONS & WHY CHOOSE US */}
            <div className="bottom-cards-row">
              
              {/* KEY APPLICATIONS */}
              <div className="info-card-box">
                <div className="card-header-teal">
                  KEY APPLICATIONS
                </div>
                <div className="card-content-body">
                  <ul>
                    <li><span className="bullet-dot"></span> Clinical Diagnostic Laboratories</li>
                    <li><span className="bullet-dot"></span> Hospitals & Healthcare Centres</li>
                    <li><span className="bullet-dot"></span> Pathology & Testing Labs</li>
                    <li><span className="bullet-dot"></span> Blood Banks & Research Units</li>
                    <li><span className="bullet-dot"></span> Medical Colleges & Institutions</li>
                  </ul>
                </div>
              </div>

              {/* WHY CHOOSE GLOBAL BIOMEDICAL LLP */}
              <div className="info-card-box">
                <div className="card-header-teal">
                  WHY CHOOSE GLOBAL BIOMEDICAL LLP
                </div>
                <div className="card-content-body">
                  <ul>
                    <li><span className="bullet-dot"></span> Trusted Biomedical Equipment Supplier</li>
                    <li><span className="bullet-dot"></span> 100% Genuine Leading Brand Products</li>
                    <li><span className="bullet-dot"></span> Competitive Pricing & Warranty Support</li>
                    <li><span className="bullet-dot"></span> Prompt Installation & Staff Training</li>
                    <li><span className="bullet-dot"></span> Fast Express Delivery Across India</li>
                  </ul>
                </div>
              </div>

            </div>

          </div>

          {/* FOOTER SECTION */}
          <div className="brochure-footer">
            <div className="footer-left">
              <div className="footer-company">GLOBAL BIOMEDICAL LLP - Diagnostic Instruments & Healthcare Solutions</div>
              <div className="footer-sub">Biomedical equipment sales, service, installation, AMC & calibration across India</div>
            </div>
            <div className="footer-right">
              Official Product Brochure | Confidential & Proprietary
            </div>
          </div>

        </div>

      </div>

      <style jsx>{`
        .product-pdf-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(4px);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow-y: auto;
        }

        .product-pdf-container {
          background: #333;
          width: 100%;
          max-width: 900px;
          max-height: 92vh;
          border-radius: 8px;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .pdf-action-bar {
          background: #ffffff;
          padding: 14px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #ddd;
          position: sticky;
          top: 0;
          z-index: 20;
        }

        .product-brochure-page {
          background: #ffffff;
          padding: 30px 40px;
          position: relative;
          color: #222;
          font-family: Arial, sans-serif;
          min-height: 1000px;
          box-sizing: border-box;
          overflow: hidden;
        }

        /* WATERMARK GRID */
        .brochure-watermark-grid {
          position: absolute;
          top: -20%;
          left: -20%;
          width: 140%;
          height: 140%;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 120px 60px;
          transform: rotate(-32deg);
          pointer-events: none;
          user-select: none;
          z-index: 0;
        }

        .watermark-text-item {
          font-size: 24px;
          font-weight: 800;
          color: rgba(27, 94, 118, 0.08);
          letter-spacing: 2px;
          white-space: nowrap;
        }

        /* HEADER */
        .brochure-header {
          background: #1b5e76;
          color: #ffffff;
          padding: 20px 25px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .company-title {
          margin: 0;
          font-size: 26px;
          font-weight: 700;
        }

        .header-right {
          text-align: right;
          font-size: 13px;
          line-height: 1.5;
          opacity: 0.95;
        }

        /* BODY */
        .brochure-body {
          padding: 25px 5px;
          position: relative;
          z-index: 1;
        }

        .product-main-title {
          font-size: 28px;
          font-weight: 800;
          color: #111;
          margin-bottom: 12px;
        }

        .brochure-banner {
          background: #e09f3e;
          color: #ffffff;
          font-weight: 700;
          font-size: 15px;
          padding: 10px 18px;
          letter-spacing: 0.5px;
          margin-bottom: 25px;
        }

        /* TOP ROW */
        .top-specs-row {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 24px;
          margin-bottom: 25px;
        }

        .product-img-box {
          border: 2px solid #99f6e4;
          border-radius: 16px;
          padding: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          height: 280px;
        }

        .product-img-box img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .specs-table-box {
          border: 1px solid #bae6fd;
          border-radius: 8px;
          overflow: hidden;
          background: #fff;
        }

        .specs-table-header {
          background: #1b5e76;
          color: #ffffff;
          font-weight: 700;
          font-size: 15px;
          padding: 10px 16px;
          letter-spacing: 0.5px;
        }

        .spec-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 16px;
          font-size: 13.5px;
          border-bottom: 1px solid #f0f4f8;
        }

        .spec-row.alt {
          background: #e0f2fe;
        }

        .spec-label {
          font-weight: 700;
          color: #1b5e76;
          width: 45%;
        }

        .spec-value {
          color: #333;
          width: 55%;
        }

        /* OVERVIEW */
        .section-block {
          margin-bottom: 25px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 800;
          color: #1b5e76;
          margin-bottom: 8px;
          letter-spacing: 0.5px;
        }

        .overview-text {
          font-size: 13.5px;
          color: #444;
          line-height: 1.6;
          margin: 0;
        }

        /* BOTTOM CARDS */
        .bottom-cards-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .info-card-box {
          border: 1px solid #bae6fd;
          border-radius: 10px;
          overflow: hidden;
          background: #f0fdf4;
        }

        .card-header-teal {
          background: #1b5e76;
          color: #ffffff;
          font-weight: 700;
          font-size: 14px;
          padding: 10px 16px;
          letter-spacing: 0.5px;
        }

        .card-content-body {
          padding: 14px 16px;
        }

        .card-content-body ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .card-content-body li {
          font-size: 13px;
          color: #333;
          font-weight: 500;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .bullet-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #e09f3e;
          display: inline-block;
          flex-shrink: 0;
        }

        /* FOOTER */
        .brochure-footer {
          border-top: 3px solid #e09f3e;
          background: #ffffff;
          padding-top: 12px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          font-size: 11.5px;
          color: #555;
          position: relative;
          z-index: 1;
          margin-top: 15px;
        }

        .footer-company {
          font-weight: 800;
          color: #1b5e76;
          font-size: 12.5px;
        }

        .footer-sub {
          color: #666;
          margin-top: 2px;
        }

        .footer-right {
          color: #777;
          font-size: 11px;
        }

        @media print {
          .no-print {
            display: none !important;
          }

          .product-pdf-overlay {
            position: static !important;
            background: none !important;
            padding: 0 !important;
          }

          .product-pdf-container {
            max-width: 100% !important;
            max-height: 100% !important;
            box-shadow: none !important;
            background: #fff !important;
          }

          .product-brochure-page {
            padding: 0 !important;
          }

          body * {
            visibility: hidden;
          }

          #printable-product-brochure, #printable-product-brochure * {
            visibility: visible;
          }

          #printable-product-brochure {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
