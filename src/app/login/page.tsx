"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { axios } from "axios";
import { useState } from "react";

const LoginPage = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const onLogin = async () => {};

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-24 bg-[#131313]">
      <div className="flex flex-col gap-14 w-full max-w-96">
        <h1 className="m-auto text-2xl font-semibold">Sign In</h1>

        <form className="flex flex-col gap-6" onSubmit={onLogin}>
          
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
          >
            {/* {loading ? (
              <>
                <LoaderCircle className="loader" />
              </>
            ) : (
              "Register"
            )} */}
            Login
          </button>
        </form>


        <p className="m-auto text-[#a19b9b]">
          Already have an account? <Link href="/signup" className="text-[#d62d5f] font-bold">Sign Up</Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
