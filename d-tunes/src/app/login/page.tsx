"use client";
import React, { useState, useContext, FormEvent, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "../../lib/axios";
import Link from "next/link";
import { AuthContext } from "@/context/authContext";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import dotenv from "dotenv";
dotenv.config();

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const authContext = useContext(AuthContext);
  const router = useRouter();
  if(!authContext) return null;
  const { login, isAuthenticated } = authContext;
  const [isError, setIsError] = useState(false);
  const hasSubmitted = useRef(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (hasSubmitted.current) return;
    hasSubmitted.current = true;

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      { email, password }
    );
      login(res.data.token,res.data.role);
      // router.push("/dashboard");
    } catch (err) {
      setIsError(true);
      console.error(err);
      hasSubmitted.current = false;
    }
  };

  const handleDAuthLogin = () => {
    window.location.href = process.env.NEXT_PUBLIC_API_URL + "/dauth/login";
  };

  if (!authContext) {
    return null;
  }

  return (
    <>
      <MaxWidthWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-card p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-center flex flex-col justify-center items-center mb-6 text-primary">
              Login to Your Account
              {isError && (
                <h4 className="font-thin text-sm text-red-500 flex align-middle text-center">
                  Invalid Credentials
                </h4>
              )}
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-card-foreground"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 text-black block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring focus:border-primary"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-card-foreground"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block text-black w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring focus:border-primary"
                  required
                />
              </div>
              <button
                type="submit"
                className="mt-6 rounded-full px-8 py-2 w-full text-md font-medium  bg-violet-950/100 dark:border-fuchsia-600 border-purple-950 dark:bg-violet-950/100 shadow-md backdrop-blur transition-all text-white hover:text-slate-900 hover:border-purple-900 hover:bg-purple-900/50 dark:hover:bg-violet-800/30 dark:hover:border-violet-700/100"
              >
                Login
              </button>
            </form>
            <button
              onClick={handleDAuthLogin}
              className="mt-6 rounded-full px-8 py-2 w-full text-md font-medium  bg-green-500 shadow-md backdrop-blur transition-all text-white hover:text-slate-900 hover:border-green-700 hover:bg-green-600"
            >
              Login with DAuth
            </button>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </MaxWidthWrapper>
    </>
  );
};

export default Login;
