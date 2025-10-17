import React from "react";
import { Link } from "react-router";

export const Navbar: React.FC = () => {
  return (
    <nav
      className="absolute top-0 left-0 w-full flex justify-start px-4 sm:px-8 md:px-15"
    >
      <Link to="/">
        <img
          src="/logo.png"
          alt="Movu Logo"
          className="h-20 w-auto sm:h-16 md:h-30 object-contain drop-shadow-lg"
        />
      </Link>
    </nav>
  );
};
