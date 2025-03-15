"use client";

import Link from "next/link";
import { ClipLoader } from "react-spinners";
import { NavBarPlaceholder } from "../general/NavBar";

export const NormalPage = ({
  children,
  className,
  includePadding,
  usePhysicalNavBar,
  useStart,
}: {
  children: React.ReactNode | string | number;
  className?: string;
  includePadding?: boolean;
  usePhysicalNavBar?: boolean;
  useStart?: boolean;
}) => {
  return (
    <>
      {usePhysicalNavBar && <NavBarPlaceholder />}
      <main
        className={
          "flex-1 flex flex-col w-full mx-auto z-10 text-white " +
          (includePadding ? "p-6 " : " ") +
          (useStart
            ? "items-start justify-start "
            : "items-center justify-center ") +
          (className || "")
        }
      >
        {children}
      </main>
    </>
  );
};

export const LoadingPage = ({
  message,
  onlyMessage,
  size = 50,
}: {
  message?: string;
  size?: number;
  onlyMessage?: boolean;
}) => {
  return (
    <NormalPage usePhysicalNavBar includePadding>
      {!onlyMessage && <ClipLoader color="#fff" size={size} />}
      {message && (
        <h1 className="text-lg text-center font-normal pt-4">{message}</h1>
      )}
    </NormalPage>
  );
};

export const ErrorPage = ({
  message,
  returnLink,
  returnText,
  returnContent,
}: {
  message: string;
  returnLink?: string;
  returnText?: string;
  returnContent?: React.ReactNode | string | number;
}) => {
  return (
    <NormalPage usePhysicalNavBar includePadding>
      <h1 className="font-bold font-proxima text-2xl text-center">{message}</h1>
      {returnLink && returnLink && (
        <Link
          href={returnLink}
          className="text-lg text-highlight hover:underline text-center"
        >
          {returnText}
        </Link>
      )}
      {returnContent || <></>}
    </NormalPage>
  );
};
