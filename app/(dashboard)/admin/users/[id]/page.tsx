"use client";
import { DashboardSidebar } from "@/components";
import React, { useEffect, useState, use } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { isValidEmailAddressFormat } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface DashboardUserDetailsProps {
  params: Promise<{ id: string }>;
}

const DashboardSingleUserPage = ({ params }: DashboardUserDetailsProps) => {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [userInput, setUserInput] = useState<{
    email: string;
    newPassword: string;
    role: string;
  }>({
    email: "",
    newPassword: "",
    role: "",
  });
  const router = useRouter();

  const deleteUser = async () => {
    const supabase = createClient();
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) {
      toast.error("There was an error while deleting user");
      return;
    }
    toast.success("User deleted successfully");
    router.push("/admin/users");
  };

  const updateUser = async () => {
    if (userInput.email.length <= 3 || userInput.role.length === 0) {
      toast.error("For updating a user you must enter all values");
      return;
    }

    if (!isValidEmailAddressFormat(userInput.email)) {
      toast.error("You entered invalid email address format");
      return;
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ email: userInput.email, role: userInput.role })
      .eq("id", id);

    if (error) {
      console.error("Error updating user:", error);
      toast.error("There was an error while updating user");
      return;
    }
    toast.success("User successfully updated");
  };

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("profiles")
      .select("id, email, role")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) {
          setUserInput({
            email: data.email ?? "",
            newPassword: "",
            role: data.role ?? "",
          });
        }
      });
  }, [id]);

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-7 xl:pl-5 max-xl:px-5 w-full">
        <h1 className="text-3xl font-semibold">User details</h1>
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Email:</span>
            </div>
            <input
              type="email"
              className="input input-bordered w-full max-w-xs"
              value={userInput.email}
              onChange={(e) =>
                setUserInput({ ...userInput, email: e.target.value })
              }
            />
          </label>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">New password:</span>
            </div>
            <input
              type="password"
              className="input input-bordered w-full max-w-xs"
              onChange={(e) =>
                setUserInput({ ...userInput, newPassword: e.target.value })
              }
              value={userInput.newPassword}
            />
          </label>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">User role: </span>
            </div>
            <select
              className="select select-bordered"
              value={userInput.role}
              onChange={(e) =>
                setUserInput({ ...userInput, role: e.target.value })
              }
            >
              <option value="admin">admin</option>
              <option value="user">user</option>
            </select>
          </label>
        </div>
        <div className="flex gap-x-2 max-sm:flex-col">
          <button
            type="button"
            className="uppercase bg-blue-500 px-10 py-5 text-lg border border-black border-gray-300 font-bold text-white shadow-sm hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2"
            onClick={updateUser}
          >
            Update user
          </button>
          <button
            type="button"
            className="uppercase bg-red-600 px-10 py-5 text-lg border border-black border-gray-300 font-bold text-white shadow-sm hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2"
            onClick={deleteUser}
          >
            Delete user
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSingleUserPage;
