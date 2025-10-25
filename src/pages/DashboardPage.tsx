import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export const DashboardPage: React.FC = () => {
  const [videos, setVideos] = useState<{ [key: string]: any[] }>({});
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [animando, setAnimando] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const navigate = useNavigate();
  const API_URL = "https://movu-back-4mcj.onrender.com/api/v1/pexels";

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

  const buscarVideos = async (termino: string) => {
    if (!termino.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/videos/search?query=${encodeURIComponent(
          termino
        )}&per_page=10`
      );
      const data = await res.json();
      setVideos({ Resultado: data.videos || [] });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleClickVideo = (video: any) => {
    navigate("/video", { state: { video } });
  };

  return (
    <div className="min-h-screen bg-[#2b2f33] text-white flex flex-col relative">
      <Navbar buscarVideos={buscarVideos} />

      <main className="flex-grow px-6 pt-14 pb-10">
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
                    const tooltipText = esFavorito
                      ? "Quitar de favoritos"
                      : "Añadir a favoritos";

                    return (
                      <div
                        key={video.id}
                        className="relative bg-[#1f1f1f] rounded-xl overflow-hidden hover:scale-105 transition-transform shadow-md cursor-pointer"
                      >
                        {/* Botón favorito con tooltip */}
                        <div
                          onMouseEnter={() => setHoveredId(video.id)}
                          onMouseLeave={() => setHoveredId(null)}
                          className="absolute top-2 right-2 z-20"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorito(video);
                            }}
                            aria-label={tooltipText} // accesible para lectores de pantalla
                            className={`p-2 rounded-full bg-black/40 hover:bg-black/70 transition-transform relative ${
                              latido ? "animate-pulse scale-125" : ""
                            }`}
                          >
                            {esFavorito ? (
                              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                            ) : (
                              <Heart
                                className="w-5 h-5 text-white"
                                fill="none"
                              />
                            )}
                          </button>

                          {/* Tooltip */}
                          {hoveredId === video.id && (
                            <span className="absolute right-10 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap">
                              {tooltipText}
                            </span>
                          )}
                        </div>

                        {/* Imagen del video */}
                        <div
                          onClick={() => handleClickVideo(video)}
                          className="relative bg-[#1f1f1f] rounded-xl overflow-hidden hover:scale-105 transition-transform shadow-md w-full h-64 sm:h-80 md:h-96 cursor-pointer"
                        >
                          <img
                            src={
                              video.image || video.video_pictures?.[0]?.picture
                            }
                            alt="thumbnail"
                            className="w-full h-full object-cover"
                          />
                        </div>
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
