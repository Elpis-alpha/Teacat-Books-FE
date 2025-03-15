import AppProvider from "@/source/components/providers/AppProvider";
import "./styles/globals.css";
// import "./styles/utilities.css";
import type { Metadata } from "next";
import LocalFont from "next/font/local";

const proxima = LocalFont({
  src: [
    { path: "../public/fonts/proxima.400.woff2", weight: "400" },
    { path: "../public/fonts/proxima.700.woff2", weight: "700" },
  ],
  variable: "--font-proxima",
});

const miller = LocalFont({
  src: [
    { path: "../public/fonts/miller.400.woff2", weight: "400" },
    { path: "../public/fonts/miller.700.woff2", weight: "700" },
  ],
  variable: "--font-miller",
});

export const metadata: Metadata = {
  title: "Teacat Books",
  description: "Discover, borrow, or buy your next favorite book",
};

const fonts = [proxima.variable, miller.variable].join(" ");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <meta name="theme-color" content="#161A26"></meta>
      </head>
      <body
        suppressHydrationWarning
        className={`${fonts} font-normal leading-normal font-miller antialiased`}
      >
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
