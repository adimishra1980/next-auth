"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  User as UserIcon,
  Mail,
  Shield,
  BadgeCheck,
  Calendar,
  ArrowRight,
  LogOut,
  RefreshCw,
  LoaderCircle,
  Sparkles,
  AlertCircle,
  KeyRound,
  ExternalLink,
  Lock,
} from "lucide-react";
import CopyButton from "@/components/CopyButton";

interface UserData {
  _id: string;
  username: string;
  email: string;
  isVerified?: boolean;
  isAdmin?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const getUserDetails = useCallback(async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);
      setError(null);
      const response = await axios.get("/api/users/me");

      if (response.data.success) {
        setUser(response.data.data);
        if (showToast) {
          toast.success("Profile updated");
        }
      } else {
        setError(response.data.error || "Failed to load profile");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.error ||
          "Failed to fetch profile details. Please log in again.";
        setError(message);
        if (showToast) toast.error(message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    getUserDetails();
  }, [getUserDetails]);

  const logout = async () => {
    try {
      setLoggingOut(true);
      const response = await axios.get("/api/users/logout");

      if (response.data.success) {
        toast.success(response.data.message || "Logged out successfully");
        router.push("/login");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.error || "Logout failed. Please try again.");
      } else {
        toast.error("Something went wrong during logout.");
      }
    } finally {
      setLoggingOut(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently joined";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
    } catch {
      return "Recently joined";
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d11] text-neutral-100 relative overflow-x-hidden selection:bg-[#d62d5f] selection:text-white flex flex-col font-sans">
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
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Active Session
            </div>

            <button
              onClick={logout}
              disabled={loggingOut}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 active:scale-95 transition-all duration-200 text-sm font-medium cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loggingOut ? (
                <LoaderCircle className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              <span>{loggingOut ? "Signing out..." : "Log Out"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8">
        {/* Loading State */}
        {loading ? (
          <div className="w-full flex flex-col gap-6 animate-pulse">
            <div className="h-64 rounded-3xl bg-white/3 border border-white/10" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-48 rounded-3xl bg-white/3 border border-white/10" />
              <div className="h-48 rounded-3xl bg-white/3 border border-white/10" />
              <div className="h-48 rounded-3xl bg-white/3 border border-white/10" />
            </div>
          </div>
        ) : error && !user ? (
          /* Error State */
          <div className="rounded-3xl bg-red-500/10 border border-red-500/20 p-8 text-center flex flex-col items-center gap-4 max-w-md mx-auto my-12 backdrop-blur-md">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-white">Profile Unavailable</h2>
              <p className="text-sm text-neutral-400">{error}</p>
            </div>
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => getUserDetails(true)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition cursor-pointer"
              >
                Retry
              </button>
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl bg-[#d62d5f] hover:bg-[#b92557] text-white text-sm font-medium transition"
              >
                Go to Sign In
              </Link>
            </div>
          </div>
        ) : user ? (
          /* Profile Details Content */
          <>
            {/* Hero Profile Banner */}
            <div className="relative rounded-3xl bg-linear-to-b from-[#17171f] to-[#121217] border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl overflow-hidden group">
              {/* Card top accent light */}
              <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-[#d62d5f] to-purple-500 opacity-80" />

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                {/* Left side: Avatar + Names */}
                <div className="flex items-center gap-5 sm:gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-linear-to-br from-[#d62d5f] via-[#b92557] to-indigo-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-extrabold shadow-xl shadow-[#d62d5f]/25 border-2 border-white/20 select-none">
                      {getInitials(user.username)}
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#121217] ${
                        user.isVerified ? "bg-emerald-500" : "bg-amber-500"
                      } flex items-center justify-center`}
                      title={user.isVerified ? "Verified Account" : "Unverified Account"}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        {user.username}
                      </h1>
                      {user.isAdmin && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          <Sparkles className="w-3 h-3" />
                          Admin
                        </span>
                      )}
                      {user.isVerified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          <BadgeCheck className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          <AlertCircle className="w-3 h-3" />
                          Unverified
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-neutral-400 font-mono flex items-center gap-2">
                      <span>@{user.username.toLowerCase()}</span>
                      <span className="text-neutral-600">•</span>
                      <span className="text-neutral-400 font-sans">
                        Joined {formatDate(user.createdAt)}
                      </span>
                    </p>

                    {/* ID Chip */}
                    <div className="mt-1 inline-flex items-center gap-2 text-xs font-mono text-neutral-300 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 w-fit">
                      <span className="text-neutral-500">ID:</span>
                      <span className="truncate max-w-40 sm:max-w-none">{user._id}</span>
                      <CopyButton text={user._id} label="" iconOnly successMessage="User ID copied!" />
                    </div>
                  </div>
                </div>

                {/* Right side: Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={() => getUserDetails(true)}
                    disabled={refreshing}
                    className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-sm font-medium transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-60"
                    title="Refresh profile details"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${refreshing ? "animate-spin text-[#d62d5f]" : ""}`}
                    />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>

                  <Link
                    href={`/profile/${user._id}`}
                    className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#d62d5f] hover:bg-[#b92557] text-white text-sm font-semibold shadow-lg shadow-[#d62d5f]/25 active:scale-95 transition-all duration-200 group"
                  >
                    <span>View Public ID Card</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Dashboard Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Account Information Card */}
              <div className="rounded-3xl bg-[#141419]/90 border border-white/10 p-6 flex flex-col justify-between gap-6 backdrop-blur-xl hover:border-white/20 transition-all duration-200">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#d62d5f]/15 border border-[#d62d5f]/30 flex items-center justify-center text-[#d62d5f]">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      Identity
                    </span>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-white">Account Details</h2>
                    <p className="text-xs text-neutral-400">
                      Personal credentials and identifiers
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 pt-2">
                    <div className="flex flex-col gap-1 bg-white/3 p-3 rounded-xl border border-white/5">
                      <span className="text-[11px] text-neutral-400 font-medium flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-neutral-500" />
                        Email Address
                      </span>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-white truncate">
                          {user.email}
                        </span>
                        <CopyButton
                          text={user.email}
                          label=""
                          iconOnly
                          successMessage="Email copied!"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 bg-white/3 p-3 rounded-xl border border-white/5">
                      <span className="text-[11px] text-neutral-400 font-medium flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                        Registration Date
                      </span>
                      <span className="text-sm font-medium text-white">
                        {formatDate(user.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
                  <span>Role</span>
                  <span className="font-semibold text-neutral-200">
                    {user.isAdmin ? "Administrator" : "Standard User"}
                  </span>
                </div>
              </div>

              {/* Security & Access Card */}
              <div className="rounded-3xl bg-[#141419]/90 border border-white/10 p-6 flex flex-col justify-between gap-6 backdrop-blur-xl hover:border-white/20 transition-all duration-200">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      Security
                    </span>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-white">Authentication</h2>
                    <p className="text-xs text-neutral-400">
                      Security protocol & token session
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 pt-2">
                    <div className="flex items-center justify-between bg-white/3 p-3 rounded-xl border border-white/5">
                      <div className="flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-purple-400" />
                        <span className="text-xs text-neutral-300 font-medium">Session Token</span>
                      </div>
                      <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Active (HTTP-Only)
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-white/3 p-3 rounded-xl border border-white/5">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-purple-400" />
                        <span className="text-xs text-neutral-300 font-medium">Password</span>
                      </div>
                      <span className="text-xs font-semibold text-neutral-300 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                        Bcrypt Encrypted
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-white/3 p-3 rounded-xl border border-white/5">
                      <div className="flex items-center gap-2">
                        <BadgeCheck className="w-4 h-4 text-purple-400" />
                        <span className="text-xs text-neutral-300 font-medium">Verification</span>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                          user.isVerified
                            ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                            : "text-amber-400 bg-amber-500/10 border-amber-500/20"
                        }`}
                      >
                        {user.isVerified ? "Email Verified" : "Pending Verification"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Security Rating</span>
                  <span className="font-semibold text-emerald-400">Strong</span>
                </div>
              </div>

              {/* Quick Navigation & Digital Badge */}
              <div className="rounded-3xl bg-[#141419]/90 border border-white/10 p-6 flex flex-col justify-between gap-6 backdrop-blur-xl hover:border-white/20 transition-all duration-200">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      Navigation
                    </span>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-white">Public ID Pass</h2>
                    <p className="text-xs text-neutral-400">
                      Shareable digital identity card
                    </p>
                  </div>

                  <div className="bg-linear-to-br from-white/4 to-white/1 p-4 rounded-2xl border border-white/5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">Digital Pass</span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#d62d5f]/20 text-[#d62d5f] border border-[#d62d5f]/30">
                        Live
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Your unique profile has a dedicated public pass accessible via your assigned ID.
                    </p>
                    <Link
                      href={`/profile/${user._id}`}
                      className="mt-1 inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition border border-white/10"
                    >
                      <span>Open Digital Pass</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
                  <Link href="/" className="hover:text-white transition flex items-center gap-1">
                    ← Back to Home
                  </Link>
                  <span className="font-mono text-neutral-500 text-[11px]">
                    Next.js App Router
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
};

export default ProfilePage;
