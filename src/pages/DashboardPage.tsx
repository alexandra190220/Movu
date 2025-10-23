import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Navbar } from "../components/Navbar";

/**
 * Catálogo con categorías tipo Netflix
 */
export const DashboardPage: React.FC = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [videos, setVideos] = useState<{ [key: string]: any[] }>({});
  const [favoritos, setFavoritos] = useState<any[]>([]);

  const API_URL = "https://movu-back-4mcj.onrender.com/api/v1/pexels";

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  /** Cargar favoritos guardados */
  useEffect(() => {
    const favs = localStorage.getItem("favoritos");
    if (favs) setFavoritos(JSON.parse(favs));
  }, []);

  /** Guardar favoritos */
  const guardarFavoritos = (nuevosFavs: any[]) => {
    setFavoritos(nuevosFavs);
    localStorage.setItem("favoritos", JSON.stringify(nuevosFavs));
  };

  /** Agregar o quitar de favoritos */
  const toggleFavorito = (video: any) => {
    const existe = favoritos.some((f) => f.id === video.id);
    const nuevosFavs = existe
      ? favoritos.filter((f) => f.id !== video.id)
      : [...favoritos, video];
    guardarFavoritos(nuevosFavs);
  };

  /** Cargar categorías (simulado con diferentes búsquedas en Pexels) */
  const loadVideosByCategory = async () => {
    const categorias = ["Comedia", "Terror", "Acción"];
    const resultado: any = {};

    for (const cat of categorias) {
      try {
        const res = await fetch(
          `${API_URL}/videos/search?query=${encodeURIComponent(cat)}&per_page=6`
        );
        const data = await res.json();
        resultado[cat] = data.videos || [];
      } catch (err) {
        console.error("Error cargando categoría:", cat, err);
      }
    }

    setVideos(resultado);
  };

  useEffect(() => {
    loadVideosByCategory();
  }, []);

  return (
    <div className="min-h-screen bg-[#2b2f33] text-white flex flex-col relative">
      {/* NAVBAR */}
      <Navbar />

      {/* BOTÓN MENÚ */}
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

      {/* OVERLAY */}
      {menuAbierto && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={toggleMenu}
        />
      )}

      {/* MENÚ LATERAL */}
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
          <a
            href="#catalogo"
            className="text-white hover:bg-[#4a4f55] rounded-lg px-3 py-2 transition"
            onClick={toggleMenu}
          >
            📺 Catálogo
          </a>
          <a
            href="#favoritos"
            className="text-white hover:bg-[#4a4f55] rounded-lg px-3 py-2 transition"
            onClick={toggleMenu}
          >
            ⭐ Favoritos
          </a>
        </nav>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-grow px-8 py-8 space-y-10">
        {/* Encabezado */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-400 rounded-md" /> {/* Logo */}
            <h1 className="text-2xl font-semibold">Catálogo</h1>
          </div>
          <div className="flex gap-5 text-gray-300">
            <span className="font-bold text-white">Catálogo</span>
            <span className="hover:text-white cursor-pointer">Favoritos</span>
          </div>
        </header>

        {/* Secciones por categoría */}
        {Object.entries(videos).map(([categoria, lista]) => (
          <section key={categoria}>
            <h2 className="text-xl font-semibold mb-4">{categoria}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {lista.map((video) => {
                const esFavorito = favoritos.some((f) => f.id === video.id);
                return (
                  <div
                    key={video.id}
                    className="relative bg-[#1f1f1f] rounded-xl overflow-hidden aspect-video hover:scale-105 transition-transform shadow-md"
                  >
                    <button
                      onClick={() => toggleFavorito(video)}
                      className="absolute top-2 right-2 bg-black/40 hover:bg-black/60 rounded-full p-2 transition"
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
                      loop
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};
