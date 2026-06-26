"use client";

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import "@/app/components/product.css";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";

export default function Products({ city }) {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [validCity, setValidCity] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const pathParts = pathname
    .split("/")
    .filter(Boolean);

  const reservedRoutes = [
    "products",
    "about",
    "contact",
    "services",
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
          w.charAt(0).toUpperCase() +
          w.slice(1)
      )
      .join(" ");

  const citySlug = currentCity
    ?.toLowerCase()
    ?.replace(/\s+/g, "-");

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

  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDoc(
        doc(
          db,
          "websites",
          "globalbiomedicalsin",
          "pages",
          "products"
        )
      );

      if (snap.exists()) {
        const data =
          snap.data().products || [];

        const visible =
          data.filter(
            (p) =>
              p.isPublished !== false
          );

        setProducts(visible);
      }
    };

    fetchData();
  }, []);

  const filtered = products.filter(
    (p) =>
      p.title
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
  );

  const totalPages =
    itemsPerPage === "all"
      ? 1
      : Math.ceil(
        filtered.length /
        itemsPerPage
      );

  const paginatedProducts =
    itemsPerPage === "all"
      ? filtered
      : filtered.slice(
        (currentPage - 1) *
        itemsPerPage,
        currentPage *
        itemsPerPage
      );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, itemsPerPage]);

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
          Our Products{" "}
          {validCity &&
            `in ${validCity}`}
        </h1>

        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="form-control mt-3"
          style={{
            maxWidth: 300,
            margin: "auto",
          }}
        />
      </div>

      {/* GRID */}
      <div className="container-fluid px-5 pb-5">
        <div className="product-grid">
          {paginatedProducts.length ===
            0 ? (
            <div className="text-center py-5">
              <div
                className="spinner-border text-success"
                role="status"
              />
            </div>
          ) : (
            paginatedProducts.map(
              (item, i) => (
                <div
                  className="product-item"
                  key={
                    item.id || i
                  }
                >
                  <div className="product-card">
                    <div className="img-box">
                      <img
                        src={
                          item.image ||
                          "/no-image.png"
                        }
                        className="product-img-top"
                        alt={
                          item.title
                        }
                      />
                    </div>

                    <div className="p-3">
                      <h5>
                        {item.title}
                      </h5>

                      <div className="product-info small text-muted">
                        <div>
                          <b>
                            Brand:
                          </b>{" "}
                          {item.brand ||
                            "-"}
                        </div>

                        <div>
                          <b>
                            Size:
                          </b>{" "}
                          {item.size ||
                            "-"}
                        </div>

                        <div>
                          <b>
                            Usage:
                          </b>{" "}
                          {item.usage ||
                            "-"}
                        </div>
                      </div>

                      <button
                        className="btn btn-success w-100"
                        onClick={() => {
                          const productSlug =
                            item.title
                              ?.toLowerCase()
                              .trim()
                              .replace(
                                /[^a-z0-9\s-]/g,
                                ""
                              )
                              .replace(
                                /\s+/g,
                                "-"
                              );

                          router.push(
                            citySlug
                              ? `/${citySlug}/products/${productSlug}`
                              : `/products/${productSlug}`
                          );
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              )
            )
          )}
        </div>

        {/* PAGINATION */}
        <div className="pagination-card">
          <div className="page-size">
            <span>Show:</span>

            <select
              value={
                itemsPerPage
              }
              onChange={(e) => {
                const value =
                  e.target.value ===
                    "all"
                    ? "all"
                    : Number(
                      e.target.value
                    );

                setItemsPerPage(
                  value
                );
              }}
            >
              <option value={10}>
                10
              </option>
              <option value={25}>
                25
              </option>
              <option value={50}>
                50
              </option>
              <option value={100}>
                100
              </option>
              <option value="all">
                All
              </option>
            </select>
          </div>

          {itemsPerPage !==
            "all" && (
              <div className="pagination">
                <button
                  disabled={
                    currentPage ===
                    1
                  }
                  onClick={() =>
                    setCurrentPage(
                      (p) => p - 1
                    )
                  }
                >
                  ◀
                </button>

                <span>
                  {currentPage} /{" "}
                  {totalPages}
                </span>

                <button
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (p) => p + 1
                    )
                  }
                >
                  ▶
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}