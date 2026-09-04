import Link from "next/link";
import mongoose from "mongoose";
import { connectToDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import CopyButton from "@/components/CopyButton";
import {
  ArrowLeft,
  Shield,
  BadgeCheck,
  Calendar,
  Sparkles,
  User as UserIcon,
  Fingerprint,
  Mail,
  Cpu,
  Layers,
} from "lucide-react";

interface SerializedUser {
  _id: string;
  username: string;
  email: string;
  isVerified?: boolean;
  isAdmin?: boolean;
  createdAt?: string;
}

interface UserProfileProps {
  params: Promise<{ id: string }>;
}

const UserProfile = async ({ params }: UserProfileProps) => {
  const { id } = await params;

  let userData: SerializedUser | null = null;
  const isValidObjectId = mongoose.isValidObjectId(id);

  if (isValidObjectId) {
    try {
      await connectToDB();
      const found = await User.findById(id).select("-password").lean<{
        _id: mongoose.Types.ObjectId;
        username: string;
        email: string;
        isVerified?: boolean;
        isAdmin?: boolean;
        createdAt?: Date;
      }>();

      if (found) {
        userData = {
          _id: found._id.toString(),
          username: found.username,
          email: found.email,
          isVerified: found.isVerified,
          isAdmin: found.isAdmin,
          createdAt: found.createdAt ? new Date(found.createdAt).toISOString() : undefined,
        };
      }
    } catch (err) {
      console.error("Failed to query user by ID:", err);
    }
  }

  const getInitials = (name?: string) => {
    if (!name) return id.slice(0, 2).toUpperCase();
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Verified Account";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
    } catch {
      return "Verified Account";
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d11] text-neutral-100 relative overflow-x-hidden selection:bg-[#d62d5f] selection:text-white flex flex-col items-center justify-between p-4 sm:p-6 md:p-12 font-sans">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-24 left-1/3 w-[500px] h-[500px] bg-[#d62d5f]/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.08),rgba(255,255,255,0))]" />
      </div>

      {/* Navigation Header */}
      <div className="w-full max-w-xl relative z-10 flex items-center justify-between mb-8">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-sm font-medium transition active:scale-95 duration-200 backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Profile</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          <Fingerprint className="w-3.5 h-3.5 text-[#d62d5f]" />
          <span>Identity Verification</span>
        </div>
      </div>

      {/* Digital Identity Pass / Card */}
      <div className="w-full max-w-xl relative z-10">
        <div className="relative p-[1px] rounded-3xl bg-gradient-to-b from-[#d62d5f]/40 via-purple-500/20 to-white/10 shadow-2xl shadow-[#d62d5f]/15">
          <div className="relative rounded-3xl bg-gradient-to-b from-[#15151c]/95 to-[#101014]/95 backdrop-blur-2xl p-6 sm:p-8 flex flex-col gap-6 overflow-hidden">
            {/* Top Accent Light Bar */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#d62d5f] via-purple-500 to-indigo-500" />

            {/* Holographic Chip & Card Brand */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-9 rounded-lg bg-gradient-to-br from-amber-400/20 to-amber-600/30 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
                  <Cpu className="w-5 h-5 opacity-90" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold tracking-wider text-neutral-300 uppercase">
                    NextAuth Pass
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    SECURE IDENTITY
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Node
              </div>
            </div>

            {/* Profile Avatar & Primary Details */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#d62d5f] via-[#b92557] to-indigo-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-xl shadow-[#d62d5f]/30 border-2 border-white/20 select-none">
                  {getInitials(userData?.username)}
                </div>
                {userData?.isAdmin && (
                  <div className="absolute -top-2 -right-2 bg-amber-500 text-black rounded-full p-1 shadow-lg">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl font-bold text-white tracking-tight truncate">
                    {userData ? userData.username : "Public Identity"}
                  </h1>

                  {userData?.isAdmin && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      <Sparkles className="w-3 h-3" />
                      Admin
                    </span>
                  )}

                  {userData?.isVerified ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-neutral-300 border border-white/10">
                      Member
                    </span>
                  )}
                </div>

                <p className="text-sm text-neutral-400 font-mono">
                  {userData?.username ? `@${userData.username.toLowerCase()}` : "User Profile Card"}
                </p>

                {userData?.email && (
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-neutral-300">
                    <Mail className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{userData.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Unique Identifier Box */}
            <div className="flex flex-col gap-2 bg-[#0c0c10] border border-white/10 rounded-2xl p-4">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Layers className="w-3.5 h-3.5 text-[#d62d5f]" />
                  Unique System ID
                </span>
                <span className="font-mono text-[11px] text-neutral-400">
                  {isValidObjectId ? "MongoDB ObjectId" : "Custom Param"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 bg-white/5 p-2.5 rounded-xl border border-white/5">
                <code className="text-xs sm:text-sm font-mono text-[#e6396f] font-semibold break-all">
                  {id}
                </code>
                <CopyButton text={id} label="Copy" successMessage="User ID copied to clipboard!" />
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 flex flex-col gap-1">
                <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-neutral-500" />
                  Member Since
                </span>
                <span className="text-xs sm:text-sm font-semibold text-white truncate">
                  {userData?.createdAt ? formatDate(userData.createdAt) : "Verified User"}
                </span>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 flex flex-col gap-1">
                <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-neutral-500" />
                  Verification
                </span>
                <span className="text-xs sm:text-sm font-semibold text-emerald-400 flex items-center gap-1">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  {userData?.isVerified ? "Email Confirmed" : "Standard Pass"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
              <Link
                href="/profile"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#d62d5f] to-[#b92557] hover:from-[#e03a6c] hover:to-[#c72d62] text-white text-sm font-semibold shadow-lg shadow-[#d62d5f]/25 active:scale-95 transition-all duration-200"
              >
                <UserIcon className="w-4 h-4" />
                <span>My Profile Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="relative z-10 mt-8 text-center text-xs text-neutral-400">
        Secured by NextAuth • Full Stack Authentication
      </div>
    </div>
  );
};

export default UserProfile;
