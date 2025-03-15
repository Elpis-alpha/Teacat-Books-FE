"use client";
import { NormalPage } from "@/source/components/reusable/SimplePages";
import Link from "next/link";

export default function NotFound() {
  return (
    <NormalPage usePhysicalNavBar includePadding className="text-center">
      <p className="text-3xl sm:text-4xl font-bold font-proxima">Lost in the pages?</p>
      <p className="text-lg font-normal font-proxima pt-1">
        This link seems to be missing.
      </p>
      <p className="text-center pt-2 flex gap-2 justify-center">
        <Link href="/" className="hover:underline text-blue-300">
          home
        </Link>
        |
        <button
          onClick={() => window.history.back()}
          className="hover:underline cursor-pointer text-blue-300"
        >
          back
        </button>
      </p>
    </NormalPage>
  );
}
