"use client";
import { NormalPage } from "@/source/components/reusable/SimplePages";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html>
      <head>
        <meta name="theme-color" content="#161A26"></meta>
      </head>
      <body>
        <NormalPage usePhysicalNavBar includePadding className="text-center">
          <p className="text-3xl sm:text-4xl font-bold font-proxima">
            We hit a huge bump in the road!
          </p>
          <p className="text-lg font-normal font-proxima pt-1">
            Our team is looking into it.
          </p>
          <p className="text-center pt-2 flex gap-2 justify-center">
            <button
              onClick={() => reset()}
              className="hover:underline cursor-pointer text-blue-300"
            >
              reload
            </button>
            |
            <button
              onClick={() => window?.location?.reload?.()}
              className="hover:underline cursor-pointer text-blue-300"
            >
              refresh
            </button>
          </p>
        </NormalPage>
      </body>
    </html>
  );
}
