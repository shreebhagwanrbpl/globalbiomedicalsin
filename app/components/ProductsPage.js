"use client";

import ProductsClient from "@/app/products/ProductsClient";

export default function Products({ city, district }) {
  return <ProductsClient city={city} district={district} />;
}