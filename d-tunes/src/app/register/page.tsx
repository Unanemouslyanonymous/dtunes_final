"use client";
import React, { useState, useContext, FormEvent, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "../../lib/axios";
import { AuthContext } from "@/context/authContext";
import Link from "next/link";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

const Register = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("user");
  const [isUser, setIsUser] = useState<boolean>(false);
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const hasSubmitted = useRef(false);

  if (!authContext) {
    return null;
  }

  const { register, isAuthenticated } = authContext;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (hasSubmitted.current) return;
    hasSubmitted.current = true;

    try {
      const res = await axios.post("/auth/register", {
        username,
        email,
        password,
        role,
      });
      register(res.data.token, res.data.role);
      router.push("/login");
    } catch (err: any) {
      if (err.response?.status === 400) {
        setIsUser(true);
        console.log("User already exists");
      }
      console.error(err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <>
      <MaxWidthWrapper>
        <div className="min-h-screen flex items-center justify-center overflow-hidden">
          <div className="bg-card p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-center mb-6 text-primary">
              {isUser ? (
                <div className="text-red-500 text-sm">User already exists</div>
              ) : (
                <></>
              )}
              Create an Account
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-card-foreground"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-input text-black rounded-md shadow-sm focus:outline-none focus:border-primary"
                  required
                />
              </div>
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
                  className="mt-1 block w-full px-3 py-2 border text-black border-input rounded-md shadow-sm focus:outline-none focus:ring focus:border-primary"
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
                  className="mt-1 block w-full px-3 py-2 text-black border border-input rounded-md shadow-sm focus:outline-none focus:ring focus:border-primary"
                  required
                />
              </div>
              <div className="py-4">
                <label>Role: </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="ml-2 p-2 shadow-md bg-slate-200 text-black  rounded-sm"
                  required
                >
                  <option value="user">User</option>
                  <option value="artist">Artist</option>
                </select>
              </div>
              <button
                type="submit"
                className="mt-6 rounded-full px-8 py-2 w-full text-md font-medium  bg-violet-950/100 dark:border-fuchsia-600 border-purple-950 dark:bg-violet-950/100 shadow-md backdrop-blur transition-all text-white hover:text-slate-900 hover:border-purple-900 hover:bg-purple-900/50 dark:hover:bg-violet-800/30 dark:hover:border-violet-700/100"
              >
                Register
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </MaxWidthWrapper>
    </>
  );
};

export default Register;
