"use client";

import { useState } from "react";
import Image from "next/image";

export default function PdfModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const categoriesData = [
    {
      title: "1. ICU & Operation Theatre (OT) Equipment",
      items: [
        "Patient Monitors (Multi-para, High-end Monitors)",
        "Ventilators & Anesthesia Workstations",
        "OT Lights & Hydraulic/Electric Surgical Tables",
        "Defibrillators & Syringe / Infusion Pumps",
        "Electrosurgical Units (Cautery Machines)"
      ]
    },
    {
      title: "2. Diagnostic & Laboratory Analyzers",
      items: [
        "Fully & Semi-Automated Biochemistry Analyzers",
        "3-Part & 5-Part Hematology Cell Counters",
        "Electrolyte & Urine Analyzers",
        "Immunoassay & Coagulation Analyzers",
        "Centrifuges & Laboratory Incubators"
      ]
    },
    {
      title: "3. Biomedical & Clinical Instruments",
      items: [
        "12-Channel & 3-Channel ECG Machines",
        "Pulse Oximeters & Fetal Dopplers",
        "Binocular & Trinocular Medical Microscopes",
        "Autoclaves & Sterilizers",
        "Suction Machines & Nebulizers"
      ]
    },
    {
      title: "4. Hospital Furniture & Patient Care",
      items: [
        "ICU Beds (Electric & Manual Motorized)",
        "Patient Examination & Stretcher Beds",
        "Crash Carts & Medicine Trolleys",
        "Wheelchairs & Patient Transfer Chairs",
        "Bedside Lockers & Overbed Tables"
      ]
    },
    {
      title: "5. Medical Consumables & Reagents",
      items: [
        "Biochemistry & Hematology Reagents",
        "Rapid Diagnostic Test Kits ( Dengue, Malaria, HIV, etc. )",
        "Surgical Gloves, Syringes & IV Sets",
        "ECG Paper & Ultrasound Gel",
        "Pathology Lab Disposables"
      ]
    }
  ];

  return (
    <div className="pdf-modal-overlay">
      <div className="pdf-modal-container">

        {/* TOP BAR / CONTROLS (Hidden during printing) */}
        <div className="pdf-modal-header no-print">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-file-earmark-pdf-fill text-danger fs-4"></i>
            <span className="fw-bold fs-5 text-dark">Global Biomedical LLP - Product Catalog (PDF)</span>
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-success btn-sm d-flex align-items-center gap-2 px-3" onClick={handlePrint}>
              <i className="bi bi-download"></i>
              <span>Download PDF / Print</span>
            </button>

            <button className="btn btn-outline-secondary btn-sm px-3" onClick={onClose}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        </div>

        {/* PRINTABLE CATALOG DOCUMENT */}
        <div className="pdf-document-body" id="printable-brochure">
          
          {/* WATERMARK */}
          <div className="pdf-watermark" aria-hidden="true">
            <span>GLOBAL BIOMEDICAL LLP</span>
          </div>

          {/* DOCUMENT HEADER */}
          <div className="pdf-header text-center pb-4 mb-4 border-bottom">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div className="text-start">
                <h1 className="fw-bold text-success mb-1" style={{ fontSize: "28px", letterSpacing: "0.5px" }}>
                  GLOBAL BIOMEDICAL LLP
                </h1>
                <p className="text-muted mb-0 fw-medium" style={{ fontSize: "14px" }}>
                  Trusted Partner for Medical & Laboratory Equipment Across India
                </p>
                <small className="text-secondary">Regd. LLP No: AAF-8890 | Quality Certified Healthcare Solutions</small>
              </div>

              <div className="text-end">
                <span className="badge bg-success px-3 py-2 fs-6 mb-2">OFFICIAL BROCHURE & CATALOG</span>
                <div className="text-muted small">Updated 2026 Edition</div>
              </div>
            </div>

            {/* CONTACT NUMBERS HEADER HIGHLIGHT */}
            <div className="contact-banner mt-3 p-3 rounded text-dark d-flex justify-content-around flex-wrap gap-2 border">
              <div>
                <i className="bi bi-telephone-fill text-success me-1"></i>
                <strong>Sales & Support 1:</strong> <a href="tel:+919257984336" className="text-decoration-none text-dark fw-bold">9257984336</a>
              </div>
              <div>
                <i className="bi bi-telephone-fill text-success me-1"></i>
                <strong>Sales & Support 2:</strong> <a href="tel:+918529833535" className="text-decoration-none text-dark fw-bold">8529833535</a>
              </div>
              <div>
                <i className="bi bi-telephone-fill text-success me-1"></i>
                <strong>Customer Care:</strong> <a href="tel:+919983301657" className="text-decoration-none text-dark fw-bold">9983301657</a>
              </div>
            </div>
          </div>

          {/* INTRODUCTION */}
          <div className="mb-4">
            <h5 className="fw-bold text-dark border-start border-4 border-success ps-2 mb-2">
              About Global Biomedical LLP
            </h5>
            <p className="small text-secondary leading-relaxed">
              Global Biomedical LLP is a leading supplier and service provider of state-of-the-art diagnostic instruments,
              biomedical equipment, hospital furniture, and pathology consumables. We serve top hospitals, clinical laboratories,
              research institutes, and medical centers nationwide with uncompromised quality, competitive pricing, and 24/7 technical support.
            </p>
          </div>

          {/* CATEGORIES GRID */}
          <div className="catalog-grid mb-4">
            <h5 className="fw-bold text-dark border-start border-4 border-success ps-2 mb-3">
              Product Categories & Offerings
            </h5>

            <div className="row g-3">
              {categoriesData.map((cat, idx) => (
                <div className="col-12 col-md-6" key={idx}>
                  <div className="p-3 border rounded h-100 bg-light-subtle">
                    <h6 className="fw-bold text-success mb-2">{cat.title}</h6>
                    <ul className="mb-0 ps-3 small text-secondary">
                      {cat.items.map((item, i) => (
                        <li key={i} className="mb-1">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CONTACT & FOOTER IN CATALOG */}
          <div className="pdf-footer-section pt-3 border-top mt-4 text-center">
            <div className="row text-start g-3 small">
              <div className="col-md-4">
                <h6 className="fw-bold text-dark mb-1">Contact Phone Numbers</h6>
                <div><i className="bi bi-whatsapp text-success me-1"></i> +91 92579 84336</div>
                <div><i className="bi bi-whatsapp text-success me-1"></i> +91 85298 33535</div>
                <div><i className="bi bi-telephone-fill text-success me-1"></i> +91 99833 01657</div>
              </div>

              <div className="col-md-4">
                <h6 className="fw-bold text-dark mb-1">Head Office & Support</h6>
                <p className="mb-0 text-muted">Amrapali Circle, Vaishali Nagar, Jaipur, Rajasthan - 302021</p>
                <p className="mb-0 text-muted">Pan India Supply & Service Network</p>
              </div>

              <div className="col-md-4">
                <h6 className="fw-bold text-dark mb-1">Website & Email</h6>
                <div><i className="bi bi-globe me-1"></i> www.globalbiomedicals.in</div>
                <div><i className="bi bi-envelope me-1"></i> info@globalbiomedicals.in</div>
              </div>
            </div>

            <div className="mt-3 pt-2 text-center text-muted small border-top">
              © {new Date().getFullYear()} <strong>Global Biomedical LLP</strong> | All Rights Reserved. Product specifications subject to continuous innovation.
            </div>
          </div>

        </div>

      </div>

      <style jsx>{`
        .pdf-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(5px);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow-y: auto;
        }

        .pdf-modal-container {
          background: #fff;
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          border-radius: 12px;
          overflow-y: auto;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
        }

        .pdf-modal-header {
          padding: 16px 24px;
          border-bottom: 1px solid #eee;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .pdf-document-body {
          padding: 40px;
          position: relative;
          background: #ffffff;
        }

        .pdf-watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-30deg);
          font-size: 42px;
          font-weight: 900;
          color: rgba(0, 0, 0, 0.04);
          letter-spacing: 4px;
          pointer-events: none;
          white-space: nowrap;
          user-select: none;
          z-index: 0;
        }

        .contact-banner {
          background: #f1f8f5;
          border-color: #d1e7dd !important;
        }

        @media print {
          .no-print {
            display: none !important;
          }

          .pdf-modal-overlay {
            position: static !important;
            background: none !important;
            padding: 0 !important;
            backdrop-filter: none !important;
            overflow: visible !important;
          }

          .pdf-modal-container {
            max-width: 100% !important;
            max-height: 100% !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            overflow: visible !important;
          }

          .pdf-document-body {
            padding: 20px !important;
          }

          .pdf-watermark {
            opacity: 0.12 !important;
            font-size: 55px !important;
          }

          body * {
            visibility: hidden;
          }

          #printable-brochure, #printable-brochure * {
            visibility: visible;
          }

          #printable-brochure {
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
