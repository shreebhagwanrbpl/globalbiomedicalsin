"use client";
import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import "@/app/components/product.css";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { usePathname } from "next/navigation";
export default function Products({ city }) {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [quoteModal, setQuoteModal] = useState(false);
  const pathname = usePathname();
  const [validCity, setValidCity] = useState("");
// current city
const pathParts = pathname
  .split("/")
  .filter(Boolean);

const reservedRoutes = [
  "products",
  "about",
  "contact",
  "services"
];

const currentCity =
  pathParts[0] &&
  !reservedRoutes.includes(pathParts[0])
    ? pathParts[0]
    : null;

const formatCity = (name = "") =>
  name
    .split("-")
    .map(
      (w) =>
        w.charAt(0).toUpperCase() + w.slice(1)
    )
    .join(" ");

const citySlug = currentCity
  ?.toLowerCase()
  ?.replace(/\s+/g, "-");

const cityName = currentCity
  ? formatCity(currentCity)
  : "";
useEffect(() => {
  const checkCity = async () => {

    if (!currentCity) {
      setValidCity("");
      return;
    }

    try {
const snap = await getDoc(
  doc(
    db,
    "websites",
    "globalbiomedicalorg",
    "districts",
    currentCity.toLowerCase()
  )
);

if (snap.exists()) {

  setValidCity(
    formatCity(currentCity)
  );

} else {

  setValidCity("");

}

    } catch (err) {
      console.error(err);
      setValidCity("");
    }
  };

  checkCity();

}, [currentCity]);
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
        doc(db, "websites", "globalbiomedicalsin", "pages", "products")
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
      collection(db, "websitesQueries", "globalbiomedicalsin", "productQueries"),
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

   toast.success("Quote Request Sent ");

    setForm({
      name: "",
      email: "",
      phone: ""
    });

    setQuoteModal(false);

  } catch (err) {
    console.error(err);
    toast.error("Error sending request");
  }
};

useEffect(() => {

  const slug = window.location.pathname
    .split("/")
    .pop();

  if (!slug || slug === "products") return;

  const foundProduct = products.find((p) => {

    const productSlug = p.title
      ?.toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    return productSlug === slug;
  });

  if (foundProduct) {
    setSelectedProduct(foundProduct);
  }

}, [products]);


useEffect(() => {
  setCurrentPage(1);
}, [search, itemsPerPage]);


const generateKeywords = (
  productName = "",
  city = ""
) => {

  const base = productName.toLowerCase();

  const prefixes = [
    "best",
    "cheap",
    "affordable",
    "top",
    "near me",
    "online",
    "trusted",
    "fast",
    "certified"
  ];

  const suffixes = [
    "lab",
    "test",
    "diagnostic",
    "center",
    "price",
    "booking",
    "home collection",
    "report",
    "clinic"
  ];

  let keywords = new Set();

  // basic
  keywords.add(base);

  keywords.add(`${base} test`);
  keywords.add(`${base} lab`);
  keywords.add(`${base} near me`);

  // prefixes
  prefixes.forEach((p) => {
    keywords.add(`${p} ${base}`);
  });

  // suffixes
  suffixes.forEach((s) => {
    keywords.add(`${base} ${s}`);
  });

  // combine
  prefixes.forEach((p) => {
    suffixes.forEach((s) => {
      keywords.add(`${p} ${base} ${s}`);
    });
  });

  // dynamic city SEO
  if (city) {

    keywords.add(`${base} in ${city}`);

    keywords.add(
      `${base} test in ${city}`
    );

    keywords.add(
      `${base} lab in ${city}`
    );

    keywords.add(
      `best ${base} in ${city}`
    );

    keywords.add(
      `cheap ${base} in ${city}`
    );

    keywords.add(
      `${base} price in ${city}`
    );

  }

  return Array.from(keywords).slice(0, 35);
};

useEffect(() => {

  if (selectedProduct?.title) {

    const keywords = generateKeywords(
      selectedProduct.title,
      currentCity
    );

    // 🔥 CONSOLE ME DIKHANE KE LIYE
    console.log(
      "SEO KEYWORDS 👉",
      `(${keywords.length})`,
      keywords
    );

    // TITLE
    document.title = currentCity
      ? `${selectedProduct.title} in ${validCity}`
      : selectedProduct.title;

    // KEYWORDS META
    let metaKeywords = document.querySelector(
      'meta[name="keywords"]'
    );

    if (!metaKeywords) {

      metaKeywords =
        document.createElement("meta");

      metaKeywords.name = "keywords";

      document.head.appendChild(
        metaKeywords
      );
    }

    metaKeywords.content =
      keywords.join(", ");

    // DESCRIPTION
    let metaDescription =
      document.querySelector(
        'meta[name="description"]'
      );

    if (!metaDescription) {

      metaDescription =
        document.createElement("meta");

      metaDescription.name =
        "description";

      document.head.appendChild(
        metaDescription
      );
    }

    metaDescription.content =
      selectedProduct.desc ||
      `${selectedProduct.title} available ${
        currentCity
          ? `in ${validCity}`
          : "in India"
      }`;

  }

}, [selectedProduct, currentCity]);



  return (
    <div className="products-page">
      <Toaster
  position="top-right"
  containerStyle={{
    zIndex: 9999999, 
  }}
/>
      {/* HEADER */}
      <div className="container-fluid px-5 py-5 text-center">
       <h1 className="fw-bold display-4">
  Our Products {validCity && `in ${validCity}`}
</h1>

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
            <p>Loading....</p>
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
        onClick={() => {

        setSelectedProduct(item);

        const productSlug = item.title
            ?.toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-");

        const districtSlug = currentCity
            ?.toLowerCase()
            .replace(/\s+/g, "-");

        const url = districtSlug
            ? `/${districtSlug}/products`
            : `/products`;

        window.history.pushState({}, "", url);

        }}
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
           onClick={() => {

            setSelectedProduct(null);

            const districtSlug = currentCity
                ?.toLowerCase()
                .replace(/\s+/g, "-");

            const url = districtSlug
                ? `/${districtSlug}/products`
                : `/products`;

            window.history.pushState({}, "", url);

            }}
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

<Link
  href={
    citySlug
      ? `/${citySlug}/contact`
      : `/contact`
  }
>
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