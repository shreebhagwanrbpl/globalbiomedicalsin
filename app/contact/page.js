"use client";

import toast, { Toaster } from "react-hot-toast";
import "./contact.css";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { fetchContactData, fetchDistrictData } from "@/lib/data-fetcher";
import { getSiteConfig } from "@/lib/site-config";

export default function Contact() {
  const [loading, setLoading] = useState(true);
  const [stateName, setStateName] = useState("");
  const [validCity, setValidCity] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [contactInfo, setContactInfo] = useState([]);

  // FETCH CONTACT INFO
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await fetchContactData();
        if (isMounted) {
          if (data && Array.isArray(data.contactInfo)) {
            setContactInfo(data.contactInfo);
          } else {
            setContactInfo([]);
          }
        }
      } catch (err) {
        console.error(err);
      }
      if (isMounted) setLoading(false);
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const pathname = usePathname();
  const pathParts = pathname.split("/").filter(Boolean);
  const reservedRoutes = [
    "about",
    "contact",
    "item",
    "items",
    "products",
    "services",
  ];

  const currentCity =
    pathParts[0] && !reservedRoutes.includes(pathParts[0]) ? pathParts[0] : "";

  const formatCity = (name = "") =>
    name
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  useEffect(() => {
    let isMounted = true;
    const checkCity = async () => {
      if (!currentCity) {
        if (isMounted) {
          setValidCity("");
          setStateName("");
        }
        return;
      }

      try {
        const snap = await fetchDistrictData(currentCity.toLowerCase());
        if (isMounted) {
          if (snap) {
            setValidCity(formatCity(currentCity));
            setStateName(snap?.state || "");
          } else {
            setValidCity("");
            setStateName("");
          }
        }
      } catch (err) {
        console.log(err);
        if (isMounted) {
          setValidCity("");
          setStateName("");
        }
      }
    };

    checkCity();
    return () => {
      isMounted = false;
    };
  }, [currentCity]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const { name, email, phone, message, subject } = form;

    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      return toast.error("Fill all fields");
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return toast.error("Please enter a valid 10 digit mobile number");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return toast.error("Please enter a valid email address");
    }

    try {
      const res = await fetch("/api/contact-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          subject: subject?.trim() || "",
          message: message.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && (data.success || data.ok)) {
        toast.success("Message sent successfully");
        setForm({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error(data.error || "Failed to send message");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="contact-page">
      <Toaster position="top-right" />

      {/* HERO */}
      <section className="contact-hero text-center py-5" style={{ background: "linear-gradient(135deg, #eefaf3, #f8fdfb)" }}>
        <div className="container py-4">
          <h1 className="fw-bold display-4 text-dark">
            Contact <span className="text-success">Global Biomedical LLP</span>
          </h1>
          <p className="mt-3 text-secondary lead">
            Get in touch with our expert team for medical & laboratory equipment inquiries
          </p>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="py-5">
        <div className="container">
          <div className="row g-5">
            {/* LEFT */}
            <div className="col-lg-5">
              <h4 className="fw-bold mb-3">Get In Touch</h4>

              <p className="text-muted">
                We are here to help you with all your diagnostic needs.
              </p>

              <div className="contact-info mt-4">
                {loading ? (
                  <p className="text-muted">Loading...</p>
                ) : contactInfo.length === 0 ? (
                  <p className="text-muted">No contact info added</p>
                ) : (
                  contactInfo.map((item, i) => (
                    <div className="info-box" key={i}>
                      <i
                        className={
                          item.label.toLowerCase().includes("address")
                            ? "bi bi-geo-alt"
                            : item.label.toLowerCase().includes("email")
                              ? "bi bi-envelope"
                              : item.label.toLowerCase().includes("phone")
                                ? "bi bi-telephone"
                                : "bi bi-info-circle"
                        }
                      ></i>

                      <div>
                        <strong>{item.label}</strong>
                        <p>
                          {item.label.toLowerCase().includes("address")
                            ? validCity && validCity.toLowerCase() !== "jaipur"
                              ? stateName
                                ? `${validCity}, ${stateName}, India`
                                : `${validCity}, India`
                              : item.value
                            : item.value}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* RIGHT CONTACT FORM */}
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
                <h4 className="fw-bold mb-4 text-dark">Send Us a Message</h4>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter full name"
                      className="form-control py-2.5 rounded-3"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter email address"
                      className="form-control py-2.5 rounded-3"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      maxLength={10}
                      placeholder="10 digit mobile number"
                      className="form-control py-2.5 rounded-3"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          phone: e.target.value.replace(/\D/g, ""),
                        })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      type="text"
                      name="subject"
                      className="input-field"
                      placeholder="Subject"
                      value={form.subject}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold text-secondary">Your Message</label>
                    <textarea
                      name="message"
                      rows="4"
                      className="form-control rounded-3"
                      placeholder="Write your requirement or questions here..."
                      value={form.message}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div className="col-12 mt-4">
                    <button
                      type="button"
                      className="btn btn-success w-100 py-3 rounded-3 fw-bold shadow-sm"
                      onClick={handleSubmit}
                    >
                      Submit Inquiry
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="map-section no-print">
        <div className="container-fluid p-0">
          <iframe
            src={`https://maps.google.com/maps?q=${validCity
              ? stateName
                ? `${validCity}, ${stateName}, India`
                : `${validCity}, India`
              : "Amrapali , Vaishali Nagar , Jaipur, India, 302021"
              }&output=embed`}
            width="100%"
            height="400"
            style={{ border: 0 }}
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </div>
  );
}