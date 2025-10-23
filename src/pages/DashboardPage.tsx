import React, { useState, useEffect } from "react";
import { Star, Heart } from "lucide-react";
import { Navbar } from "../components/Navbar";

export const DashboardPage: React.FC = () => {
  const [videos, setVideos] = useState<{ [key: string]: any[] }>({});
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://movu-back-4mcj.onrender.com/api/v1/pexels";

  // 🔹 Cargar favoritos guardados al iniciar
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

  // 🔹 Cargar videos por categoría
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
      <Navbar />

      <main className="flex-grow px-6 pt-28 pb-10">
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
                        className="absolute top-2 right-2 p-2 transition rounded-full bg-black/40 hover:bg-black/70"
                      >
                        {esFavorito ? (
                          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                        ) : (
                          <Star className="w-5 h-5 text-white" />
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
          ))
        )}
      </main>
    </div>
  );
};
