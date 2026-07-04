"use client";

import { useEffect, useState, useRef } from "react";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast, { Toaster } from "react-hot-toast";
import "@/app/globals.css";
import "./page.css"
import { FaPlay, FaShareAlt, FaWhatsapp, FaFacebook, FaInstagram, FaLink } from "react-icons/fa";

import { useParams, usePathname } from "next/navigation";
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

    const district =
        pathParts[0] &&
            !reservedRoutes.includes(pathParts[0])
            ? pathParts[0]
            : "india";

    const city =
        district.charAt(0).toUpperCase() +
        district.slice(1);
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
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link Copied");
        setShowShare(false);
    };


    const handleWhatsapp = () => {

        const shareText = `🔬 ${product?.title}

${product?.desc}

🌐 ${window.location.href}`;

        window.open(
            `https://wa.me/?text=${encodeURIComponent(shareText)}`,
            "_blank"
        );
    };

    const handleFacebook = () => {
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
            "_blank"
        );
    };

    const handleInstagram = async () => {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Instagram direct sharing available nahi hai. Link copy ho gaya.");
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: product.title,
                text: product.desc,
                url: window.location.href,
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
                    <div className="seo-content mt-5">

                        <h2>
                            {product.title} in {city}
                        </h2>

                        <p>
                            Looking for a reliable {product.title} in {city}? We are a trusted
                            manufacturer, supplier, exporter and service provider of premium quality
                            {product.title} for hospitals, pathology laboratories, diagnostic centers,
                            research institutes and healthcare facilities. Our advanced laboratory
                            equipment is designed to deliver accurate results, reliable performance,
                            user-friendly operation and long-term durability. With years of experience
                            in the biomedical industry, we provide complete installation, training,
                            maintenance and after-sales support across {city}.
                        </p>

                        <h3>
                            Why Choose Our {product.title} in {city}
                        </h3>

                        <p>
                            Our {product.title} is widely preferred by laboratories and healthcare
                            professionals due to its high accuracy, robust construction, advanced
                            technology and dependable performance. We understand the importance of
                            reliable diagnostic equipment, which is why we offer quality-tested
                            laboratory instruments that meet modern healthcare requirements. Whether
                            you need equipment for a small diagnostic center or a large hospital,
                            we provide the right solution at competitive prices in {city}.
                        </p>

                        <h3>
                            Leading {product.title} Manufacturer in {city}
                        </h3>

                        <p>
                            As a trusted {product.title} manufacturer in {city}, we focus on quality,
                            innovation and customer satisfaction. Our products are manufactured using
                            advanced technology and premium-grade components to ensure accurate testing,
                            efficient workflow and long operational life. We continuously upgrade our
                            products to meet the evolving needs of laboratories and healthcare
                            professionals.
                        </p>

                        <h3>
                            Trusted {product.title} Supplier in {city}
                        </h3>

                        <p>
                            We are among the most trusted {product.title} suppliers in {city},
                            providing genuine products, competitive pricing and timely delivery.
                            Our experienced team helps customers choose the most suitable laboratory
                            equipment based on their requirements and budget. From product selection
                            to installation and support, we ensure a smooth and hassle-free experience.
                        </p>

                        <h3>
                            Reliable {product.title} Exporter in {city}
                        </h3>

                        <p>
                            We are also recognized as a reliable {product.title} exporter in {city},
                            serving hospitals, laboratories and healthcare organizations across India
                            and international markets. Our strong logistics network enables us to
                            deliver products safely and efficiently while maintaining the highest
                            quality standards.
                        </p>

                        <h3>
                            Applications of {product.title}
                        </h3>

                        <p>
                            {product.title} is extensively used in pathology laboratories, hospitals,
                            blood testing centers, research facilities, medical colleges and diagnostic
                            institutions. It helps healthcare professionals perform accurate testing,
                            improve laboratory efficiency and maintain consistent diagnostic results.
                        </p>

                        <h3>
                            Installation, Training & After-Sales Support in {city}
                        </h3>

                        <p>
                            Our commitment does not end after product delivery. We provide complete
                            installation, operator training, maintenance guidance and technical support
                            for every {product.title} supplied in {city}. Our dedicated service team
                            ensures that your equipment operates smoothly and efficiently for years.
                        </p>

                        <h3>
                            Buy {product.title} at Best Price in {city}
                        </h3>

                        <p>
                            If you are searching for the best {product.title} price in {city},
                            contact our team today. We offer high-quality laboratory equipment,
                            expert consultation, prompt delivery and dependable customer support.
                            Submit your enquiry now to receive detailed specifications, pricing and
                            product recommendations.
                        </p>

                    </div>
                </div>

            </div>
        </>
    );
}