import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { FavoriteService } from "../Services/FavoriteService";

export const DashboardPage: React.FC = () => {
  const [videos, setVideos] = useState<{ [key: string]: any[] }>({});
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [animando, setAnimando] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const navigate = useNavigate();
  const API_URL = "https://movu-back-4mcj.onrender.com/api/v1/pexels";

  // Cargar userId y favoritos del backend
  useEffect(() => {
    const loadUserAndFavorites = async () => {
      const storedUserId = localStorage.getItem("userId");
      if (!storedUserId) return;

      setUserId(storedUserId);

      try {
        const favs = await FavoriteService.getFavorites(storedUserId);
        const favoritosMapeados = favs.map((f: any) => ({
          ...f.videoData,
          id: f.videoId,
        }));
        setFavoritos(favoritosMapeados);
      } catch (err) {
        console.error("Error cargando favoritos:", err);
      }
    };

    loadUserAndFavorites();
  }, []);

  // Toggle favorito
  const toggleFavorito = async (video: any) => {
    if (!userId) return;

    const existe = favoritos.some((f) => f.id === video.id);

    try {
      if (existe) {
        await FavoriteService.removeFavorite(userId, video.id);
        setFavoritos(favoritos.filter((f) => f.id !== video.id));
      } else {
        await FavoriteService.addFavorite(userId, video.id, video);
        setFavoritos([...favoritos, video]);
        setAnimando(video.id);
        setTimeout(() => setAnimando(null), 300);
      }
    } catch (error) {
      console.error("Error al actualizar favorito:", error);
    }
  };

  // Cargar videos por categoría
  const loadVideosByCategory = async () => {
    const categorias = ["Terror", "Naturaleza", "Animales", "Acción"];
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

  // Buscar videos
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
    <div className="min-h-screen bg-[#2b2f33] text-gray-100 flex flex-col relative">
      <Navbar buscarVideos={buscarVideos} />

      <main className="flex-grow px-6 pt-14 pb-10">
        {loading ? (
          <p className="text-center text-gray-300 mt-10">Cargando videos...</p>
        ) : (
          Object.entries(videos).map(([categoria, lista]) => {
            if (!lista || lista.length === 0) return null;

            return (
              <section key={categoria} className="mb-10">
                <h2 className="text-xl font-semibold mb-4 text-gray-100">
                  {categoria}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {lista.map((video) => {
                    const esFavorito = favoritos.some((f) => f.id === video.id);
                    const latido = animando === video.id;
                    const tooltipText = esFavorito
                      ? "Quitar de favoritos"
                      : "Añadir a favoritos";
                    const thumbnail =
                      video.image || video.video_pictures?.[0]?.picture || "";

                    return (
                      <div
                        key={video.id}
                        className="relative bg-[#1f1f1f] rounded-xl overflow-hidden hover:scale-105 transition-transform shadow-md cursor-pointer group"
                      >
                        <div className="w-full aspect-video">
                          <img
                            src={thumbnail}
                            alt={video.alt || "Miniatura del video"}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:opacity-80 group-hover:scale-105"
                            onClick={() => handleClickVideo(video)}
                          />
                        </div>

                        {/* Botón de favorito */}
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
                            aria-label={tooltipText}
                            className={`p-2 rounded-full bg-black/50 hover:bg-[#2f3338] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 relative ${
                              latido ? "animate-pulse scale-125" : ""
                            }`}
                          >
                            {esFavorito ? (
                              <Heart className="w-6 h-6 text-red-400 fill-red-400" />
                            ) : (
                              <Heart
                                className="w-6 h-6 text-gray-100"
                                fill="none"
                              />
                            )}
                          </button>

                          {hoveredId === video.id && (
                            <span
                              role="tooltip"
                              className="absolute right-10 top-1/2 -translate-y-1/2 bg-[#2f3338] text-gray-100 text-xs font-medium px-2 py-1 rounded-md shadow-md whitespace-nowrap"
                            >
                              {tooltipText}
                            </span>
                          )}
                        </div>

                        {/* Título del video */}
                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent px-2 py-1">
                          <p className="text-sm sm:text-base text-gray-100 font-medium truncate">
                            {video.title || "Video sin título"}
                          </p>
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
