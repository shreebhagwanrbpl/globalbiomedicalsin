import ProductPage, { generateMetadata as baseGenerateMetadata } from "@/app/products/[slug]/page";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export const generateMetadata = baseGenerateMetadata;
export default ProductPage;
