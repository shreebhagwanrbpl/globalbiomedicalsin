"use client";

import "./contact.css";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc
} from "firebase/firestore";

export default function Contact() {

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [contactInfo, setContactInfo] = useState([]);

  // 🔥 FETCH CONTACT INFO
  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(
          doc(db, "websites", "globalbiomedicals", "pages", "contact")
        );

        if (snap.exists()) {
          setContactInfo(snap.data().contactInfo || []);
        } else {
          setContactInfo([]);
        }
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    load();
  }, []);

  // ✅ FIXED CHANGE HANDLER
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 🔥 SUBMIT
  const handleSubmit = async () => {
    const { name, email, phone, message } = form;

    // validation
    if (!name || !email || !phone || !message) {
      return alert("Please fill all required fields");
    }

    try {
      await addDoc(
        collection(db, "websitesQueries", "globalbiomedicals", "contactQueries"),
        {
          ...form,
          createdAt: serverTimestamp()
        }
      );

      alert("Message Sent ✅");

      // reset
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });

    } catch (err) {
      console.error(err);
      alert("Error sending message");
    }
  };

  return (
    <div className="contact-page">

      {/* HERO */}
      <section className="contact-hero text-center">
        <div className="container">
          <h1 className="fw-bold display-4">
            Contact <span>Us</span>
          </h1>
          <p className="mt-3">
            Get in touch with us for medical solutions & support
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

                      <i className={
                        item.label.toLowerCase().includes("address")
                          ? "bi bi-geo-alt"
                          : item.label.toLowerCase().includes("email")
                          ? "bi bi-envelope"
                          : item.label.toLowerCase().includes("phone")
                          ? "bi bi-telephone"
                          : "bi bi-info-circle"
                      }></i>

                      <div>
                        <strong>{item.label}</strong>
                        <p>{item.value}</p>
                      </div>

                    </div>
                  ))
                )}

              </div>
            </div>

            {/* RIGHT FORM */}
            <div className="col-lg-7">

              <div className="contact-form">

                <div className="row g-3">

                  <div className="col-md-6">
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      className="input-field"
                      onChange={handleChange}
                      value={form.name}
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      className="input-field"
                      onChange={handleChange}
                      value={form.email}
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      type="text"
                      name="phone"
                      placeholder="Phone Number"
                      className="input-field"
                      onChange={handleChange}
                      value={form.phone}
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      type="text"
                      name="subject"
                      placeholder="Subject"
                      className="input-field"
                      onChange={handleChange}
                      value={form.subject}
                    />
                  </div>

                  <div className="col-12">
                    <textarea
                      name="message"
                      rows="4"
                      placeholder="Your Message"
                      onChange={handleChange}
                      value={form.message}
                    />
                  </div>

                  <div className="col-12">
                    <button
                      className="btn submit-btn w-100"
                      onClick={handleSubmit}
                    >
                      Send Message
                    </button>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="map-section">
        <div className="container-fluid p-0">
          <iframe
            src="https://maps.google.com/maps?q=Jaipur&t=&z=15&ie=UTF8&iwloc=&output=embed"
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