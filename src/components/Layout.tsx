import React from "react";
import { Navbar } from "./Navbar";
import { Link, Outlet } from "react-router-dom";

const LayoutMovu: React.FC = () => {
  return (
    <div className="layout-container">
      <Navbar />
      {/* 🔹 Espaciado más pequeño en móvil y normal en pantallas grandes */}
      <main className="pt-12 sm:pt-20 px-4 min-h-[80vh]">
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
