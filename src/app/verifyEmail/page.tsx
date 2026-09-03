"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const VerifyEmailPage = () => {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);

  const verifyUserEmail = async () => {
    try {
      await axios.post("/api/users/verifyEmail", { token });

      setVerified(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.error ||
          "Something went wrong. Please try again.";

        toast.error(message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }

      console.log("error: ", error);
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, [])

  useEffect(() => {
    if(token.length > 0) {
      verifyUserEmail()
    }
  }, [token])

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 bg-[#131313]">
      <h1 className="text-3xl">Verify your email</h1>
      <h2 className="text-2xl font-semibold mt-3">
        {token ? token : "no token"}
      </h2>

      {verified && (
        <div>
          <h2 className="text-2xl">Email verified successfully</h2>
          <Link href="/login" className="text-2xl font-semibold mt-3">
            Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default VerifyEmailPage;
