import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Link } from "react-router-dom";

/**
 * @file DashboardPage.tsx
 * @description The main dashboard page of the Movu application.
 * Fetches and displays popular videos from the backend (Pexels API).
 */

export const DashboardPage: React.FC = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** Toggle sidebar menu */
  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  /** Fetch popular videos from backend */
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/v1/pexels/videos/popular");
        if (!res.ok) throw new Error("Error al obtener los videos");
        const data = await res.json();
        setVideos(data.videos || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

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
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* ==== BACKGROUND OVERLAY ==== */}
      {menuAbierto && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}

      {/* ==== SIDE MENU ==== */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#3a3f45] shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          menuAbierto ? "translate-x-0" : "translate-x-full"
        }`}
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
          <Link to="/ProfilePage" className="text-white hover:bg-[#4a4f55] rounded-lg px-3 py-2 transition" onClick={toggleMenu}>
            👤 Perfil
          </Link>

          <Link to="/aboutPage" className="text-white hover:bg-[#4a4f55] rounded-lg px-3 py-2 transition" onClick={toggleMenu}>
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

      {/* ==== MAIN CONTENT ==== */}
      <main className="flex-grow flex flex-col items-center px-4 py-12" role="main">
        <div className="bg-[#3a3f45] p-8 rounded-2xl shadow-lg w-full max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-6">🎬 Películas Populares</h2>

          {loading && <p className="text-gray-400">Cargando videos...</p>}
          {error && <p className="text-red-400">{error}</p>}

          {!loading && !error && videos.length === 0 && (
            <p className="text-gray-400">No se encontraron videos.</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="bg-gray-700 rounded-xl shadow-lg p-2 hover:scale-105 transition">
                <video
                  controls
                  className="w-full rounded-lg"
                  poster={video.image}
                >
                  <source src={video.video_files?.[0]?.link} type="video/mp4" />
                  Tu navegador no soporta el video.
                </video>
                <p className="mt-2 text-sm text-gray-300">
                  🎥 {video.user?.name || "Autor desconocido"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
