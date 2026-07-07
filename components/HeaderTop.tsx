"use client";

import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import { FaHeadphones, FaRegEnvelope, FaRegUser, FaLocationDot } from "react-icons/fa6";
import { useAuth } from "@/components/AuthProvider";

const HeaderTop = () => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    toast.success("Logout successful!");
  };

  return (
    <div className="h-10 text-white bg-blue-500 max-lg:px-5 max-lg:h-16 max-[573px]:px-0">
      <div className="flex justify-between h-full max-lg:flex-col max-lg:justify-center max-lg:items-center max-w-screen-2xl mx-auto px-12 max-[573px]:px-0">
        <ul className="flex items-center h-full gap-x-5 max-[370px]:text-sm max-[370px]:gap-x-2">
          <li className="flex items-center gap-x-2 font-semibold">
            <FaHeadphones className="text-white" />
            <span>+381 61 123 321</span>
          </li>
          <li className="flex items-center gap-x-2 font-semibold">
            <FaRegEnvelope className="text-white text-xl" />
            <span>test@email.com</span>
          </li>
        </ul>
        <ul className="flex items-center gap-x-5 h-full max-[370px]:text-sm max-[370px]:gap-x-2 font-semibold">
          {!user ? (
            <>
              <li className="flex items-center">
                <Link href="/login" className="flex items-center gap-x-2 font-semibold">
                  <FaRegUser className="text-white" />
                  <span>Login</span>
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/register" className="flex items-center gap-x-2 font-semibold">
                  <FaRegUser className="text-white" />
                  <span>Register</span>
                </Link>
              </li>
            </>
          ) : (
            <>
              <span className="ml-10 text-base">{user.email}</span>
              <li className="flex items-center">
                <button onClick={handleLogout} className="flex items-center gap-x-2 font-semibold">
                  <FaRegUser className="text-white" />
                  <span>Log out</span>
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default HeaderTop;
