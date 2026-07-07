"use client";

import { CustomButton, SectionTitle } from "@/components";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const router = useRouter();
  const supabase = createClient();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isValidEmail = (email: string) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const fullName = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem("confirmpassword") as HTMLInputElement).value;

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      toast.error("Email is invalid");
      return;
    }
    if (!password || password.length < 8) {
      setError("Password must be 8 characters long");
      toast.error("Password must be 8 characters long");
      return;
    }
    if (confirmPassword !== password) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    setSubmitting(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    setSubmitting(false);

    if (signUpError) {
      setError(signUpError.message);
      toast.error(signUpError.message);
      return;
    }

    toast.success("Registration successful");
    router.push("/login");
  };

  return (
    <div className="bg-white">
      <SectionTitle title="Register" path="Home | Register" />
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-white">
        <div className="flex justify-center flex-col items-center">
          <h2 className="mt-6 text-center text-2xl leading-9 tracking-tight text-gray-900">
            Sign up on our website
          </h2>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                  Name
                </label>
                <div className="mt-2">
                  <input id="name" name="name" type="text" required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
              </div>

              <div>
                <label htmlFor="lastname" className="block text-sm font-medium leading-6 text-gray-900">
                  Lastname
                </label>
                <div className="mt-2">
                  <input id="lastname" name="lastname" type="text" required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input id="email" name="email" type="email" autoComplete="email" required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="mt-2">
                  <input id="password" name="password" type="password" autoComplete="new-password" required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
              </div>

              <div>
                <label htmlFor="confirmpassword" className="block text-sm font-medium leading-6 text-gray-900">
                  Confirm password
                </label>
                <div className="mt-2">
                  <input id="confirmpassword" name="confirmpassword" type="password" autoComplete="new-password" required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
              </div>

              <div>
                <CustomButton
                  buttonType="submit"
                  text={submitting ? "Creating account…" : "Sign up"}
                  paddingX={3}
                  paddingY={1.5}
                  customWidth="full"
                  textSize="sm"
                />
                <p className="text-red-600 text-center text-[16px] my-4">{error}</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
