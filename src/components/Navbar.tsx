import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Film, Heart, Search } from "lucide-react";

interface NavbarProps {
  buscarVideos?: (termino: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ buscarVideos }) => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [termino, setTermino] = useState(""); // input de búsqueda
  const location = useLocation();

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  const rutasConMenu = [
    "/dashboard",
    "/AboutPage",
    "/ProfilePage",
    "/FavoritosPage",
  ];
  const mostrarOpciones = rutasConMenu.includes(location.pathname);
  const mostrarLogin = location.pathname === "/";

  const handleBuscar = () => {
    if (buscarVideos && termino.trim()) {
      buscarVideos(termino);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleBuscar();
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#2b2f33] flex items-center justify-between px-6 py-3 shadow-md z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img
          src="/logo.png"
          alt="Movu Logo"
          className="h-16 md:h-20 w-auto object-contain drop-shadow-lg transition-all duration-300"
        />
      </Link>

      {/* Botón Iniciar sesión */}
      {mostrarLogin && (
        <Link
          to="/loginPage"
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded text-sm md:text-base transition"
        >
          Iniciar sesión
        </Link>
      )}

      {/* Opciones de menú */}
      {mostrarOpciones && (
        <div className="flex items-center gap-4">
          {/* Catálogo */}
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-white font-medium hover:text-blue-400 transition"
          >
            <Film className="w-5 h-5 text-blue-400" />
            Catálogo
          </Link>

          {/* Favoritos */}
          <Link
            to="/FavoritosPage"
            className="flex items-center gap-2 text-white font-medium hover:text-red-400 transition"
          >
            <Heart className="w-5 h-5 text-red-400" />
            Favoritos
          </Link>

          {/* 🔹 Búsqueda (solo en Dashboard) */}
          {location.pathname === "/dashboard" && (
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="px-4 py-2 rounded-full w-64 text-black bg-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-red-400"
                  value={termino}
                  onChange={(e) => setTermino(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <button
                  onClick={handleBuscar}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-600"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Menú hamburguesa */}
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

      {/* Overlay */}
      {menuAbierto && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={toggleMenu}
        />
      )}

      {/* Menú lateral */}
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
            to="/ProfilePage"
            className="text-white hover:bg-[#4a4f55] rounded-lg px-3 py-2 transition"
            onClick={toggleMenu}
          >
            👤 Perfil
          </Link>
          <Link
            to="/AboutPage"
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
            🚪 Cerrar sesióon
          </Link>
        </nav>
      </div>
    </nav>
  );
};
