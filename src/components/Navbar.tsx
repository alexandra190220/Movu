import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Film, Heart, Search, ArrowLeft } from "lucide-react";

/**
 * Props interface for the Navbar component.
 * @interface NavbarProps
 * @property {function} [searchVideos] - Optional callback function that searches videos by a given term.
 */
interface NavbarProps {
  searchVideos?: (term: string) => void;
}

/**
 * Navbar component that provides navigation, search functionality,
 * and responsive menu options for the Movu app.
 *
 * Accessibility features:
 * - All buttons and links have accessible names (aria-labels).
 * - Touch targets follow WCAG minimum size (44x44 px).
 * - The mobile menu uses aria-expanded and aria-controls attributes.
 */
export const Navbar: React.FC<NavbarProps> = ({ searchVideos }) => {
  /** Controls the visibility state of the mobile side menu */
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /** Stores the current search term entered by the user */
  const [searchTerm, setSearchTerm] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  /** Toggles the side menu visibility */
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  /** Routes where the menu is visible */
  const routesWithMenu = [
    "/dashboard",
    "/AboutPage",
    "/ProfilePage",
    "/FavoritosPage",
    "/video",
  ];

  const showOptions = routesWithMenu.includes(location.pathname);
  const showLoginButton = location.pathname === "/";

  /** Executes search */
  const handleSearch = () => {
    if (searchVideos && searchTerm.trim()) searchVideos(searchTerm);
  };

  /** Handles Enter key for search */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <nav
      className="fixed top-0 left-0 w-full bg-[#2b2f33] flex items-center justify-between px-4 sm:px-6 py-2 sm:py-3 shadow-md z-50"
      role="navigation"
      aria-label="Barra de navegación principal"
    >
      {/* Back arrow for mobile */}
      {location.pathname !== "/" && location.pathname !== "/dashboard" && (
        <button
          onClick={() => navigate(-1)}
          className="sm:hidden mr-2 text-white hover:text-red-500 transition"
          aria-label="Volver a la página anterior"
          style={{ minWidth: "44px", minHeight: "44px" }}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      )}

      {/* Logo */}
      <Link to="/" aria-label="Ir a la página principal de Movu">
        <img
          src="/logo.png"
          alt="Logo de Movu"
          className="h-12 sm:h-16 md:h-20 w-auto object-contain drop-shadow-lg transition-all duration-300"
        />
      </Link>

      {/* Login button */}
      {showLoginButton && (
        <Link
          to="/loginPage"
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 sm:px-5 sm:py-2 rounded text-xs sm:text-sm md:text-base transition"
          aria-label="Ir a la página de inicio de sesión"
        >
          Iniciar sesión
        </Link>
      )}

      {/* Menu options */}
      {showOptions && (
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Catalog */}
          <Link
            to="/dashboard"
            className="flex items-center gap-1 sm:gap-2 text-white font-medium hover:text-blue-400 transition"
            aria-label="Ir al catálogo de videos"
          >
            <Film className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            <span className="hidden sm:inline">Catálogo</span>
          </Link>

          {/* Favorites */}
          <Link
            to="/FavoritosPage"
            className="flex items-center gap-1 sm:gap-2 text-white font-medium hover:text-red-400 transition"
            aria-label="Ver lista de favoritos"
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
            <span className="hidden sm:inline">Favoritos</span>
          </Link>

          {/* Search bar (only in Dashboard) */}
          {location.pathname === "/dashboard" && (
            <div
              className="absolute left-1/2 transform -translate-x-1/2 w-32 sm:w-64"
              role="search"
            >
              <div className="relative">
                <label htmlFor="search-input" className="sr-only">
                  Buscar videos
                </label>
                <input
                  id="search-input"
                  type="text"
                  placeholder="Buscar..."
                  aria-label="Buscar videos"
                  className="px-3 py-1 sm:px-4 sm:py-2 rounded-full w-full text-black bg-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-red-400 text-xs sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-600"
                  aria-label="Buscar"
                  style={{ minWidth: "44px", minHeight: "44px" }}
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Hamburger menu button */}
          <button
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMenuOpen}
            aria-controls="menu-lateral"
            className="text-white hover:text-red-500 transition focus:outline-none"
            style={{ minWidth: "44px", minHeight: "44px" }}
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 sm:w-7 sm:h-7"
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
                className="w-6 h-6 sm:w-7 sm:h-7"
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
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}

      {/* Side menu */}
      <div
        id="menu-lateral"
        className={`fixed top-0 right-0 h-full w-64 bg-[#3a3f45] shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="menu"
        aria-label="Menú lateral de navegación"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Menú</h2>
          <button
            onClick={toggleMenu}
            className="text-gray-300 hover:text-red-500 transition"
            aria-label="Cerrar menú lateral"
            style={{ minWidth: "44px", minHeight: "44px" }}
          >
            ✖
          </button>
        </div>
        <nav className="flex flex-col p-4 space-y-3">
          <Link
            to="/ProfilePage"
            className="text-white hover:bg-[#4a4f55] rounded-lg px-3 py-2 transition"
            onClick={toggleMenu}
            role="menuitem"
            aria-label="Ir al perfil del usuario"
          >
            👤 Perfil
          </Link>
          <Link
            to="/AboutPage"
            className="text-white hover:bg-[#4a4f55] rounded-lg px-3 py-2 transition"
            onClick={toggleMenu}
            role="menuitem"
            aria-label="Ver información sobre nosotros"
          >
            ℹ️ Sobre nosotros
          </Link>
          <Link
            to="/"
            className="text-white hover:bg-[#4a4f55] rounded-lg px-3 py-2 transition"
            onClick={toggleMenu}
            role="menuitem"
            aria-label="Cerrar sesión e ir al inicio"
          >
            🚪 Cerrar sesión
          </Link>
        </nav>
      </div>
    </nav>
  );
};
