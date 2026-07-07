"use client";

import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import { useAuth } from "@/components/AuthProvider";
import { listWishlist } from "@/lib/data/wishlist";
import Link from "next/link";
import { useEffect } from "react";
import { nanoid } from "nanoid";

export const WishlistModule = () => {
  const { user } = useAuth();
  const { wishlist, setWishlist } = useWishlistStore();

  useEffect(() => {
    if (!user) return;
    (async () => {
      const items = await listWishlist(user.id);
      const productArray = items.map((it: any) => ({
        id: it.product.id,
        title: it.product.title,
        price: it.product.price,
        image: it.product.main_image,
        slug: it.product.slug,
        stockAvailabillity: it.product.in_stock,
      }));
      setWishlist(productArray);
    })();
  }, [user, setWishlist]);

  return (
    <>
      {wishlist && wishlist.length === 0 ? (
        <h3 className="text-center text-4xl py-10 text-black max-lg:text-3xl max-sm:text-2xl max-sm:pt-5 max-[400px]:text-xl">
          No items found in the wishlist
        </h3>
      ) : (
        <div className="max-w-screen-2xl mx-auto">
          <div className="overflow-x-auto">
            <table className="table text-center">
              <thead>
                <tr>
                  <th></th>
                  <th className="text-accent-content">Image</th>
                  <th className="text-accent-content">Name</th>
                  <th className="text-accent-content">Stock Status</th>
                  <th className="text-accent-content">Action</th>
                </tr>
              </thead>
              <tbody>
                {wishlist?.map((item) => (
                  <tr key={nanoid()}>
                    <td>
                      <input type="checkbox" className="checkbox" />
                    </td>
                    <td>
                      <Link href={`/product/${item.slug}`}>
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-20 h-20 object-cover mx-auto"
                        />
                      </Link>
                    </td>
                    <td>
                      <Link href={`/product/${item.slug}`} className="hover:underline">
                        {item.title}
                      </Link>
                    </td>
                    <td>
                      {item.stockAvailabillity > 0 ? "In stock" : "Out of stock"}
                    </td>
                    <td>
                      <button className="btn btn-sm">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};
