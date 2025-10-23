import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Navbar } from "../components/Navbar";

export const DashboardPage: React.FC = () => {
  const [videos, setVideos] = useState<{ [key: string]: any[] }>({});
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [animando, setAnimando] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState<string>("");

  const API_URL = "https://movu-back-4mcj.onrender.com/api/v1/pexels";

  // Cargar favoritos al iniciar
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

    if (!existe) {
      setAnimando(video.id);
      setTimeout(() => setAnimando(null), 300);
    }
  };

  // Cargar videos por categoría
  const loadVideosByCategory = async () => {
    const categorias = ["Terror", "Acción", "Naturaleza", "Animales"];
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

  // 🔹 Buscar videos desde backend
  const buscarVideos = async () => {
    if (!busqueda.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/videos/search?query=${encodeURIComponent(
          busqueda
        )}&per_page=10`
      );
      const data = await res.json();
      setVideos({ Resultado: data.videos || [] }); // mostramos bajo categoría "Resultado"
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Permitir buscar con Enter
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      buscarVideos();
    }
  };

  return (
    <div className="min-h-screen bg-[#2b2f33] text-white flex flex-col relative">
      <Navbar />

      <main className="flex-grow px-6 pt-28 pb-10">
        {/* 🔹 Input de búsqueda visible */}
        {/* 🔹 Input de búsqueda y botón */}
        <div className="mb-6 flex flex-col md:flex-row items-center gap-3">
          <input
            type="text"
            placeholder="Buscar video..."
            className="w-full md:w-1/3 p-2 rounded-l-lg text-black text-base border-2 border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            onClick={buscarVideos}
            className="px-5 py-2 bg-red-500 text-white rounded-r-lg font-semibold hover:bg-red-600 transition"
          >
            Buscar
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-400 mt-10">Cargando videos...</p>
        ) : (
          Object.entries(videos).map(([categoria, lista]) => {
            if (!lista || lista.length === 0) return null;

            return (
              <section key={categoria} className="mb-10">
                <h2 className="text-xl font-semibold mb-4">{categoria}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {lista.map((video) => {
                    const esFavorito = favoritos.some((f) => f.id === video.id);
                    const latido = animando === video.id;

                    return (
                      <div
                        key={video.id}
                        className="relative bg-[#1f1f1f] rounded-xl overflow-hidden hover:scale-105 transition-transform shadow-md w-full h-64 sm:h-80 md:h-96"
                      >
                        {/* Botón favorito */}
                        <button
                          onClick={() => toggleFavorito(video)}
                          className={`absolute top-2 right-2 z-20 p-2 rounded-full bg-black/40 hover:bg-black/70 transition-transform ${
                            latido ? "animate-pulse scale-125" : ""
                          }`}
                        >
                          {esFavorito ? (
                            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                          ) : (
                            <Heart className="w-5 h-5 text-white" fill="none" />
                          )}
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
            );
          })
        )}
      </main>
    </div>
  );
};
