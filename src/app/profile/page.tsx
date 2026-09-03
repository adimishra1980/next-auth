"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const ProfilePage = () => {
  const router = useRouter();

  const logout = async () => {
    try {
      const response = await axios.get("/api/users/logout");

      if (response.data.success) {
        toast.success(response.data.message);
        // redirect to login page
        router.push("/login");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.error ||
          "Something went wrong. Please try again.";

        toast.error(message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile Page</h1>

      <button
        onClick={logout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md
         cursor-pointer hover:bg-red-600 transition-colors duration-300 font-semibold"
      >
        Logout
      </button>
    </div>
  );
};

export default ProfilePage;
