import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { Navbar } from "../components/Navbar";

export const FavoritosPage: React.FC = () => {
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [animando, setAnimando] = useState<string | null>(null);
  const navigate = useNavigate();

  // Cargar favoritos al iniciar
  useEffect(() => {
    const favs = localStorage.getItem("favoritos");
    if (favs) setFavoritos(JSON.parse(favs));
  }, []);

  // Eliminar de favoritos
  const eliminarFavorito = (video: any) => {
    const nuevos = favoritos.filter((f) => f.id !== video.id);
    setFavoritos(nuevos);
    localStorage.setItem("favoritos", JSON.stringify(nuevos));

    setAnimando(video.id);
    setTimeout(() => setAnimando(null), 200);
  };

  // Ir al VideoPage
  const verVideo = (video: any) => {
    navigate("/video", { state: { video } });
  };

  if (favoritos.length === 0)
    return (
      <div className="min-h-screen bg-[#2b2f33] text-white flex flex-col relative">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-gray-400">No tienes videos favoritos aún.</p>
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

            return (
              <div
                key={video.id}
                className="relative bg-[#1f1f1f] rounded-xl overflow-hidden hover:scale-105 transition-transform shadow-md cursor-pointer group"
              >
                {/* Imagen del video */}
                <img
                  src={thumbnail}
                  alt={video.alt || "Miniatura del video"}
                  className="w-full h-48 sm:h-56 object-cover transition-opacity duration-300 group-hover:opacity-80"
                  onClick={() => verVideo(video)}
                />

                {/* Botón de corazón */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // evita abrir el video al quitar favorito
                    eliminarFavorito(video);
                  }}
                  className={`absolute top-2 right-2 z-20 p-2 rounded-full bg-black/40 hover:bg-black/70 transition-transform ${
                    latido ? "animate-pulse scale-125" : ""
                  }`}
                >
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
