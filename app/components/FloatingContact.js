"use client";

import { useState } from "react";

export default function FloatingContact() {
  const [openMenu, setOpenMenu] = useState(false);

  const phoneNumbers = [
    { number: "9257984336", label: "Sales & Inquiry", formatted: "92579 84336" },
    { number: "8529833535", label: "Support & Orders", formatted: "85298 33535" },
    { number: "9983301657", label: "Customer Helpline", formatted: "99833 01657" },
  ];

  return (
    <>
      {/* FLOATING ACTION WRAPPER */}
      <div className="floating-action-wrapper no-print">
        
        {/* EXPANDED CONTACT MENU */}
        {openMenu && (
          <div className="contact-menu-card shadow-lg">
            <div className="menu-header bg-success text-white p-3 rounded-top d-flex justify-content-between align-items-center">
              <div>
                <h6 className="fw-bold mb-0">Global Biomedical LLP</h6>
                <small style={{ fontSize: "11px", opacity: 0.9 }}>Quick Contact & Helpline</small>
              </div>
              <button className="btn-close btn-close-white" onClick={() => setOpenMenu(false)}></button>
            </div>

            <div className="menu-body p-3">
              <p className="small text-muted mb-2">Click number to Call or Chat on WhatsApp:</p>

              <div className="d-flex flex-column gap-2">
                {phoneNumbers.map((item, index) => (
                  <div key={index} className="contact-item p-2 rounded border bg-light-subtle d-flex align-items-center justify-content-between">
                    <div>
                      <div className="fw-bold text-dark small">{item.formatted}</div>
                      <div className="text-secondary" style={{ fontSize: "11px" }}>{item.label}</div>
                    </div>
                    <div className="d-flex gap-1">
                      <a
                        href={`https://wa.me/91${item.number}?text=Hello%20Global%20Biomedical%20LLP,%20I%20have%20an%20inquiry.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-success p-1 px-2 text-white"
                        title="Chat on WhatsApp"
                      >
                        <i className="bi bi-whatsapp"></i>
                      </a>
                      <a
                        href={`tel:+91${item.number}`}
                        className="btn btn-sm btn-outline-success p-1 px-2"
                        title="Call Now"
                      >
                        <i className="bi bi-telephone-fill"></i>
                      </a>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* FLOATING ACTION BUTTONS */}
        <div className="d-flex flex-column gap-2 align-items-end">
          {/* MAIN CALL/WHATSAPP TOGGLE BUTTON */}
          <button
            suppressHydrationWarning
            className={`btn-floating btn-contact-main ${openMenu ? "active" : ""}`}
            onClick={() => setOpenMenu(!openMenu)}
            title="Call / WhatsApp Helpline"
          >
            <i className={openMenu ? "bi bi-x-lg" : "bi bi-whatsapp"}></i>
            <span className="pulse-ring"></span>
          </button>
        </div>

      </div>

      <style jsx>{`
        .floating-action-wrapper {
          position: fixed;
          bottom: 25px;
          right: 25px;
          z-index: 9999;
        }

        .contact-menu-card {
          width: 300px;
          background: #fff;
          border-radius: 12px;
          margin-bottom: 12px;
          overflow: hidden;
          animation: slideUp 0.3s ease;
        }

        .btn-floating {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 22px;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
          position: relative;
          transition: transform 0.3s ease, background 0.3s ease;
        }

        .btn-pdf-float {
          background: linear-gradient(135deg, #dc3545, #b02a37);
        }

        .btn-pdf-float:hover {
          transform: scale(1.1);
        }

        .btn-contact-main {
          background: linear-gradient(135deg, #25d366, #128c7e);
        }

        .btn-contact-main:hover {
          transform: scale(1.1);
        }

        .pulse-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 2px solid #25d366;
          animation: pulse 2s infinite;
        }

        .float-tooltip {
          position: absolute;
          right: 60px;
          background: #333;
          color: white;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .btn-floating:hover .float-tooltip {
          opacity: 1;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
