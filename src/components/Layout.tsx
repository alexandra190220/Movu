import React from "react";
import { Navbar } from "./Navbar";
import { Link, Outlet } from "react-router-dom";

/**
 * LayoutMovu component that defines the general structure of the application.
 * It includes the navigation bar, main content area, and footer.
 *
 * @component
 * @returns {JSX.Element} The rendered layout containing Navbar, main content, and footer.
 */
const LayoutMovu: React.FC = () => {
  return (
    <div className="layout-container">
      {/* 🔹 Smaller spacing on mobile, normal spacing on larger screens */}
      <Navbar />

      <main className="pt-12 sm:pt-20 px-4 min-h-[80vh]">
        {/* The <Outlet> renders the current route’s child component */}
        <Outlet />
      </main>

      <footer className="text-center p-4 bg-[#111] text-gray-400 text-sm">
        <p className="mb-2">
          <Link
            to="/SiteMapPage"
            className="text-red-500 hover:underline font-medium"
          >
            Mapa del sitio
          </Link>
        </p>
        © 2025 Movu — Todos los derechos reservados
      </footer>
    </div>
  );
};

export default LayoutMovu;
