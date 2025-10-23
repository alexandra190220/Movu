import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Film, Star } from "lucide-react";

export const Navbar: React.FC = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  // 🔹 Rutas donde se muestran Catálogo, Favoritos y Menú
  const rutasConMenu = ["/dashboard", "/about", "/profile"];
  const mostrarOpciones = rutasConMenu.includes(location.pathname);

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#2b2f33] flex items-center justify-between px-6 py-3 shadow-md z-50">
      {/* ==== LOGO ==== */}
      <Link to="/" className="flex items-center">
        <img
          src="/logo.png"
          alt="Movu Logo"
          className="h-14 w-auto object-contain drop-shadow-lg"
        />
      </Link>

      {/* ==== OPCIONES SOLO EN CIERTAS RUTAS ==== */}
      {mostrarOpciones && (
        <div className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-white font-medium hover:text-blue-400 transition"
          >
            <Film className="w-5 h-5 text-blue-400" />
            Catálogo
          </Link>

          <Link
            to="/favorites"
            className="flex items-center gap-2 text-white font-medium hover:text-yellow-400 transition"
          >
            <Star className="w-5 h-5 text-yellow-400" />
            Favoritos
          </Link>

          {/* ==== BOTÓN MENÚ HAMBURGUESA ==== */}
          <button
            onClick={toggleMenu}
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            className="text-white hover:text-red-500 transition focus:outline-none"
          >
            {menuAbierto ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      )}

      {/* ==== OVERLAY ==== */}
      {menuAbierto && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={toggleMenu}
        />
      )}

      {/* ==== MENÚ LATERAL ==== */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#3a3f45] shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          menuAbierto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Menú</h2>
          <button
            onClick={toggleMenu}
            className="text-gray-300 hover:text-red-500 transition"
          >
            ✖
          </button>
        </div>

        <nav className="flex flex-col p-4 space-y-3">
          <Link
            to="/profile"
            className="text-white hover:bg-[#4a4f55] rounded-lg px-3 py-2 transition"
            onClick={toggleMenu}
          >
            👤 Perfil
          </Link>
          <Link
            to="/about"
            className="text-white hover:bg-[#4a4f55] rounded-lg px-3 py-2 transition"
            onClick={toggleMenu}
          >
            ℹ️ Sobre nosotros
          </Link>
          <Link
            to="/"
            className="text-white hover:bg-[#4a4f55] rounded-lg px-3 py-2 transition"
            onClick={toggleMenu}
          >
            🚪 Cerrar sesión
          </Link>
        </nav>
      </div>
    </nav>
  );
};
