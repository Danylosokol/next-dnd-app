import Link from "next/link";
import React from "react";

function Header() {
  return (
    <header className="sticky top-0 bg-gray-200 z-50 py-4 px-2 md:px-10 shadow-md">
      <Link href={"/"}>
        <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
      </Link>
    </header>
  );
}

export default Header;
