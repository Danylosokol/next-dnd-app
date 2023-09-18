"use client";

import "./globals.css";

import { ConfirmProvider } from "material-ui-confirm";
import Header from "./components/Header/Header";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Tyre App</title>
        <meta name="description" content="Tyre app for MBGP" />
      </head>
      <ConfirmProvider>
        <body className={inter.className}>
          <Header />
          <main className="px-2 md:px-10 py-4 bg-gray-50 min-h-[86dvh] 2xl:min-h-[91dvh]">{children}</main>
        </body>
      </ConfirmProvider>
    </html>
  );
}
