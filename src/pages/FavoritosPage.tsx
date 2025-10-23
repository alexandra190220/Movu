import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Navbar } from "../components/Navbar";

export const FavoritosPage: React.FC = () => {
  const [favoritos, setFavoritos] = useState<any[]>([]);

  useEffect(() => {
    const favs = localStorage.getItem("favoritos");
    if (favs) setFavoritos(JSON.parse(favs));
  }, []);

  const toggleFavorito = (video: any) => {
    const nuevos = favoritos.filter((f) => f.id !== video.id);
    setFavoritos(nuevos);
    localStorage.setItem("favoritos", JSON.stringify(nuevos));
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
      <main className="flex-grow px-6 pt-28 pb-10">
        <h2 className="text-xl font-semibold mb-4">Mis Favoritos</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {favoritos.map((video) => (
            <div
              key={video.id}
              className="relative bg-[#1f1f1f] rounded-xl overflow-hidden aspect-video hover:scale-105 transition-transform shadow-md"
            >
              <button
                onClick={() => toggleFavorito(video)}
                className="absolute top-2 right-2 p-2 transition rounded-full bg-black/40 hover:bg-black/70"
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
          ))}
        </div>
      </main>
    </div>
  );
};
