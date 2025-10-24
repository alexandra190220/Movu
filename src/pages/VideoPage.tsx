// src/pages/VideoPage.tsx
import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface VideoState {
  video: any;
}

export const VideoPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { video } = location.state as VideoState;

  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => videoRef.current?.play();
  const handlePause = () => videoRef.current?.pause();
  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div className="min-h-screen bg-[#2b2f33] text-white flex flex-col items-center p-6">
      {/* Botón volver */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 self-start mb-4 text-white hover:text-red-500 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver
      </button>

      <h1 className="text-2xl font-semibold mb-4">{video.user?.name}</h1>

      {/* Video */}
      <video
        ref={videoRef}
        src={video.video_files?.[0]?.link}
        controls={false} // ocultamos controles nativos
        className="w-full max-w-4xl rounded-lg shadow-lg mb-4"
      />

      {/* Controles */}
      <div className="flex gap-4">
        <button
          onClick={handlePlay}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
        >
          Reproducir
        </button>
        <button
          onClick={handlePause}
          className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded"
        >
          Pausar
        </button>
        <button
          onClick={handleStop}
          className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
        >
          Parar
        </button>
      </div>
    </div>
  );
};