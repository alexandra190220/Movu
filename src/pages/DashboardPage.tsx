import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Link } from "react-router-dom";

/**
 * @file DashboardPage.tsx
 * @description Main dashboard page for Movu. Displays navigation, search,
 * and Pexels videos fetched through the backend API.
 */

export const DashboardPage: React.FC = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  // ⚙️ URL del backend — usa la de Render o localhost según el entorno
  const API_URL = "https://movu-back-4mcj.onrender.com/api/v1/pexels";

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  /** 🔹 Cargar videos populares */
  const loadPopularVideos = async () => {
    try {
      const res = await fetch(`${API_URL}/videos/popular`);
      const data = await res.json();
      setVideos(data.videos || []);
    } catch (err) {
      console.error("Error cargando videos populares:", err);
    } finally {
      setLoading(false);
    }
  };

  /** 🔹 Buscar videos por palabra clave */
  const searchVideos = async () => {
    if (!query.trim()) {
      loadPopularVideos();
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(
        `${API_URL}/videos/search?query=${encodeURIComponent(query)}&per_page=6`
      );
      const data = await res.json();
      setVideos(data.videos || []);
    } catch (err) {
      console.error("Error buscando videos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPopularVideos();
  }, []);

  return (
    <div className="min-h-screen bg-[#2b2f33] text-white flex flex-col relative">
      {/* ==== NAVBAR ==== */}
      <Navbar />

      {/* ==== BOTÓN MENÚ ==== */}
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

      {/* ==== CONTENIDO PRINCIPAL ==== */}
      <main className="flex-grow px-6 py-10">
        <h2 className="text-3xl font-bold mb-6 text-center">🎬 Explora videos de Pexels</h2>

        {/* Barra de búsqueda */}
        <div className="flex justify-center gap-3 mb-8">
          <input
            type="text"
            placeholder="Buscar videos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="p-2 rounded-lg text-black w-72"
          />
          <button
            onClick={searchVideos}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium"
          >
            Buscar
          </button>
        </div>

        {/* Lista de videos */}
        {loading ? (
          <p className="text-center text-gray-300">Cargando videos...</p>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
            {videos.map((video) => (
              <video
                key={video.id}
                controls
                className="rounded-xl shadow-md max-w-full"
              >
                <source src={video.video_files?.[0]?.link} type="video/mp4" />
              </video>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No se encontraron videos.</p>
        )}
      </main>
    </div>
  );
};
