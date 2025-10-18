import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

export const DashboardPage: React.FC = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-[#2b2f33] text-white flex flex-col relative">
      {/* ==== NAVBAR (MISMO COMPONENTE DEL LOGIN) ==== */}
      <Navbar />

      {/* ==== BOTÓN MENÚ HAMBURGUESA ==== */}
      <button
        onClick={toggleMenu}
        className="absolute top-10 right-6 text-white hover:text-red-500 transition focus:outline-none z-50"
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

      {/* ==== FONDO OSCURO CUANDO SE ABRE EL MENÚ ==== */}
      {menuAbierto && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={toggleMenu}
        />
      )}

      {/* ==== PANEL LATERAL ==== */}
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
            to="/aboutPage"
            className="text-white hover:bg-[#4a4f55] rounded-lg px-3 py-2 transition"
            onClick={toggleMenu}
          >
            ℹ️ Sobre nosotros
          </Link>
          <button
            onClick={handleLogout}
            className="text-left text-white hover:bg-red-600 rounded-lg px-3 py-2 transition"
          >
            🚪 Cerrar sesión
          </button>
        </nav>
      </div>

      {/* ==== CONTENIDO PRINCIPAL (MISMA ESTRUCTURA LOGIN) ==== */}
      <div className="flex-grow flex justify-center items-center px-4 py-12">
        <div className="bg-[#3a3f45] p-8 rounded-2xl shadow-lg w-full max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-6">Bienvenido a Movu 🎬</h2>

          {loading ? (
            <div className="flex justify-center items-center py-6">
              <Loader2 size={28} className="animate-spin text-red-500" />
              <span className="ml-2 text-gray-300">Cargando contenido...</span>
            </div>
          ) : (
            <>
              <p className="text-gray-300 mb-8 max-w-lg mx-auto">
                Disfruta de una experiencia personalizada con las mejores películas
                y series. Gestiona tu perfil, descubre contenido nuevo y mantente al
                día con lo mejor del cine.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Card icon="🎬" text="Películas destacadas" />
                <Card icon="⭐" text="Recomendaciones" />
                <Card icon="👤" text="Mi lista" />
                <Card icon="⚙️" text="Configuración" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

interface CardProps {
  icon: string;
  text: string;
}

const Card: React.FC<CardProps> = ({ icon, text }) => (
  <div className="bg-gray-700 p-6 rounded-xl shadow-lg hover:scale-105 transition text-center border border-gray-600">
    <div className="text-3xl mb-2">{icon}</div>
    <p className="font-semibold">{text}</p>
  </div>
);
