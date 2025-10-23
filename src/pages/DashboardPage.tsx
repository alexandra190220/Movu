import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, Film } from "lucide-react";
import { Navbar } from "../components/Navbar";

export const DashboardPage: React.FC = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [videos, setVideos] = useState<{ [key: string]: any[] }>({});
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://movu-back-4mcj.onrender.com/api/v1/pexels";

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  useEffect(() => {
    const favs = localStorage.getItem("favoritos");
    if (favs) setFavoritos(JSON.parse(favs));
  }, []);

  const guardarFavoritos = (nuevos: any[]) => {
    setFavoritos(nuevos);
    localStorage.setItem("favoritos", JSON.stringify(nuevos));
  };

  const toggleFavorito = (video: any) => {
    const existe = favoritos.some((f) => f.id === video.id);
    const nuevos = existe
      ? favoritos.filter((f) => f.id !== video.id)
      : [...favoritos, video];
    guardarFavoritos(nuevos);
  };

  const loadVideosByCategory = async () => {
    const categorias = ["Comedia", "Terror", "Acción", "Naturaleza", "Animales"];
    const resultado: any = {};
    setLoading(true);

    for (const cat of categorias) {
      try {
        const res = await fetch(
          `${API_URL}/videos/search?query=${encodeURIComponent(cat)}&per_page=4`
        );
        const data = await res.json();
        resultado[cat] = data.videos || [];
      } catch (err) {
        console.error("Error cargando categoría:", cat, err);
      }
    }

    setVideos(resultado);
    setLoading(false);
  };

  useEffect(() => {
    loadVideosByCategory();
  }, []);

  return (
    <div className="min-h-screen bg-[#2b2f33] text-white flex flex-col relative">
      {/* ==== NAVBAR SOLO LOGO ==== */}
      <Navbar />

      {/* ==== BOTONES CATÁLOGO Y FAVORITOS CERCA DEL MENÚ ==== */}
      <div className="absolute top-6 right-20 flex gap-3 z-50">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 bg-[#3a3f45] hover:bg-[#4a4f55] text-white px-3 py-2 rounded-lg transition"
        >
          <Film className="w-4 h-4 text-blue-400" />
          Catálogo
        </Link>
        <Link
          to="/favorites"
          className="flex items-center gap-2 bg-[#3a3f45] hover:bg-[#4a4f55] text-white px-3 py-2 rounded-lg transition"
        >
          <Star className="w-4 h-4 text-yellow-400" />
          Favoritos
        </Link>
      </div>

      {/* ==== BOTÓN MENÚ ==== */}
      <button
        onClick={toggleMenu}
        aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
        className="absolute top-7 right-6 text-white hover:text-red-500 transition focus:outline-none z-50"
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

      {/* ==== MENÚ LATERAL (NO MODIFICADO) ==== */}
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

      {/* ==== CONTENIDO ==== */}
      <main className="flex-grow px-6 py-20">
        {loading ? (
          <p className="text-center text-gray-400 mt-10">Cargando videos...</p>
        ) : (
          Object.entries(videos).map(([categoria, lista]) => (
            <section key={categoria} className="mb-10">
              <h2 className="text-xl font-semibold mb-4">{categoria}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {lista.map((video) => {
                  const esFavorito = favoritos.some((f) => f.id === video.id);
                  return (
                    <div
                      key={video.id}
                      className="relative bg-[#1f1f1f] rounded-xl overflow-hidden aspect-video hover:scale-105 transition-transform shadow-md"
                    >
                      <button
                        onClick={() => toggleFavorito(video)}
                        className="absolute top-2 right-2 bg-black/40 hover:bg-black/70 rounded-full p-2 transition"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            esFavorito
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-white"
                          }`}
                        />
                      </button>

                      <video
                        src={video.video_files?.[0]?.link}
                        controls
                        muted
                        className="w-full h-full object-cover"
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </main>
    </div>
  );
};
