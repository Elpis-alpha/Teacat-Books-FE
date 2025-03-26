import AppProvider from "@/source/components/providers/AppProvider";
import "./styles/globals.css";
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
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="Teacat Books" />
        <link rel="manifest" href="/site.webmanifest" />
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
