"use client";

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import "./product.css";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
export default function Products() {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [quoteModal, setQuoteModal] = useState(false);

const [form, setForm] = useState({
  name: "",
  email: "",
  phone: "",
  message: "" // 🔥 add
});

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // 🔥 FETCH
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

  // 🔍 FILTER
  const filtered = products.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  // 🔢 PAGINATION
  const totalPages =
    itemsPerPage === "all"
      ? 1
      : Math.ceil(filtered.length / itemsPerPage);

  const paginatedProducts =
    itemsPerPage === "all"
      ? filtered
      : filtered.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, itemsPerPage]);

  // FORM
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async () => {
  if (!form.email || !form.phone) {
    return alert("Please fill all details");
  }

  try {
    await addDoc(
      collection(db, "websitesQueries", "RbplWebThree", "productQueries"),
      {
        name: form.name,
        email: form.email,
        phone: form.phone,

        // 🔥 AUTO MESSAGE GENERATE
        message: `Enquiry for product: ${selectedProduct?.title || ""}`,

        productName: selectedProduct?.title || "",
        createdAt: serverTimestamp()
      }
    );

    alert("Quote Request Sent ✅");

    setForm({
      name: "",
      email: "",
      phone: ""
    });

    setQuoteModal(false);

  } catch (err) {
    console.error(err);
    alert("Error sending request");
  }
};
  return (
    <div className="products-page">

      {/* HEADER */}
      <div className="container-fluid px-5 py-5 text-center">
        <h1 className="fw-bold display-4">Our Products</h1>

        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-control mt-3"
          style={{ maxWidth: 300, margin: "auto" }}
        />
      </div>

      {/* GRID */}
      <div className="container-fluid px-5 pb-5">
        <div className="product-grid">

          {paginatedProducts.length === 0 ? (
            <p>No Products Found</p>
          ) : (
            paginatedProducts.map((item, i) => (
              <div className="product-item" key={item.id || i}>
                <div className="product-card">

                  <div className="img-box">
                    <img
                      src={item.image || "/no-image.png"}
                      className="product-img-top"
                    />
                  </div>

                  <div className="p-3">
                    <h5>{item.title}</h5>
<div className="product-info small text-muted">

  <div><b>Brand:</b> {item.brand || "-"}</div>
  <div><b>Size:</b> {item.size || "-"}</div>
  <div><b>Usage:</b> {item.usage || "-"}</div>

</div>

                    <button
                      className="btn btn-success w-100"
                      onClick={() => setSelectedProduct(item)}
                    >
                      View Details
                    </button>
                  </div>

                </div>
              </div>
            ))
          )}

        </div>

        {/* 🔥 PAGINATION + DROPDOWN */}
        <div className="pagination-card">

          <div className="page-size">
            <span>Show:</span>

            <select
              value={itemsPerPage}
              onChange={(e) => {
                const value =
                  e.target.value === "all"
                    ? "all"
                    : Number(e.target.value);

                setItemsPerPage(value);
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value="all">All</option>
            </select>
          </div>

          {itemsPerPage !== "all" && (
            <div className="pagination">

              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                ◀
              </button>

              <span>
                {currentPage} / {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                ▶
              </button>

            </div>
          )}

        </div>
      </div>

      {/* PRODUCT MODAL */}
      {selectedProduct && (
        <div className="custom-modal">
          <div className="modal-box">

            <span
              className="close"
              onClick={() => setSelectedProduct(null)}
            >
              ×
            </span>

            <div className="row">

              <div className="col-md-6">
                <img
                  src={selectedProduct.image || "/no-image.png"}
                  style={{ width: "100%" }}
                />
              </div>

<div className="col-md-6">

  <h3 className="fw-bold">{selectedProduct.title}</h3>
  <p className="text-muted">{selectedProduct.desc}</p>

  {/* 🔥 ALL DETAILS MERGED */}
  <div className="spec-box mt-3">

    <h6>Product Details</h6>

    <div className="spec-grid">

      {Object.entries(selectedProduct).map(([k, v]) => {
        if (
          ["title","desc","image","id","isPublished","createdAt"].includes(k)
        ) return null;

        return (
          <div key={k} className="spec-item">
            <span className="spec-key">
              {k.replace(/_/g, " ")}
            </span>
            <span className="spec-value">
              {v || "-"}
            </span>
          </div>
        );
      })}

    </div>
  </div>

  {/* 🔥 BUTTONS */}
  <div className="mt-4 d-flex gap-2">

    <button
      className="btn btn-success w-100"
      onClick={() => setQuoteModal(true)}
    >
      Get Quote
    </button>

    <Link href="/contact">
      <button className="btn btn-outline-dark w-100">
        Enquiry
      </button>
    </Link>

  </div>

</div>

            </div>

          </div>
        </div>
      )}

      {/* QUOTE MODAL */}
      {quoteModal && (
        <div className="quote-modal-overlay">
          <div className="quote-modal-box">

            <span
              className="close"
              onClick={() => setQuoteModal(false)}
            >
              ×
            </span>

            <h4 className="text-center">Get Quote</h4>

            <input
              name="name"
              placeholder="Name"
              onChange={handleChange}
            />

            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
            />

            <input
              name="phone"
              placeholder="Phone"
              onChange={handleChange}
            />

            <button
              className="btn btn-success mt-2"
              onClick={handleSubmit}
            >
              Submit
            </button>

          </div>
        </div>
      )}

    </div>
  );
}