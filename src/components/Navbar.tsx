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
 * @component
 * @param {NavbarProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered Navbar component.
 */
export const Navbar: React.FC<NavbarProps> = ({ searchVideos }) => {
  /** Controls the visibility state of the mobile side menu */
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /** Stores the current search term entered by the user */
  const [searchTerm, setSearchTerm] = useState("");

  /** React Router hook to get the current location */
  const location = useLocation();

  /** React Router hook to navigate between pages */
  const navigate = useNavigate();

  /**
   * Toggles the side menu visibility.
   * @function
   */
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  /** List of routes where the menu should be displayed */
  const routesWithMenu = [
    "/dashboard",
    "/AboutPage",
    "/ProfilePage",
    "/FavoritosPage",
    "/video",
  ];

  /** Determines if menu options should be shown based on the current route */
  const showOptions = routesWithMenu.includes(location.pathname);

  /** Determines if the "Iniciar sesión" button should be shown */
  const showLoginButton = location.pathname === "/";

  /**
   * Executes the search function when the user submits a search term.
   * Calls `searchVideos` if provided.
   * @function
   */
  const handleSearch = () => {
    if (searchVideos && searchTerm.trim()) {
      searchVideos(searchTerm);
    }
  };

  /**
   * Handles the Enter key press on the search input field.
   * Triggers the search if Enter is pressed.
   * @function
   * @param {React.KeyboardEvent<HTMLInputElement>} e - Keyboard event.
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#2b2f33] flex items-center justify-between px-4 sm:px-6 py-2 sm:py-3 shadow-md z-50">
      
      {/* Back arrow for mobile */}
      {location.pathname !== "/" && location.pathname !== "/dashboard" && (
        <button
          onClick={() => navigate(-1)}
          className="sm:hidden mr-2 text-white hover:text-red-500 transition"
          aria-label="Volver"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      )}

      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img
          src="/logo.png"
          alt="Movu Logo"
          className="h-12 sm:h-16 md:h-20 w-auto object-contain drop-shadow-lg transition-all duration-300"
        />
      </Link>

      {/* Login button */}
      {showLoginButton && (
        <Link
          to="/loginPage"
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 sm:px-5 sm:py-2 rounded text-xs sm:text-sm md:text-base transition"
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
          >
            <Film className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            <span className="hidden sm:inline">Catálogo</span>
          </Link>

          {/* Favorites */}
          <Link
            to="/FavoritosPage"
            className="flex items-center gap-1 sm:gap-2 text-white font-medium hover:text-red-400 transition"
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
            <span className="hidden sm:inline">Favoritos</span>
          </Link>

          {/* Search bar (only in Dashboard) */}
          {location.pathname === "/dashboard" && (
            <div className="absolute left-1/2 transform -translate-x-1/2 w-32 sm:w-64">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="px-3 py-1 sm:px-4 sm:py-2 rounded-full w-full text-black bg-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-red-400 text-xs sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-600"
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
            className="text-white hover:text-red-500 transition focus:outline-none"
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
        />
      )}

      {/* Side menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#3a3f45] shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
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
            🚪 Cerrar sesión
          </Link>
        </nav>
      </div>
    </nav>
  );
};
