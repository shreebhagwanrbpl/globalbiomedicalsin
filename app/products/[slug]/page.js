"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast, { Toaster } from "react-hot-toast";

export default function ProductDetailPage() {
    const { slug } = useParams();

    const [product, setProduct] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
    });

    useEffect(() => {
        const fetchProduct = async () => {
            const snap = await getDoc(
                doc(
                    db,
                    "websites",
                    "globalbiomedicalsin",
                    "pages",
                    "products"
                )
            );

            if (!snap.exists()) return;

            const products = snap.data().products || [];

            const found = products.find((p) => {
                const productSlug = p.title
                    ?.toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9\s-]/g, "")
                    .replace(/\s+/g, "-");

                return productSlug === slug;
            });

            setProduct(found);
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

                    <div className="col-lg-5 d-flex align-items-center">

                        <div className="border rounded p-3 bg-white shadow-sm w-100">

                            <img
                                src={product.image || "/no-image.png"}
                                alt={product.title}
                                className="img-fluid w-100"
                            />

                        </div>

                    </div>

                    <div className="col-lg-7">

                        <h1 className="fw-bold mb-3">
                            {product.title}
                        </h1>

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