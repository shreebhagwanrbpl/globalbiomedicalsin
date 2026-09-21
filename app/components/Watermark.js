"use client";

export default function Watermark() {
  return (
    <div className="global-watermark-container" aria-hidden="true">
      <div className="watermark-pattern">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="watermark-item">
            <span className="watermark-main">GLOBAL BIOMEDICAL LLP</span>
            <span className="watermark-sub">DIAGNOSTIC & MEDICAL EQUIPMENT</span>
          </div>
        ))}
      </div>
      <style jsx>{`
        .global-watermark-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
          opacity: 0.035;
          user-select: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .watermark-pattern {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 120px 80px;
          transform: rotate(-25deg) scale(1.15);
          width: 140vw;
          height: 140vh;
        }

        .watermark-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .watermark-main {
          font-size: 28px;
          font-weight: 900;
          letter-spacing: 3px;
          color: #000;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .watermark-sub {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 4px;
          color: #0f5132;
          text-transform: uppercase;
          margin-top: 4px;
          white-space: nowrap;
        }

        @media print {
          .global-watermark-container {
            opacity: 0.08 !important;
          }
        }
      `}</style>
    </div>
  );
}
