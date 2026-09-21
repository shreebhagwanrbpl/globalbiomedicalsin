"use client";

export default function ProductPdfBrochure({ product }) {
  if (!product) return null;

  const pTitle = product.title || "Biomedical Equipment";
  const pImage = product.images?.[0] || product.image || "/placeholder.jpg";
  const pBrand = product.brand || "Global Biomedical LLP Partner";
  const pModel = product.model || "N/A";
  const pInstrument = product.instrument || product.category || "Diagnostic Equipment";
  const pUsage = product.usage || "Clinical Laboratory / Hospital";
  const pAutomation = product.automation || "Semi / Fully Automatic";
  const pCapacity = product.size || product.capacity || "Standard";
  const pAvailability = product.availability || "In Stock";
  const pDesc =
    product.desc ||
    product.description ||
    `The ${pTitle} is an advanced diagnostic analyzer designed for high performance, accuracy, and reliability in medical laboratories, hospitals, and clinical settings.`;

  return (
    <>
      <div className="pdf-print-only-container" id="printable-product-brochure">
        
        {/* WATERMARK BACKGROUND (GLOBAL BIOMEDICAL LLP) */}
        <div className="brochure-watermark-grid" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, i) => (
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

        {/* MAIN BROCHURE BODY */}
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
              <div className="specs-table-header">KEY SPECIFICATIONS</div>
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
                  <span className="spec-value text-success font-weight-bold">
                    {pAvailability}
                  </span>
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
              <div className="card-header-teal">KEY APPLICATIONS</div>
              <div className="card-content-body">
                <ul>
                  <li>
                    <span className="bullet-dot"></span> Clinical Diagnostic Laboratories
                  </li>
                  <li>
                    <span className="bullet-dot"></span> Hospitals & Healthcare Centres
                  </li>
                  <li>
                    <span className="bullet-dot"></span> Pathology & Testing Labs
                  </li>
                  <li>
                    <span className="bullet-dot"></span> Blood Banks & Research Units
                  </li>
                  <li>
                    <span className="bullet-dot"></span> Medical Colleges & Institutions
                  </li>
                </ul>
              </div>
            </div>

            {/* WHY CHOOSE GLOBAL BIOMEDICAL LLP */}
            <div className="info-card-box">
              <div className="card-header-teal">WHY CHOOSE GLOBAL BIOMEDICAL LLP</div>
              <div className="card-content-body">
                <ul>
                  <li>
                    <span className="bullet-dot"></span> Trusted Biomedical Equipment Supplier
                  </li>
                  <li>
                    <span className="bullet-dot"></span> 100% Genuine Leading Brand Products
                  </li>
                  <li>
                    <span className="bullet-dot"></span> Competitive Pricing & Warranty Support
                  </li>
                  <li>
                    <span className="bullet-dot"></span> Prompt Installation & Staff Training
                  </li>
                  <li>
                    <span className="bullet-dot"></span> Fast Express Delivery Across India
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER SECTION */}
        <div className="brochure-footer">
          <div className="footer-left">
            <div className="footer-company">
              GLOBAL BIOMEDICAL LLP - Diagnostic Instruments & Healthcare Solutions
            </div>
            <div className="footer-sub">
              Biomedical equipment sales, service, installation, AMC & calibration across India
            </div>
          </div>
          <div className="footer-right">
            Official Product Brochure | Confidential & Proprietary
          </div>
        </div>

      </div>

      <style jsx global>{`
        /* HIDE PRINT BROCHURE ON NORMAL SCREEN VIEW */
        @media screen {
          .pdf-print-only-container {
            display: none !important;
          }
        }

        /* PRINT STYLES FOR PERFECT A4 PDF DOWNLOAD */
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm;
          }

          body * {
            visibility: hidden !important;
          }

          #printable-product-brochure,
          #printable-product-brochure * {
            visibility: visible !important;
          }

          #printable-product-brochure {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            background: #ffffff !important;
            font-family: Arial, Helvetica, sans-serif !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
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
            gap: 100px 50px;
            transform: rotate(-30deg);
            pointer-events: none;
            user-select: none;
            z-index: 0;
          }

          .watermark-text-item {
            font-size: 24px;
            font-weight: 800;
            color: rgba(27, 94, 118, 0.08) !important;
            letter-spacing: 2px;
            white-space: nowrap;
          }

          /* HEADER */
          .brochure-header {
            background: #1b5e76 !important;
            color: #ffffff !important;
            padding: 16px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            z-index: 1;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .company-title {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            color: #ffffff !important;
          }

          .header-right {
            text-align: right;
            font-size: 12px;
            line-height: 1.4;
            color: #ffffff !important;
          }

          /* BODY */
          .brochure-body {
            padding: 20px 0;
            position: relative;
            z-index: 1;
          }

          .product-main-title {
            font-size: 24px;
            font-weight: 800;
            color: #111111 !important;
            margin-bottom: 10px;
            line-height: 1.2;
          }

          .brochure-banner {
            background: #e09f3e !important;
            color: #ffffff !important;
            font-weight: 700;
            font-size: 14px;
            padding: 8px 16px;
            letter-spacing: 0.5px;
            margin-bottom: 20px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* TOP SPECS ROW */
          .top-specs-row {
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 20px;
            margin-bottom: 20px;
          }

          .product-img-box {
            border: 2px solid #99f6e4 !important;
            border-radius: 12px;
            padding: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #ffffff !important;
            height: 240px;
            box-sizing: border-box;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .product-img-box img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }

          .specs-table-box {
            border: 1px solid #bae6fd !important;
            border-radius: 8px;
            overflow: hidden;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .specs-table-header {
            background: #1b5e76 !important;
            color: #ffffff !important;
            font-weight: 700;
            font-size: 14px;
            padding: 8px 14px;
            letter-spacing: 0.5px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .spec-row {
            display: flex;
            justify-content: space-between;
            padding: 6px 14px;
            font-size: 12.5px;
            border-bottom: 1px solid #f0f4f8;
          }

          .spec-row.alt {
            background: #e0f2fe !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .spec-label {
            font-weight: 700;
            color: #1b5e76 !important;
            width: 45%;
          }

          .spec-value {
            color: #222222 !important;
            width: 55%;
          }

          /* OVERVIEW */
          .section-block {
            margin-bottom: 20px;
          }

          .section-title {
            font-size: 16px;
            font-weight: 800;
            color: #1b5e76 !important;
            margin-bottom: 6px;
            letter-spacing: 0.5px;
          }

          .overview-text {
            font-size: 12.5px;
            color: #333333 !important;
            line-height: 1.5;
            margin: 0;
          }

          /* BOTTOM CARDS */
          .bottom-cards-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 16px;
          }

          .info-card-box {
            border: 1px solid #bae6fd !important;
            border-radius: 8px;
            overflow: hidden;
            background: #f0fdf4 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .card-header-teal {
            background: #1b5e76 !important;
            color: #ffffff !important;
            font-weight: 700;
            font-size: 13px;
            padding: 8px 14px;
            letter-spacing: 0.5px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .card-content-body {
            padding: 10px 14px;
          }

          .card-content-body ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .card-content-body li {
            font-size: 12px;
            color: #222222 !important;
            font-weight: 500;
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .bullet-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #e09f3e !important;
            display: inline-block;
            flex-shrink: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* FOOTER */
          .brochure-footer {
            border-top: 3px solid #e09f3e !important;
            background: #ffffff !important;
            padding-top: 10px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            font-size: 11px;
            color: #555555 !important;
            position: relative;
            z-index: 1;
            margin-top: 10px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .footer-company {
            font-weight: 800;
            color: #1b5e76 !important;
            font-size: 12px;
          }

          .footer-sub {
            color: #666666 !important;
            margin-top: 2px;
          }

          .footer-right {
            color: #777777 !important;
            font-size: 10.5px;
          }
        }
      `}</style>
    </>
  );
}
