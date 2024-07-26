"use client";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import { AuthContext } from "@/context/authContext";
import { useContext } from "react";
import Image from "next/image";
import logo from "../../public/logo.png";
import { Moon, Sun } from "lucide-react";
import { ThemeContext } from "@/context/themeContext";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const authContext = useContext(AuthContext);
  const themeContext = useContext(ThemeContext);
  const router = useRouter();

  if (!authContext || !themeContext) {
    return null;
  }

  const { isAuthenticated, user, logout } = authContext;
  const { theme, toggleTheme } = themeContext;

  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b bg-violet-950/90 border-zinc-800 dark:border-gray-600 backdrop-blur-lg shadow-lg dark:shadow-[0px_0px_20px_20px_rgba(162,_13,_220,_0.2)] transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b-black">
          <div className="flex items-center h-full px-2 rounded-md hover:bg-purple-900/50">
            <Link href="/" className="flex z-40 font-semibold">
              <Image
                src={logo}
                alt="logo"
                width={30}
                height={30}
                className="-rotate-90"
              />
              <span className="ml-2 mt-1 ">Tunes.</span>
            </Link>
          </div>

          <div className="items-center hidden space-x-4 sm:flex h-14">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center h-full px-2 rounded-md cursor-pointer hover:bg-purple-900/50">
                  <Link href="/dashboard" className="flex z-40 font-semibold">
                    Dashboard
                  </Link>
                </div>
                <div className="flex items-center h-full px-2 rounded-md cursor-pointer hover:bg-purple-900/50">
                  <Link
                    href="/dashboard/all-songs"
                    className="flex z-40 font-semibold"
                  >
                    Songs
                  </Link>
                </div>
                <div className="flex items-center h-full px-2 rounded-md cursor-pointer hover:bg-purple-900/50">
                  <Link
                    href="/dashboard/playlists"
                    className="flex z-40 font-semibold"
                  >
                    Playlists
                  </Link>
                </div>
                <div className="flex items-center h-full px-2 rounded-md cursor-pointer hover:bg-purple-900/50">
                  <Link
                    href="/dashboard/friends"
                    className="flex z-40 font-semibold"
                  >
                    Friends
                  </Link>
                </div>
                <div className="flex items-center h-full px-2 rounded-md cursor-pointer hover:bg-purple-900/50">
                  <Link
                    href="/dashboard/party-mode"
                    className="flex z-40 font-semibold"
                  >
                    Party Mode
                  </Link>
                </div>

                <div className="flex items-center h-full px-2 rounded-md cursor-pointer hover:bg-purple-900/50">
                  <Link href="/profile" className="flex z-40 font-semibold">
                    <i className=" mr-2 mt-1 fa-solid fa-user" />{" "}
                    {user.username}
                  </Link>
                </div>
                <div
                  className="flex items-center h-full px-2 mb-0.5 rounded-md hover:bg-purple-900/50 cursor-pointer"
                  onClick={() => logout()}
                >
                  <i className=" mr-2 mt-1 fa-solid fa-right-from-bracket fa-lg "></i>
                  <span>Logout</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center h-full px-2 rounded-md hover:bg-purple-900/50">
                  <Link href="/login" className="flex z-40 font-semibold">
                    <span className=" dark:text-white">Login</span>
                  </Link>
                </div>
                <div className="flex items-center h-full px-2 rounded-md hover:bg-purple-900/50">
                  <Link href="/register" className="flex z-40 font-semibold">
                    <span className="dark:text-white">Signup</span>
                  </Link>
                </div>
              </>
            )}
            <button onClick={toggleTheme}>
              {theme === "dark" ? (
                <Sun size={24} strokeWidth={3} absoluteStrokeWidth />
              ) : (
                <Moon size={24} strokeWidth={3} />
              )}
            </button>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
