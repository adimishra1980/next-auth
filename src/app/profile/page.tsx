"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const ProfilePage = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    _id: "",
  });
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

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await axios.get("/api/users/me");

        if (response.data.success) {
          console.log(response.data);
          setUser(response.data.data);
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

    getUserDetails();
  }, []);

  const handleClick = () => {
    router.push(`/profile/${user._id}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile Page</h1>
      <h1 className="text-2xl font-semibold">Profile Page</h1>

      <button
        onClick={logout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md
         cursor-pointer hover:bg-red-600 transition-colors duration-300 font-semibold"
      >
        Logout
      </button>

      <hr />

      <div className="mt-4 text-xl font-semibold">
        <h2 className="text-2xl">
          User ID: {user._id ? user._id : "No user found"}
        </h2>
        <h3 className="text-2xl">
          Username: {user.username ? user.username : "No user found"}
        </h3>
        <h3 className="text-2xl">
          Email: {user.email ? user.email : "No user found"}
        </h3>
      </div>

      <button
        onClick={handleClick}
        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md
         cursor-pointer hover:bg-purple-700 transition-colors duration-300 font-semibold"
      >
        User Profile
      </button>
    </div>
  );
};

export default ProfilePage;
