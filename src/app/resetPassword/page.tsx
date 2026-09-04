"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";

const ResetPasswordPage = () => {
  const params = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    const token = window.location.search.split("=")[1];
    if (!token) {
      toast.error("Invalid or expired reset link");
      return;
    }

    if (password.trim().length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/users/resetPassword", {
        token,
        password,
      });
      toast.success("Password reset successful! You can now login.");
      router.push("/login");
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.error ||
          "Failed to reset password. The link may have expired.";
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
              <Lock className="w-5 h-5 text-white" />
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
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight text-white mb-3">
              Reset Password
            </h1>
            <p className="text-neutral-400">
              Enter your new password below. The reset link is valid for one
              hour.
            </p>
          </div>
        </div>

        <div className="glass-card p-8 md:p-10 rounded-3xl w-full max-w-md">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="mb-2 inline-block text-neutral-300"
              >
                New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter new password"
                className="border-none outline-none px-4 py-3 rounded-md bg-[#1e1e1e] text-neutral-200 w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 inline-block text-neutral-300"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                className="border-none outline-none px-4 py-3 rounded-md bg-[#1e1e1e] text-neutral-200 w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              onClick={handleResetPassword}
              className="w-full p-2 rounded-md bg-linear-to-br from-[#d62d5f] to-purple-600 text-white font-bold cursor-pointer hover:shadow-lg hover:shadow-[#d62d5f]/25 active:scale-95 transition-all duration-200 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </div>
      </main>
    </main>
  );
};

export default ResetPasswordPage;
