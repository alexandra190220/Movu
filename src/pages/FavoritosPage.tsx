import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { FavoriteService } from "../Services/FavoriteService";

export const FavoritosPage: React.FC = () => {
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [animando, setAnimando] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      const storedUserId = localStorage.getItem("userId");
      if (!storedUserId) return;
      setUserId(storedUserId);

      try {
        const favs = await FavoriteService.getFavorites(storedUserId);

        // Cada favorito ya tiene videoData completo
        const favoritosMapeados = favs.map((f: any) => ({
          ...f.videoData,
          id: f.videoId, // aseguramos que tenga id
        }));

        setFavoritos(favoritosMapeados);
      } catch (error) {
        console.error("Error cargando favoritos:", error);
      }
    };

    fetchFavorites();
  }, []);

  const eliminarFavorito = async (video: any) => {
    if (!userId) return;

    try {
      await FavoriteService.removeFavorite(userId, video.id);
      setFavoritos(favoritos.filter((f) => f.id !== video.id));
      setAnimando(video.id);
      setTimeout(() => setAnimando(null), 200);
    } catch (error) {
      console.error("Error eliminando favorito:", error);
    }
  };

  const verVideo = (video: any) => {
    navigate("/video", { state: { video } });
  };

  if (favoritos.length === 0)
    return (
      <div className="min-h-screen bg-[#2b2f33] text-white flex flex-col relative">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-gray-300">No tienes videos favoritos aún.</p>
        </main>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#2b2f33] text-white flex flex-col relative">
      <Navbar />
      <main className="flex-grow px-6 pt-14 pb-10">
        <h2 className="text-xl font-semibold mb-4">Mis Favoritos</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {favoritos.map((video) => {
            const latido = animando === video.id;
            const thumbnail =
              video.image || video.video_pictures?.[0]?.picture || "";
            const tooltipText = "Quitar de favoritos";

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
                    onClick={() => verVideo(video)}
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
                      eliminarFavorito(video);
                    }}
                    aria-label={tooltipText}
                    className={`p-2 rounded-full bg-black/50 hover:bg-[#2f3338] transition-all duration-200 relative focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      latido ? "animate-pulse scale-125" : ""
                    }`}
                  >
                    <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                  </button>

                  {hoveredId === video.id && (
                    <span
                      role="tooltip"
                      className="absolute right-10 top-1/2 -translate-y-1/2 bg-[#2f3338] text-white text-xs font-medium px-2 py-1 rounded-md shadow-md whitespace-nowrap"
                    >
                      {tooltipText}
                    </span>
                  )}
                </div>

                {/* Título del video */}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent px-2 py-1">
                  <p className="text-sm text-white font-medium truncate">
                    {video.title || "Video sin título"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
