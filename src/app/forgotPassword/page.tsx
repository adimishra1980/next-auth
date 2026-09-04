"use client";

import axios from "axios";
import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const page = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePasswordReset = async () => {
    if (email.trim().length === 0) {
      return toast.error("Email is required");
    }
    if (!email.includes("@")) {
      return toast.error("Please enter a valid email");
    }

    try {
      setLoading(true);
      await axios.post("/api/users/forgotPassword", { email });
      toast.success("Password reset link sent to your email");
      router.push("/login");
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.error ||
          "Something went wrong. Please try again.";

        toast.error(message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }

      console.log("error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0d0d11] text-neutral-100 relative overflow-x-hidden selection:bg-[#d62d5f] selection:text-white flex flex-col font-sans">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-[#d62d5f]/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 left-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.08),rgba(255,255,255,0))]" />
      </div>

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0d0d11]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d62d5f] rounded-lg"
          >
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#d62d5f] to-purple-600 flex items-center justify-center shadow-lg shadow-[#d62d5f]/25 group-hover:scale-105 transition-transform duration-200">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                NextAuth
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 border border-white/10">
                  v1.0
                </span>
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/profile")}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 active:scale-95 transition-all duration-200 text-sm font-medium cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Go back
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight text-white mb-3">
              Forgot your password?
            </h1>
            <p className="text-neutral-400">
              Enter your email address and we&apos;ll send you a link to reset
              it.
            </p>
          </div>
        </div>

        <div className="glass-card p-8 md:p-10 rounded-3xl w-full max-w-md">
          <label htmlFor="email" className="mb-1 inline-block text-neutral-300">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            className="border-none outline-none px-4 py-3 rounded-md bg-[#1e1e1e] text-neutral-200 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            onClick={handlePasswordReset}
            className="w-full p-2 rounded-md bg-linear-to-br from-[#d62d5f] to-purple-600 text-white font-bold cursor-pointer hover:shadow-lg hover:shadow-[#d62d5f]/25 active:scale-95 transition-all duration-200 mt-4"
          >
            Send Reset Link
          </button>
        </div>
      </main>
    </main>
  );
};

export default page;
