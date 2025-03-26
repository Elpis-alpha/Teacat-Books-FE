"use client";

import { postApiJson } from "@/source/api";
import { removeToken } from "@/source/api/misc";
import routes from "@/source/api/routes";
import { useAppDispatch, useAppSelector } from "@/source/store/hooks";
import { removeUserData, setUserLoading } from "@/source/store/slice/userSlice";
import gsap from "gsap";
import Hamburger from "hamburger-react";
import Link from "next/link";
import { MouseEventHandler, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  FaBook,
  FaBookOpen,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { FaShield, FaUserPen } from "react-icons/fa6";
import { ClipLoader } from "react-spinners";
import ClientRender from "../reusable/ClientRender";
import { usePathname } from "next/navigation";
import SafeImage from "../reusable/SafeImage";

const NavBar = () => {
  const dispatch = useAppDispatch();
  const path = usePathname();

  const {
    available,
    loading,
    data: userData,
  } = useAppSelector((store) => store.user);

  // NAV CODE
  const isChanging = useRef(false);
  const navRef = useRef<HTMLDivElement>(null);
  const [navIsOpen, setNavIsOpen] = useState(false);
  const clickBlur: MouseEventHandler<HTMLDivElement> = (e) => {
    const tar = e.target as HTMLDivElement | undefined;
    if (tar?.id === "nav-blur") toggleNav();
  };
  const toggleNav = () => {
    if (isChanging.current) return;
    if (!navRef.current) return;
    const navState = navIsOpen;
    setNavIsOpen((p) => !p);

    gsap
      .to(navRef.current, {
        left: navState ? "101vw" : "0vw",
        duration: 0.2,
        ease: "power1.inOut",
      })
      .then(() => {
        isChanging.current = false;
      });
  };

  const logoutUser = async () => {
    try {
      dispatch(setUserLoading(true));
      const res = await postApiJson(routes.user.logout);
      if (res.error) {
        dispatch(setUserLoading(false));
        console.info("Logout Response: ", res);
        toast.error(res.errorMessage || "Failed to logout");
      } else {
        removeToken();
        dispatch(removeUserData());
        toast.success("Logged out successfully");
        if (navIsOpen) toggleNav();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to logout");
      dispatch(setUserLoading(false));
    }
  };

  if (path.startsWith("/read")) return <></>;

  return (
    <>
      <nav className="w-full absolute top-0 left-0 z-50 right-0">
        <div className="py-6 px-6 md:px-10 xl:px-16 max-w-[1920px] mx-auto flex gap-6 items-center justify-between">
          <div className="flex gap-8 xl:gap-12.5 items-center">
            <Link
              href="/"
              className="text-2xl sm:text-3xl font-proxima font-bold py-2 flex items-center gap-2 hover:text-blue-300"
            >
              <SafeImage src="/favicon.svg" alt="Favicon" className="w-10 h-10 -mt-1" />
              <h1>Teacat Books</h1>
            </Link>
            <Link
              href="/books"
              className="smm:block hidden hover:text-blue-300"
            >
              Browse Books
            </Link>
          </div>
          <ClientRender initial={null}>
            <div className="not-slg:hidden slg:flex items-center lg:gap-9 gap-4">
              {loading ? (
                <div className="p-2.5 flex">
                  <ClipLoader color="#fff" size={24} />
                </div>
              ) : available && userData ? (
                <>
                  {userData.isAdmin && (
                    <Link href="/admin" className="p-2.5 hover:text-blue-300">
                      Admin
                    </Link>
                  )}
                  {userData.author.status === "approved" && (
                    <Link href="/author" className="p-2.5 hover:text-blue-300">
                      Author
                    </Link>
                  )}
                  <Link href="/my-books" className="p-2.5 hover:text-blue-300">
                    My Books
                  </Link>
                  <Link href="/profile" className="p-2.5 hover:text-blue-300">
                    Profile
                  </Link>
                  <button
                    onClick={logoutUser}
                    className="p-2.5 hover:text-blue-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/signin" className="p-2.5 hover:text-blue-300">
                  Sign In
                </Link>
              )}
            </div>
          </ClientRender>

          <div className="flex slg:hidden items-center">
            <Hamburger
              toggled={navIsOpen}
              toggle={toggleNav}
              size={30}
              distance="sm"
              rounded
            />
          </div>
        </div>
      </nav>
      <div
        ref={navRef}
        onClick={clickBlur}
        className={`fixed slg:hidden block backdrop-blur-sm w-full h-full top-0 bottom-0 z-70 left-[101vw] transition-all cursor-alias`}
        id="nav-blur"
      >
        <div
          className={
            "h-full w-[300px] max-w-[100vw]  mr-0 ml-auto p-[32px] overflow-auto flex flex-col gap-[30px]  " +
            "bg-sub-bg cursor-auto"
          }
        >
          <div className="left-[-11px]">
            <Hamburger
              toggled={navIsOpen}
              toggle={toggleNav}
              size={35}
              distance="sm"
              rounded
            />
          </div>
          <div className="py-4">
            <Link
              onClick={toggleNav}
              href="/"
              className="text-2xl font-proxima font-bold flex items-center gap-2 hover:text-blue-300"
            >
              <SafeImage src="/favicon.svg" alt="Favicon" className="w-10 h-10 -mt-1" />
              <h1>Teacat Books</h1>
            </Link>
          </div>

          <div className="flex flex-col gap-8 text-left">
            <Link
              href="/books"
              onClick={toggleNav}
              className="p-1 hover:text-blue-300 smm:hidden flex items-center gap-3"
            >
              <FaBookOpen />
              Browse Books
            </Link>
            {loading ? (
              <div className="p-2.5 flex">
                <ClipLoader color="#fff" size={24} />
              </div>
            ) : available && userData ? (
              <>
                {userData.isAdmin && (
                  <Link
                    href="/admin"
                    onClick={toggleNav}
                    className="p-1 hover:text-blue-300 flex items-center gap-3"
                  >
                    <FaShield />
                    Admin
                  </Link>
                )}
                {userData.author.status === "approved" && (
                  <Link
                    href="/author"
                    onClick={toggleNav}
                    className="p-1 hover:text-blue-300 flex items-center gap-3"
                  >
                    <FaUserPen />
                    Author
                  </Link>
                )}
                <Link
                  href="/my-books"
                  onClick={toggleNav}
                  className="p-1 hover:text-blue-300 flex items-center gap-3"
                >
                  <FaBook />
                  My Books
                </Link>
                <Link
                  href="/profile"
                  onClick={toggleNav}
                  className="p-1 hover:text-blue-300 flex items-center gap-3"
                >
                  <FaUser />
                  Profile
                </Link>
                <button
                  onClick={logoutUser}
                  className="p-1 hover:text-blue-300 text-left flex items-center gap-3"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/signin"
                onClick={toggleNav}
                className="p-1 hover:text-blue-300 flex items-center gap-3"
              >
                <FaSignInAlt />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default NavBar;

export const NavBarPlaceholder = () => {
  return <div className="w-full h-[96px] sm:h-[100px]"></div>;
};
