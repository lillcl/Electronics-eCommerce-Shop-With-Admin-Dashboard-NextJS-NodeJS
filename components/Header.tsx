"use client";

import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import HeaderTop from "./HeaderTop";
import Image from "next/image";
import SearchInput from "./SearchInput";
import Link from "next/link";
import CartElement from "./CartElement";
import NotificationBell from "./NotificationBell";
import HeartElement from "./HeartElement";
import toast from "react-hot-toast";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import { useAuth } from "@/components/AuthProvider";
import { listWishlist } from "@/lib/data/wishlist";

const Header = () => {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const { wishlist, setWishlist, wishQuantity } = useWishlistStore();

  const handleLogout = async () => {
    await signOut();
    toast.success("Logout successful!");
  };

  useEffect(() => {
    if (!user) {
      setWishlist([]);
      return;
    }
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
    <header className="bg-white">
      <HeaderTop />
      {pathname.startsWith("/admin") === false && (
        <div className="h-32 bg-white flex items-center justify-between px-16 max-[1320px]:px-16 max-md:px-6 max-lg:flex-col max-lg:gap-y-7 max-lg:justify-center max-lg:h-60 max-w-screen-2xl mx-auto">
          <Link href="/">
            <img src="/logo v1 svg.svg" width={300} height={300} alt="singitronic logo" className="relative right-5 max-[1023px]:w-56" />
          </Link>
          <SearchInput />
          <div className="flex gap-x-10 items-center">
            <NotificationBell />
            <HeartElement wishQuantity={wishQuantity} />
            <CartElement />
          </div>
        </div>
      )}
      {pathname.startsWith("/admin") === true && (
        <div className="flex justify-between h-32 bg-white items-center px-16 max-[1320px]:px-10  max-w-screen-2xl mx-auto max-[400px]:px-5">
          <Link href="/">
            <Image
              src="/logo v1.png"
              width={130}
              height={130}
              alt="singitronic logo"
              className="w-56 h-auto"
            />
          </Link>
          <div className="flex gap-x-5 items-center">
            <NotificationBell />
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="w-10">
                <Image
                  src="/randomuser.jpg"
                  alt="random profile photo"
                  width={30}
                  height={30}
                  className="w-full h-full rounded-full"
                />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li><Link href="/admin">Dashboard</Link></li>
                <li><Link href="/">Visit site</Link></li>
                <li onClick={handleLogout}><a href="#">Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
