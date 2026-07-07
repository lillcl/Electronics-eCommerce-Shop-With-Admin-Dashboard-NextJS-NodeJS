"use client";

import React, { useState } from "react";
import { formatCategoryName } from "@/utils/categoryFormating";
import { sanitize, sanitizeHtml } from "@/lib/sanitize";

const ProductTabs = ({ product }: { product: Product }) => {
  const [currentProductTab, setCurrentProductTab] = useState<number>(0);

  return (
    <div className="px-5 text-black">
      <div role="tablist" className="tabs tabs-bordered">
        <a
          role="tab"
          className={`tab text-lg text-black pb-8 max-[500px]:text-base max-[400px]:text-sm max-[370px]:text-xs ${
            currentProductTab === 0 && "tab-active"
          }`}
          onClick={() => setCurrentProductTab(0)}
        >
          Description
        </a>
        <a
          role="tab"
          className={`tab text-black text-lg pb-8 max-[500px]:text-base max-[400px]:text-sm max-[370px]:text-xs ${
            currentProductTab === 1 && "tab-active"
          }`}
          onClick={() => setCurrentProductTab(1)}
        >
          Additional info
        </a>
      </div>
      <div className="pt-5">
        {currentProductTab === 0 && (
          <div
            className="text-lg max-sm:text-base max-sm:text-sm"
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(product?.description),
            }}
          />
        )}

        {currentProductTab === 1 && (
          <div className="overflow-x-auto">
            <table className="table text-xl text-center max-[500px]:text-base">
              <tbody>
                <tr>
                  <th>Manufacturer:</th>
                  <td>{sanitize(product?.manufacturer)}</td>
                </tr>
                <tr>
                  <th>Category:</th>
                  <td>
                    {product?.category?.name
                      ? sanitize(formatCategoryName(product?.category?.name))
                      : "No category"}
                  </td>
                </tr>
                <tr>
                  <th>In stock:</th>
                  <td>{product?.inStock}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
