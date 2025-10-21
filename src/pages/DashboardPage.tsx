import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Link } from "react-router-dom";

/**
 * @file DashboardPage.tsx
 * @description The main dashboard page of the Movu application. 
 * Provides navigation through a responsive hamburger menu and 
 * displays the main user interface options such as profile, featured movies, and settings.
 * 
 * @component
 * @example
 * return (
 *   <DashboardPage />
 * );
 */

/**
 * DashboardPage Component
 * 
 * @function
 * @name DashboardPage
 * @description Renders the main dashboard page with navigation, 
 * an interactive side menu, and shortcut cards for quick access to user features.
 * 
 * @returns {JSX.Element} A styled dashboard page with navigation and quick links.
 */
export const DashboardPage: React.FC = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);

  /**
   * @function toggleMenu
   * @description Toggles the sidebar menu visibility state.
   * @returns {void}
   */
  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  return (
    <div className="min-h-screen bg-[#2b2f33] text-white flex flex-col relative">
      {/* ==== NAVBAR ==== */}
      <Navbar />

      {/* ==== HAMBURGER MENU BUTTON ==== */}
      <button
        onClick={toggleMenu}
        aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
        className="absolute top-10 right-6 text-white hover:text-red-500 transition focus:outline-none z-50"
      >
        {menuAbierto ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            role="img"
            aria-hidden="true"
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
            role="img"
            aria-hidden="true"
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

      {/* ==== BACKGROUND OVERLAY WHEN MENU IS OPEN ==== */}
      {menuAbierto && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}

      {/* ==== SIDE MENU PANEL ==== */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#3a3f45] shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          menuAbierto ? "translate-x-0" : "translate-x-full"
        }`}
        role="navigation"
        aria-label="Menú lateral del panel"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Menú</h2>
          <button
            onClick={toggleMenu}
            aria-label="Cerrar menú lateral"
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
            to="/aboutPage"
            className="text-white hover:bg-[#4a4f55] rounded-lg px-3 py-2 transition"
            onClick={toggleMenu}
          >
            ℹ️ Sobre nosotros
          </Link>

          {/* ==== LOGOUT (redirects to home) ==== */}
          <Link
            to="/"
            onClick={() => {
              localStorage.removeItem("token");
              toggleMenu();
            }}
            className="text-left text-white hover:bg-red-600 rounded-lg px-3 py-2 transition"
          >
            🚪 Cerrar sesión
          </Link>
        </nav>
      </div>

      {/* ==== MAIN CONTENT ==== */}
      <main
        className="flex-grow flex justify-center items-center px-4 py-12"
        role="main"
      >
        <div className="bg-[#3a3f45] p-8 rounded-2xl shadow-lg w-full max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-6">Bienvenido a Movu 🎬</h2>

          <>
            <p className="text-gray-300 mb-8 max-w-lg mx-auto">
              Disfruta de una experiencia personalizada con las mejores
              películas y series. Administra tu perfil, descubre nuevo contenido
              y mantente al día con los últimos estrenos del cine.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card icon="🎬" text="Películas destacadas" />
              <Card icon="⭐" text="Recomendaciones" />
              <Card icon="👤" text="Mi lista" />
              <Card icon="⚙️" text="Configuración" />
            </div>
          </>
        </div>
      </main>
    </div>
  );
};

/**
 * @interface CardProps
 * @description Props for the Card component.
 * @property {string} icon - The emoji or icon displayed at the top of the card.
 * @property {string} text - The descriptive text displayed below the icon.
 */
interface CardProps {
  icon: string;
  text: string;
}

/**
 * Card Component
 * 
 * @function
 * @name Card
 * @description Displays a simple icon-based card used on the dashboard to highlight key features.
 * 
 * @param {CardProps} props - The component properties.
 * @returns {JSX.Element} A stylized card with an icon and descriptive text.
 */
const Card: React.FC<CardProps> = ({ icon, text }) => (
  <div
    className="bg-gray-700 p-6 rounded-xl shadow-lg hover:scale-105 transition text-center border border-gray-600"
    role="button"
    tabIndex={0}
    aria-label={text}
  >
    <div className="text-3xl mb-2">{icon}</div>
    <p className="font-semibold">{text}</p>
  </div>
);
