"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { AuthContext } from "@/context/authContext";
import Link from "next/link";
import { useContext, useState } from "react";
export default function Home() {
  const [hov, setHov] = useState(false);
  const authContext: any = useContext(AuthContext);
  if (!authContext) {
    return null;
  }
  const { isAuthenticated, user } = authContext;
  return (
    <>
      <MaxWidthWrapper className=" mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">
        <div
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          className="mx-auto mb-4 max-w-fit items-center justify-center space-x-2 overflow-hidden  text-white hover:text-slate-900 rounded-full border bg-violet-950/100 border-purple-950 dark:bg-violet-950/100 px-7 py-2 shadow-md backdrop-blur transition-all hover:dark:border-purple-600 hover:bg-purple-900/50 dark:hover:border-violet-700/100"
        >
          
          <p className="text-sm font-semibold hover:bg-gradient-to-tl hover:from-slate-800 hover:via-violet-900 hover:to-zinc-800 hover:bg-clip-text hover:text-transparent bg-gradient-to-br from-slate-200 via-violet-700 to-gray-100 bg-clip-text text-transparent">
            {hov ? <i className="fa-solid fa-headphones"> </i> : "D"} - Tunes is
            now Live!
          </p>
        </div>
        <h1 className="max-w-4xl text-4xl font-bold md:text-5xl lg:text-6xl">
          Stream Your <span className="text-violet-600">Songs</span> ad-free
          with <span className="text-violet-600 ">D-Tunes</span>.
        </h1>
        <p className="mt-5 max-w-prose text-zinc-700 dark:text-zinc-400 sm:text-lg">
          {" "}
          D-Tunes allows you to simply search a song of your choice and play it
          anywhere
        </p>
        {isAuthenticated && user ? (
          <Link href="/dashboard">
            <button className="mt-6 rounded-full px-8 py-4 text-md font-medium  bg-violet-950/100 dark:border-fuchsia-600 border-purple-950 dark:bg-violet-950/100 shadow-md backdrop-blur transition-all text-white hover:text-slate-900 hover:border-purple-900 hover:bg-purple-900/50 dark:hover:bg-violet-800/30 dark:hover:border-violet-700/100">
              Dashboards
              <i className="fa-solid fa-arrow-right ml-2"></i>
            </button>
          </Link>
        ) : (
          <Link href="/register">
            <button className="mt-6 rounded-full px-8 py-4 text-md font-medium  bg-violet-950/100 dark:border-fuchsia-600 border-purple-950 dark:bg-violet-950/100 shadow-md backdrop-blur transition-all text-white hover:text-slate-900 hover:border-purple-900 hover:bg-purple-900/50 dark:hover:bg-violet-800/30 dark:hover:border-violet-700/100">
              Get Started
              <i className="fa-solid fa-arrow-right ml-2"></i>
            </button>
          </Link>
        )}
      </MaxWidthWrapper>
      <div className="relative isolate">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#b457ee] to-[#554af1] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>
    </>
  );
}
