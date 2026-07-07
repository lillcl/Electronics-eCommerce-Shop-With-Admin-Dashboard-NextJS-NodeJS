// *********************
// Role of the component: Showing products on the shop page with applied filter and sort
// Name of the component: Products.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Products params={params} searchParams={searchParams} />
// Input parameters: { params, searchParams }: { params: { slug?: string[] }, searchParams: { [key: string]: string | string[] | undefined } }
// Output: products grid
// *********************

import React from "react";
import ProductItem from "./ProductItem";
import { listProducts, toUiProduct, type ProductForUi } from "@/lib/data/products";

const Products = async ({ params, searchParams }: { params: { slug?: string[] }, searchParams: { [key: string]: string | string[] | undefined } }) => {
  const inStockChecked = searchParams?.inStock === "true";
  const outOfStockChecked = searchParams?.outOfStock === "true";
  const maxPrice = Number(searchParams?.price ?? 3000);
  const minRating = Number(searchParams?.rating ?? 0);
  const sort = typeof searchParams?.sort === "string" ? searchParams.sort : "defaultSort";
  const categorySlug = params?.slug?.[0];

  let products: ProductForUi[] = [];

  try {
    const rows = await listProducts();
    products = rows.map(toUiProduct);

    if (categorySlug) {
      const wanted = categorySlug.replace(/-/g, " ").toLowerCase();
      products = products.filter(
        (p) => (p.category?.name ?? "").toLowerCase() === wanted
      );
    }

    products = products.filter((p) => p.price <= maxPrice && p.rating >= minRating);

    // stock filter: only narrow when exactly one checkbox is active
    if (inStockChecked && !outOfStockChecked) {
      products = products.filter((p) => p.inStock > 0);
    } else if (outOfStockChecked && !inStockChecked) {
      products = products.filter((p) => p.inStock === 0);
    }

    switch (sort) {
      case "titleAsc":
        products.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "titleDesc":
        products.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "lowPrice":
        products.sort((a, b) => a.price - b.price);
        break;
      case "highPrice":
        products.sort((a, b) => b.price - a.price);
        break;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    products = [];
  }

  return (
    <div className="grid grid-cols-3 justify-items-center gap-x-2 gap-y-5 max-[1300px]:grid-cols-3 max-lg:grid-cols-2 max-[500px]:grid-cols-1">
      {products.length > 0 ? (
        products.map((product: any) => (
          <ProductItem key={product.id} product={product} color="black" />
        ))
      ) : (
        <h3 className="text-3xl mt-5 text-center w-full col-span-full max-[1000px]:text-2xl max-[500px]:text-lg">
          No products found for specified query
        </h3>
      )}
    </div>
  );
};

export default Products;
