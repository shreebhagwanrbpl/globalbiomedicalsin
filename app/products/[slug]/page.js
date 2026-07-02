"use client";

import { useEffect, useState, useRef  } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast, { Toaster } from "react-hot-toast";
import "@/app/globals.css";
import "./page.css"
import { FaPlay, FaShareAlt, FaWhatsapp, FaFacebook, FaInstagram, FaLink } from "react-icons/fa";


export default function ProductDetailPage() {
    const shareRef = useRef();
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [selectedMedia, setSelectedMedia] = useState("image");
    const [showShare, setShowShare] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {

                const snap = await getDoc(
                    doc(
                        db,
                        "websites",
                        "globalbiomedicalsin",
                        "pages",
                        "products"
                    )
                );

                if (!snap.exists()) {
                    console.log("Products document not found");
                    return;
                }

                const products = snap.data().products || [];

                console.log("URL SLUG =", slug);

                console.log(
                    "ALL PRODUCTS =",
                    products.map((p) => ({
                        title: p.title,
                        slug: p.slug,
                        images: p.images,
                        image: p.image,
                    }))
                );

                const foundProduct = products.find((p) => {
                    const generatedSlug = p.title
                        ?.toLowerCase()
                        .trim()
                        .replace(/[^a-z0-9\s-]/g, "")
                        .replace(/\s+/g, "-");

                    return generatedSlug === slug;
                });

                console.log("FOUND PRODUCT =", foundProduct);

                if (!foundProduct) {
                    console.log("PRODUCT NOT FOUND");
                    setProduct(null);
                    return;
                }

                setProduct(foundProduct);

                if (foundProduct.images?.length > 0) {
                    setSelectedImage(foundProduct.images[0]);
                    setSelectedMedia("image");
                }

            } catch (err) {
                console.error("FETCH PRODUCT ERROR:", err);
            }
        };

        fetchProduct();
    }, [slug]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async () => {
        const { name, email, phone } = form;

        if (!name || !email || !phone) {
            return toast.error("Fill all fields");
        }

        const phoneRegex = /^[6-9]\d{9}$/;

        if (!phoneRegex.test(phone)) {
            return toast.error(
                "Please enter a valid 10 digit mobile number"
            );
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return toast.error(
                "Please enter a valid email address"
            );
        }

        try {
            await addDoc(
                collection(
                    db,
                    "websitesQueries",
                    "globalbiomedicalsin",
                    "productQueries"
                ),
                {
                    ...form,
                    productName: product?.title || "",
                    createdAt: serverTimestamp(),
                }
            );

            toast.success("Quote Request Sent");

            setForm({
                name: "",
                email: "",
                phone: "",
            });

        } catch (err) {
            console.error(err);
            toast.error("Failed to send");
        }
    };

//     const shareText = `🔬 ${product?.title}

// ${product?.desc}

// 🌐 ${window.location.href}`;

const handleCopy = async () => {

  const shareSlug =
    product?.slug ||
    window.location.pathname.split("/").pop();

  const shareUrl =
    `${window.location.origin}/share/${shareSlug}`;

  await navigator.clipboard.writeText(shareUrl);

  toast.success("Link Copied");

  setShowShare(false);
};


// const handleWhatsapp = () => {

//   const shareText = `🔬 ${product?.title}

// ${product?.desc}

// 🌐 ${window.location.href}`;

//   window.open(
//     `https://wa.me/?text=${encodeURIComponent(shareText)}`,
//     "_blank"
//   );
// };


const handleWhatsapp = () => {

  const shareSlug =
    product?.slug ||
    window.location.pathname.split("/").pop();

  const shareUrl =
    `${window.location.origin}/share/${shareSlug}`;

  window.open(
    `https://wa.me/?text=${encodeURIComponent(shareUrl)}`,
    "_blank"
  );
};

// const handleFacebook = () => {
//   window.open(
//     `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
//     "_blank"
//   );
// };

const handleFacebook = () => {

  const shareSlug =
    product?.slug ||
    window.location.pathname.split("/").pop();

  const shareUrl =
    `${window.location.origin}/share/${shareSlug}`;

  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    "_blank"
  );
};

const handleInstagram = async () => {
  await navigator.clipboard.writeText(window.location.href);
  toast.success("Instagram direct sharing available nahi hai. Link copy ho gaya.");
};

// const handleNativeShare = async () => {
//   if (navigator.share) {
//     await navigator.share({
//       title: product.title,
//       text: product.desc,
//       url: window.location.href,
//     });
//   } else {
//     setShowShare(!showShare);
//   }
// };

const handleNativeShare = async () => {

  const shareSlug =
    product?.slug ||
    window.location.pathname.split("/").pop();

  const shareUrl =
    `${window.location.origin}/share/${shareSlug}`;

  if (navigator.share) {

    await navigator.share({
      title: product.title,
      text: product.desc,
      url: shareUrl,
    });

  } else {

    setShowShare(!showShare);

  }
};


    useEffect(() => {
    function close(e) {
        if (
            shareRef.current &&
            !shareRef.current.contains(e.target)
        ) {
            setShowShare(false);
        }
    }

    document.addEventListener("mousedown", close);

    return () =>
        document.removeEventListener("mousedown", close);
}, []);

    if (!product) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "grid",
                    placeItems: "center",
                    fontSize: "20px",
                    fontWeight: "600",
                }}
            >
                Loading Product...
            </div>
        );
    }
    





    return (
        <>
            <Toaster position="top-right" />

            <div className="container py-5 mt-5">

                <div className="row g-5">

                    {/* LEFT SIDE */}
                    <div className="col-lg-5">

                        <div className="product-main-image">

                            {selectedMedia === "video" && product.video ? (

                                <video
                                    key={product.video}
                                    controls
                                    autoPlay
                                    className="main-product-image"
                                >
                                    <source
                                        src={product.video}
                                        type="video/mp4"
                                    />
                                </video>

                            ) : (

                                <img
                                    src={
                                        selectedImage ||
                                        "/no-image.png"
                                    }
                                    alt={product.title}
                                    className="main-product-image"
                                />

                            )}

                        </div>

                        <div
                            className="d-flex gap-3 mt-3 flex-wrap"
                        >

                            {product.images?.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`product-${index}`}
                                    onClick={() => {
                                        setSelectedImage(img);
                                        setSelectedMedia("image");
                                    }}
                                    style={{
                                        width: "90px",
                                        height: "90px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        border:
                                            selectedMedia === "image" &&
                                                selectedImage === img
                                                ? "2px solid #198754"
                                                : "2px solid transparent",
                                    }}
                                />
                            ))}

                            {product.video && (
                                <div
                                    className="video-thumb"
                                    onClick={() => {
                                        setSelectedMedia("video");
                                    }}
                                    style={{
                                        cursor: "pointer",
                                        border:
                                            selectedMedia === "video"
                                                ? "2px solid #198754"
                                                : "2px solid transparent",
                                    }}
                                >
                                    <FaPlay size={24} />
                                    <span>Video</span>
                                </div>
                            )}

                            {product.pdf && (
                                <a
                                    href={product.pdf}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="media-thumb"
                                >
                                    📄
                                    <small>PDF</small>
                                </a>
                            )}

                        </div>

                    </div>

                    {/* RIGHT SIDE */}
                    <div className="col-lg-7">
<div className="d-flex justify-content-between align-items-start position-relative">

    <h1 className="fw-bold mb-3">
        {product.title}
    </h1>

   <div
    ref={shareRef}
    style={{ position: "relative" }}
>

        <button
            className="btn btn-light border rounded-circle"
            onClick={handleNativeShare}
        >
            <FaShareAlt />
        </button>

        {showShare && (

            <div
                className="shadow bg-white rounded p-2"
                style={{
                    position: "absolute",
                    right: 0,
                    top: "55px",
                    width: "220px",
                    zIndex: 1000,
                }}
            >

                <button
                    className="dropdown-item"
                    onClick={handleCopy}
                >
                    <FaLink className="me-2" />
                    Copy Link
                </button>

                <button
                    className="dropdown-item"
                    onClick={handleWhatsapp}
                >
                    <FaWhatsapp className="me-2 text-success" />
                    WhatsApp
                </button>

                <button
                    className="dropdown-item"
                    onClick={handleFacebook}
                >
                    <FaFacebook className="me-2 text-primary" />
                    Facebook
                </button>

                <button
                    className="dropdown-item"
                    onClick={handleInstagram}
                >
                    <FaInstagram className="me-2 text-danger" />
                    Instagram
                </button>

            </div>

        )}

    </div>

</div>

                        <p className="text-muted">
                            {product.desc}
                        </p>

                        <div className="mt-4">

                            {Object.entries(product).map(([k, v]) => {

                                if (
                                    [
                                        "title",
                                        "desc",
                                        "image",
                                        "images",
                                        "video",
                                        "pdf",
                                        "id",
                                        "createdAt",
                                        "isPublished",
                                    ].includes(k)
                                ) {
                                    return null;
                                }

                                return (
                                    <div
                                        key={k}
                                        className="d-flex border-bottom py-2"
                                    >
                                        <strong
                                            style={{
                                                minWidth: "180px",
                                                textTransform: "capitalize",
                                            }}
                                        >
                                            {k.replace(/_/g, " ")}
                                        </strong>

                                        <span>
                                            {v || "-"}
                                        </span>

                                    </div>
                                );
                            })}

                        </div>

                        <div className="card mt-4 p-4 shadow-sm">

                            <h4 className="mb-3">
                                Get Quote
                            </h4>

                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                className="form-control mb-3"
                                value={form.name}
                                onChange={handleChange}
                            />

                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                className="form-control mb-3"
                                value={form.email}
                                onChange={handleChange}
                            />

                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone Number"
                                className="form-control mb-3"
                                value={form.phone}
                                maxLength={10}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        phone: e.target.value.replace(/\D/g, ""),
                                    })
                                }
                            />

                            <button
                                className="btn btn-success"
                                onClick={handleSubmit}
                            >
                                Submit Quote Request
                            </button>

                        </div>

                    </div>

                </div>

            </div>
        </>
    );
}