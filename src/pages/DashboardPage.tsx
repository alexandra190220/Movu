import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Link } from "react-router-dom";

import { Heart } from "lucide-react";

export const DashboardPage: React.FC = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [favoritos, setFavoritos] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const API_URL = "https://movu-back-4mcj.onrender.com/api/v1/pexels";

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  /** Cargar videos populares */
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

  /** Buscar videos por palabra clave */
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

  /** Añadir o quitar favoritos */
  const toggleFavorito = (id: number) => {
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    loadPopularVideos();
  }, []);

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white flex flex-col relative">
      {/* === NAVBAR === */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Movu" className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Movu</h1>
        </div>

        <nav className="hidden sm:flex gap-6">
          <Link
            to="/dashboard"
            className="text-gray-300 hover:text-white font-medium"
          >
            Catálogo
          </Link>
          <Link
            to="/favoritos"
            className="text-gray-300 hover:text-white font-medium"
          >
            Favoritos
          </Link>
        </nav>

        {/* Menú hamburguesa */}
        <button
          onClick={toggleMenu}
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          className="sm:hidden text-white hover:text-red-500 transition focus:outline-none"
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

      {/* === BARRA DE BÚSQUEDA === */}
      <main className="flex-grow px-6 py-8">
        <h2 className="text-3xl font-bold mb-6 text-center">
          🎬 Explora videos de Pexels
        </h2>

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

        {/* === GRID DE VIDEOS === */}
        {loading ? (
          <p className="text-center text-gray-400">Cargando videos...</p>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {videos.map((video) => (
              <div
                key={video.id}
                className="relative group bg-[#2b2f33] rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
              >
                <video
                  controls
                  className="w-full h-48 object-cover rounded-t-xl"
                >
                  <source src={video.video_files?.[0]?.link} type="video/mp4" />
                </video>

                {/* ❤️ BOTÓN FAVORITO */}
                <button
                  onClick={() => toggleFavorito(video.id)}
                  className="absolute top-2 right-2 bg-black/40 rounded-full p-2 hover:bg-black/60 transition"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favoritos.includes(video.id)
                        ? "text-red-500 fill-red-500"
                        : "text-white"
                    }`}
                  />
                </button>

                {/* Título */}
                <div className="p-2 text-sm text-center font-medium text-gray-200 truncate">
                  {video.user?.name || "Autor desconocido"}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No se encontraron videos.</p>
        )}
      </main>
    </div>
  );
};
