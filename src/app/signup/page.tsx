"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

const SignupPage = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/users/signup", user);

      if (response.data.success) {
        toast.success(response.data.message);
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

      console.log("error: ", error);
    } finally {
      setLoading(false);
    }

    setUser({
      username: "",
      email: "",
      password: "",
    });
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-24 bg-[#131313]">
      <div className="flex flex-col gap-14 w-full max-w-96">
        <h1 className="m-auto text-2xl font-semibold">Sign Up</h1>

        <form className="flex flex-col gap-6" onSubmit={(e) => onSignup(e)}>
          <div className="flex flex-col gap-2">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="border-none outline-none px-4 py-3 rounded-md bg-[#1e1e1e] text-neutral-200"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="border-none outline-none px-4 py-3 rounded-md bg-[#1e1e1e] text-neutral-200"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="border-none outline-none px-4 py-3 rounded-md bg-[#1e1e1e] text-neutral-200"
            />
          </div>

          <button
            type="submit"
            className="border-none outline-none px-3.5 py-3 rounded-md bg-[#d62d5f] text-antiquewhite hover:bg-[#b92557] active:scale-95 transition-all duration-300 cursor-pointer font-semibold"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className=" flex justify-center items-center">
                  <LoaderCircle className="animate-spin" />
                </div>
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="m-auto text-[#a19b9b]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#d62d5f] font-bold">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
};

export default SignupPage;
