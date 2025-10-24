import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Navbar } from "../components/Navbar";

export const FavoritosPage: React.FC = () => {
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [animando, setAnimando] = useState<string | null>(null);

  // Cargar favoritos al iniciar
  useEffect(() => {
    const favs = localStorage.getItem("favoritos");
    if (favs) setFavoritos(JSON.parse(favs));
  }, []);

  // Función para eliminar de favoritos
  const eliminarFavorito = (video: any) => {
    const nuevos = favoritos.filter((f) => f.id !== video.id);
    setFavoritos(nuevos);
    localStorage.setItem("favoritos", JSON.stringify(nuevos));

    // Animación de latido al eliminar
    setAnimando(video.id);
    setTimeout(() => setAnimando(null), 200);
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favoritos.map((video) => {
            const latido = animando === video.id;

            return (
              <div
                key={video.id}
                className="relative bg-[#1f1f1f] rounded-xl overflow-hidden hover:scale-105 transition-transform shadow-md w-full h-64 sm:h-80 md:h-96"
              >
                {/* Botón para eliminar de favoritos */}
                <button
                  onClick={() => eliminarFavorito(video)}
                  className={`absolute top-2 right-2 z-20 p-2 rounded-full bg-black/40 hover:bg-black/70 transition-transform ${
                    latido ? "animate-pulse scale-125" : ""
                  }`}
                >
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
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
      </main>
    </div>
  );
};
