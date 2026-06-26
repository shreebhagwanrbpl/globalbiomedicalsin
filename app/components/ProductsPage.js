"use client";

import { useState, useEffect, useMemo } from "react";
import {
  doc,
  getDoc,
  getDocs,
  collection
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import "@/app/components/product.css";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import {
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";

export default function Products({ city }) {

  const router = useRouter();

  const pathname = usePathname();
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [search, setSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [products, setProducts] = useState([]);

  const [validCity, setValidCity] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(25);

  const [openedCategory, setOpenedCategory] = useState("");

  const [activeCategory, setActiveCategory] = useState("");
  const [allCategories, setAllCategories] = useState([]);


  /* -----------------------------
      CITY
  ------------------------------ */

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



  /* -----------------------------
      VALID CITY
  ------------------------------ */

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

        }

      } catch (err) {

        console.log(err);

      }

    };

    checkCity();

  }, [currentCity]);






  /* -----------------------------
      FETCH PRODUCTS
  ------------------------------ */

  useEffect(() => {

    const fetchProducts = async () => {

      try {

        // Category Products
        const categorySnap = await getDocs(
          collection(
            db,
            "websites",
            "globalbiomedicalsin",
            "pages",
            "categoryproducts",
            "categories"
          )
        );

        const allProducts = [];
        const categoryList = [];

        categorySnap.forEach((categoryDoc) => {

          const data = categoryDoc.data();

          categoryList.push({
            id: categoryDoc.id,
            category:
              data.category ||
              categoryDoc.id
          });

          const products =
            (data.products || [])
              .filter(
                (p) =>
                  p.isPublished !== false
              )
              .map((item, index) => ({

                ...item,

                slug:
                  item.slug ||
                  item.title
                    ?.toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9\s-]/g, "")
                    .replace(/\s+/g, "-"),

                uid: `${categoryDoc.id}-${index}`,

                category:
                  data.category ||
                  categoryDoc.id,

              }));

          allProducts.push(...products);

        });

        // OLD PRODUCTS COLLECTION
        const productSnap = await getDoc(
          doc(
            db,
            "websites",
            "globalbiomedicalsin",
            "pages",
            "products"
          )
        );

        if (productSnap.exists()) {

          const oldProducts =
            (productSnap.data().products || [])
              .filter(
                (p) =>
                  p.isPublished !== false
              )
              .map((item, index) => ({

                ...item,

                slug:
                  item.slug ||
                  item.title
                    ?.toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9\s-]/g, "")
                    .replace(/\s+/g, "-"),

                uid: `other-${index}`,

                category:
                  item.category ||
                  "Other Products",

              }));

          allProducts.push(...oldProducts);

        }

        setProducts(allProducts);

        setAllCategories([
          ...categoryList,
          {
            id: "other-products",
            category: "Other Products"
          }
        ]);

      } catch (err) {

        console.log(err);

      }

    };

    fetchProducts();

  }, []);




  /* -----------------------------
      SEARCH
  ------------------------------ */

  const filteredProducts =
    useMemo(() => {

      return products.filter((item) =>

        item.title

          ?.toLowerCase()

          .includes(

            search.toLowerCase()

          )

      );

    }, [

      products,

      search

    ]);



  /* -----------------------------
      GROUP
  ------------------------------ */

  const groupedProducts =
    useMemo(() => {

      const obj = {};

      filteredProducts.forEach((item) => {

        if (!obj[item.category]) {

          obj[item.category] = [];

        }

        obj[item.category].push(item);

      });

      return obj;

    }, [

      filteredProducts

    ]);



  const categories =
    Object.keys(groupedProducts);



  // useEffect(() => {

  //   if (

  //     categories.length &&

  //     !openedCategory

  //   ) {

  //     setOpenedCategory(

  //       categories[0]

  //     );

  //     setActiveCategory(

  //       categories[0]

  //     );

  //   }

  // }, [categories]);





  const toggleCategory = (category) => {

    if (openedCategory === category) {

      setOpenedCategory("");

      setActiveCategory("");

      return;

    }

    setOpenedCategory(category);

    setActiveCategory(category);

  };



  const scrollToCategory = (

    category

  ) => {

    setOpenedCategory(category);

    setActiveCategory(category);

    const section =

      document.getElementById(

        category

          .replace(/\s+/g, "-")

          .toLowerCase()

      );

    if (section) {

      section.scrollIntoView({

        behavior: "smooth",

        block: "start",

      });

    }

  };

  /* -----------------------------
    PAGINATION
------------------------------ */

  const totalPages =
    itemsPerPage === "all"
      ? 1
      : Math.ceil(
        filteredProducts.length /
        itemsPerPage
      );

  const paginatedProducts =
    itemsPerPage === "all"
      ? filteredProducts
      : filteredProducts.slice(
        (currentPage - 1) *
        itemsPerPage,
        currentPage *
        itemsPerPage
      );

  const paginatedGroupedProducts =
    useMemo(() => {

      const obj = {};

      paginatedProducts.forEach((item) => {

        if (!obj[item.category]) {

          obj[item.category] = [];

        }

        obj[item.category].push(item);

      });

      return obj;

    }, [paginatedProducts]);



  useEffect(() => {

    setCurrentPage(1);

  }, [

    search,

    itemsPerPage

  ]);



  /* -----------------------------
      SCROLL SPY
  ------------------------------ */

  useEffect(() => {

    const handleScroll = () => {

      let current = "";

      categories.forEach((category) => {

        const section =
          document.getElementById(

            category
              .replace(/\s+/g, "-")
              .toLowerCase()

          );

        if (!section) return;

        const top =
          section.getBoundingClientRect().top;

        if (top <= 180) {

          current = category;

        }

      });

      if (

        current &&

        current !== activeCategory

      ) {

        setActiveCategory(current);

      }

    };

    window.addEventListener(

      "scroll",

      handleScroll

    );

    return () =>

      window.removeEventListener(

        "scroll",

        handleScroll

      );

  }, [

    categories,

    activeCategory

  ]);

  useEffect(() => {

    const handleScroll = () => {

      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }

    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );

  }, []);

  /* -----------------------------
      VIEW DETAILS
  ------------------------------ */

  const viewDetails = (item) => {

    router.push(

      citySlug

        ? `/${citySlug}/products/${item.slug}`

        : `/products/${item.slug}`

    );

  };



  /* -----------------------------
      RESET
  ------------------------------ */

  const resetSearch = () => {

    setSearch("");

    setCurrentPage(1);

  };

  const scrollToProduct = (slug, category) => {

    setOpenedCategory(category);
    setActiveCategory(category);

    const el = document.getElementById(slug);

    if (el) {

      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

    }

  };
  const scrollToTop = () => {

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };
  return (

    <>

      <Toaster
        position="top-right"
      />

      <section className="product-banner">

        <div className="container">

          <h1>

            Our Products

            {

              validCity &&

              ` in ${validCity}`

            }

          </h1>

          <p>

            Trusted Laboratory &
            Diagnostic Products

          </p>

        </div>

      </section>



      <section className="product-page">

        <div className="container-fluid">

          <div className="row">

            {/* =====================
                  SIDEBAR
            ====================== */}

            <div className="col-lg-3">

              <div className="category-sidebar">

                <div className="sidebar-title">

                  Categories

                </div>

                <div className="sidebar-search">

                  <input

                    type="text"

                    placeholder="Search Category..."

                    value={categorySearch}

                    onChange={(e) =>

                      setCategorySearch(
                        e.target.value
                      )

                    }

                  />

                </div>

                <div className="category-list">

                  {

                    Object.keys(
                      groupedProducts
                    )
                      .filter((category) =>

                        category
                          .toLowerCase()
                          .includes(
                            categorySearch.toLowerCase()
                          )

                      )
                      .map((category) => (

                        <div

                          key={category}

                          className="category-item"

                        >

                          <button

                            className={`category-btn

                          ${activeCategory === category

                                ? "active"

                                : ""}

                          `}

                            onClick={() =>

                              toggleCategory(

                                category

                              )

                            }

                          >

                            <span>

                              {

                                openedCategory === category

                                  ?

                                  <FiChevronDown />

                                  :

                                  <FiChevronRight />

                              }

                              {category}

                            </span>

                            <span className="count">

                              {

                                groupedProducts[category].length

                              }

                            </span>

                          </button>

                          <div
                            className="category-content"
                            style={{
                              maxHeight:
                                openedCategory === category
                                  ? groupedProducts[category].length * 45 + "px"
                                  : "0px"
                            }}
                          >

                            {

                              groupedProducts[category]

                                .map((item, index) => (

                                  <button

                                    // key={`${item.slug}-${index}`}
                                    key={item.uid}

                                    className="product-link"

                                    onClick={() =>
                                      scrollToProduct(item.slug, category)
                                    }

                                  >

                                    {item.title}

                                  </button>

                                ))

                            }

                          </div>

                        </div>

                      ))

                  }

                </div>

              </div>

            </div>

            {/* =====================
                 RIGHT START
            ====================== */}

            <div className="col-lg-9">

              <div className="filter-card">

                <div className="row">

                  <div className="col-lg-10">

                    <input

                      type="text"

                      className="form-control"

                      placeholder="Search Product..."

                      value={search}

                      onChange={(e) =>

                        setSearch(

                          e.target.value

                        )

                      }

                    />

                  </div>

                  <div className="col-lg-2">

                    <button

                      className="btn-reset"

                      onClick={resetSearch}

                    >

                      Reset

                    </button>

                  </div>

                </div>

              </div>

              {

                Object.entries(

                  paginatedGroupedProducts

                ).map(

                  ([category, list]) => (

                    <div

                      key={category}

                      id={category

                        .replace(/\s+/g, "-")

                        .toLowerCase()}

                      className="product-section"

                    >

                      <div className="section-titlee">

                        <h3>

                          {category}

                        </h3>

                        <span>

                          {

                            groupedProducts[category]

                              ?.length || 0

                          }

                          {" "}Products

                        </span>

                      </div>

                      {

                        list.map(

                          (item, index) => (

                            <div

                              key={`${item.slug}-${index}`}

                              id={item.slug}

                              className="product-list-card"

                            >

                              <div className="row align-items-center">

                                {/* IMAGE */}

                                <div className="col-lg-3 col-md-4">

                                  <div className="list-image">

                                    <img

                                      src={

                                        item.image ||

                                        "/no-image.png"

                                      }

                                      alt={item.title}

                                    />

                                  </div>

                                </div>

                                {/* DETAILS */}

                                <div className="col-lg-6 col-md-5">

                                  <div className="list-content">

                                    <h4>

                                      {item.title}

                                    </h4>

                                    <p>

                                      {

                                        item.description ||

                                        item.desc ||

                                        "No description available."

                                      }

                                    </p>

                                    <div className="spec-grid">

                                      <div>

                                        <b>Brand</b>

                                        <span>

                                          {

                                            item.brand ||

                                            "-"

                                          }

                                        </span>

                                      </div>

                                      <div>

                                        <b>Usage</b>

                                        <span>

                                          {

                                            item.usage ||

                                            "-"

                                          }

                                        </span>

                                      </div>

                                      <div>

                                        <b>Size</b>

                                        <span>

                                          {

                                            item.size ||

                                            "-"

                                          }

                                        </span>

                                      </div>

                                      <div>

                                        <b>Model</b>

                                        <span>

                                          {

                                            item.model ||

                                            "-"

                                          }

                                        </span>

                                      </div>

                                    </div>

                                  </div>

                                </div>

                                {/* BUTTONS */}

                                <div className="col-lg-3 col-md-3">

                                  <div className="product-action">

                                    <button

                                      className="btn-view"

                                      onClick={() =>

                                        viewDetails(item)

                                      }

                                    >

                                      View Details

                                    </button>

                                    {/* <button

                                      className="btn-enquiry"

                                    >

                                      Get Quote

                                    </button> */}

                                  </div>

                                </div>

                              </div>

                            </div>

                          )

                        )

                      }

                    </div>

                  )

                )

              }

              {/* PAGINATION START */}

              {/* PAGINATION */}

              <div className="pagination-card">

                <div className="page-left">

                  <span>

                    Show

                  </span>

                  <select

                    className="custom-select"

                    value={itemsPerPage}

                    onChange={(e) => {

                      const value =

                        e.target.value === "all"

                          ? "all"

                          : Number(e.target.value);

                      setItemsPerPage(value);

                      setCurrentPage(1);

                    }}

                  >

                    <option value={10}>10</option>

                    <option value={25}>25</option>

                    <option value={50}>50</option>

                    <option value={100}>100</option>

                    <option value="all">

                      All

                    </option>

                  </select>

                </div>

                {

                  itemsPerPage !== "all" && (

                    <div className="page-right">

                      <button

                        className="btn"

                        disabled={

                          currentPage === 1

                        }

                        onClick={() =>

                          setCurrentPage(

                            (p) => p - 1

                          )

                        }

                      >

                        ◀

                      </button>

                      <button

                        className="btn btn-primary"

                      >

                        {

                          currentPage

                        }

                      </button>

                      <button

                        className="btn"

                        disabled={

                          currentPage === totalPages

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

                  )

                }

              </div>

            </div>

          </div>

        </div>

      </section>
      {showTopBtn && (

        <button
          className="back-to-top-btn"
          onClick={scrollToTop}
        >
          ↑
        </button>

      )}
    </>

  );

}