import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { FavoriteService } from "../Services/FavoriteService";
import { API_URL } from "../Services/AuthService";

export const DashboardPage: React.FC = () => {
  const [videos, setVideos] = useState<{ [key: string]: any[] }>({});
  const [videosConSubtitulos, setVideosConSubtitulos] = useState<string[]>([]);
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [animando, setAnimando] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const navigate = useNavigate();
  const PEXELS_API_URL = "https://movu-back-4mcj.onrender.com/api/v1/pexels";

  useEffect(() => {
    const loadUserAndFavorites = async () => {
      const storedUserId = localStorage.getItem("userId");
      if (!storedUserId) return;
      setUserId(storedUserId);

      try {
        const favs = await FavoriteService.getFavorites(storedUserId);
        const mappedFavorites = favs.map((f: any) => ({
          ...f.videoData,
          id: f.videoId,
        }));
        setFavoritos(mappedFavorites);
      } catch (err) {
        console.error("Error loading favorites:", err);
      }
    };

    loadUserAndFavorites();
  }, []);

  // Cargar lista de videos con subtítulos en BD
  const loadVideosConSubtitulos = async () => {
    try {
      const response = await fetch(`${API_URL}/videos`);
      if (response.ok) {
        const videosBD = await response.json();
        const idsConSubtitulos = videosBD.map((video: any) => video.pexelsId);
        setVideosConSubtitulos(idsConSubtitulos);
      }
    } catch (error) {
      console.error("Error cargando videos con subtítulos:", error);
    }
  };

  const toggleFavorito = async (video: any) => {
    if (!userId) return;

    const exists = favoritos.some((f) => f.id === video.id);

    try {
      if (exists) {
        await FavoriteService.removeFavorite(userId, video.id);
        setFavoritos(favoritos.filter((f) => f.id !== video.id));
      } else {
        await FavoriteService.addFavorite(userId, video.id, video);
        setFavoritos([...favoritos, video]);
        setAnimando(video.id);
        setTimeout(() => setAnimando(null), 300);
      }
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  const loadVideosByCategory = async () => {
    const categorias = ["Terror", "Naturaleza", "Animales", "Acción"];
    const result: any = {};
    setLoading(true);

    await loadVideosConSubtitulos();

    for (const cat of categorias) {
      try {
        const res = await fetch(
          `${PEXELS_API_URL}/videos/search?query=${encodeURIComponent(cat)}&per_page=4`
        );
        const data = await res.json();

        const videosEnriquecidos =
          data.videos?.map((video: any) => {
            if (videosConSubtitulos.includes(video.id.toString())) {
              return { ...video, tieneSubtitulos: true };
            }
            return video;
          }) || [];

        result[cat] = videosEnriquecidos;
      } catch (err) {
        console.error("Error loading category:", cat, err);
        result[cat] = [];
      }
    }

    setVideos(result);
    setLoading(false);
  };

  useEffect(() => {
    loadVideosByCategory();
  }, []);

  const buscarVideos = async (termino: string) => {
    if (!termino.trim()) {
      loadVideosByCategory();
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${PEXELS_API_URL}/videos/search?query=${encodeURIComponent(
          termino
        )}&per_page=10`
      );
      const data = await res.json();

      const videosEnriquecidos =
        data.videos?.map((video: any) => {
          if (videosConSubtitulos.includes(video.id.toString())) {
            return { ...video, tieneSubtitulos: true };
          }
          return video;
        }) || [];

      setVideos({ Resultado: videosEnriquecidos });
    } catch (err) {
      console.error(err);
      setVideos({ Resultado: [] });
    }
    setLoading(false);
  };

  const handleClickVideo = async (video: any) => {
    if (video.tieneSubtitulos) {
      try {
        const videoCompletoRes = await fetch(`${API_URL}/videos/${video.id}`);
        if (videoCompletoRes.ok) {
          const videoCompleto = await videoCompletoRes.json();
          const videoConSubtitulos = {
            ...video,
            subtitles: videoCompleto.subtitles,
          };
          navigate("/video", { state: { video: videoConSubtitulos } });
          return;
        }
      } catch (error) {
        console.error("Error obteniendo subtítulos:", error);
      }
    }

    navigate("/video", { state: { video } });
  };

  return (
    <div className="min-h-screen bg-[#2b2f33] text-gray-100 flex flex-col relative">
      <Navbar searchVideos={buscarVideos} />

      <main className="flex-grow px-4 sm:px-6 pt-12 pb-8">
        {loading ? (
          <p
            className="text-center text-gray-300 mt-10"
            role="status"
            aria-live="polite"
          >
            Cargando videos...
          </p>
        ) : (
          Object.entries(videos).map(([categoria, lista]) => {
            if (!lista || lista.length === 0) return null;

            return (
              <section key={categoria} className="mb-8">
                <h2
                  className="text-lg sm:text-xl font-semibold mb-3 text-gray-100"
                  id={`categoria-${categoria}`}
                >
                  {categoria}
                </h2>

                <div
                  className="
                    grid 
                    grid-cols-1 
                    sm:grid-cols-2 
                    md:grid-cols-3 
                    lg:grid-cols-4 
                    xl:grid-cols-5 
                    gap-4
                  "
                  role="list"
                  aria-labelledby={`categoria-${categoria}`}
                >
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
                        role="listitem"
                        className="
                          relative 
                          bg-[#1f1f1f] 
                          rounded-xl 
                          overflow-hidden 
                          hover:scale-[1.02] 
                          transition-transform 
                          shadow-md 
                          cursor-pointer 
                          group
                        "
                      >
                        <div className="w-full aspect-[16/10]">
                          <img
                            src={thumbnail}
                            alt={video.alt || "Miniatura del video"}
                            className="
                              w-full h-full 
                              object-cover 
                              transition-transform 
                              duration-300 
                              group-hover:opacity-80 
                              group-hover:scale-105
                            "
                            onClick={() => handleClickVideo(video)}
                            role="button"
                            aria-label={`Ver detalles del video: ${
                              video.title || "sin título"
                            }`}
                            tabIndex={0}
                          />
                        </div>

                        {video.tieneSubtitulos && (
                          <div className="absolute top-2 left-2 z-10">
                            <span className="bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-md font-medium">
                              Subtítulos
                            </span>
                          </div>
                        )}

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
                            title={tooltipText}
                            className={`
                              p-2.5 
                              rounded-full 
                              bg-black/50 
                              hover:bg-[#2f3338] 
                              transition-all 
                              duration-200 
                              focus:outline-none 
                              focus:ring-2 
                              focus:ring-red-500 
                              relative 
                              ${latido ? "animate-pulse scale-110" : ""}
                            `}
                            style={{ minWidth: "40px", minHeight: "40px" }}
                          >
                            {esFavorito ? (
                              <Heart className="w-5 h-5 text-red-400 fill-red-400" />
                            ) : (
                              <Heart
                                className="w-5 h-5 text-gray-100"
                                fill="none"
                              />
                            )}
                          </button>

                          {hoveredId === video.id && (
                            <span
                              role="tooltip"
                              className="
                                absolute 
                                right-10 
                                top-1/2 
                                -translate-y-1/2 
                                bg-[#2f3338] 
                                text-gray-100 
                                text-xs 
                                font-medium 
                                px-2 
                                py-1 
                                rounded-md 
                                shadow-md 
                                whitespace-nowrap
                              "
                            >
                              {tooltipText}
                            </span>
                          )}
                        </div>

                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent px-2 py-1">
                          <p className="text-xs sm:text-sm text-gray-100 font-medium truncate">
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
