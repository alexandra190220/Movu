import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Play,
  Pause,
  Square,
  Maximize2,
  Volume2,
  VolumeX,
} from "lucide-react";

interface VideoState {
  video: any;
}

export const VideoPage: React.FC = () => {
  const location = useLocation();
  const { video } = location.state as VideoState;
  const videoRef = useRef<HTMLVideoElement>(null);

  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const handlePlay = () => videoRef.current?.play();
  const handlePause = () => videoRef.current?.pause();

  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleFullscreen = () => {
    const videoEl = videoRef.current;
    if (videoEl) {
      if (videoEl.requestFullscreen) {
        videoEl.requestFullscreen();
      } else if ((videoEl as any).webkitRequestFullscreen) {
        (videoEl as any).webkitRequestFullscreen();
      } else if ((videoEl as any).mozRequestFullScreen) {
        (videoEl as any).mozRequestFullScreen();
      } else if ((videoEl as any).msRequestFullscreen) {
        (videoEl as any).msRequestFullscreen();
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMute = !isMuted;
      setIsMuted(newMute);
      videoRef.current.muted = newMute;
    }
  };

  return (
    <div className="min-h-screen bg-[#1f2226] text-white flex flex-col items-center p-6">
      {/* Título del video */}
      <h1 className="text-3xl font-bold mb-2 text-center">
        {video?.user?.name || "Autor desconocido"}
      </h1>
      <p className="text-gray-300 mb-6 text-center text-lg italic">
        {video?.video_files?.[0]?.name ||
          video?.alt ||
          "Título del video no disponible"}
      </p>

      {/* Video */}
      <div className="relative w-full max-w-3xl">
        <video
          ref={videoRef}
          src={video.video_files?.[0]?.link}
          controls={false}
          className="w-full h-[60vh] object-contain rounded-lg shadow-lg mb-4"
        />
      </div>

      {/* Controles personalizados */}
      <div className="flex flex-wrap gap-4 items-center justify-center bg-[#2b2f33] p-4 rounded-xl shadow-lg mt-2 w-full max-w-3xl">
        <button
          onClick={handlePlay}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg shadow-md transition-all"
        >
          <Play size={20} /> Reproducir
        </button>

        <button
          onClick={handlePause}
          className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg shadow-md transition-all"
        >
          <Pause size={20} /> Pausar
        </button>

        <button
          onClick={handleStop}
          className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg shadow-md transition-all"
        >
          <Square size={20} /> Parar
        </button>

        <button
          onClick={handleFullscreen}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md transition-all"
        >
          <Maximize2 size={20} /> Pantalla completa
        </button>

        {/* Control de volumen */}
        <div className="flex items-center gap-3 bg-[#3a3f45] px-4 py-2 rounded-lg">
          <button onClick={toggleMute}>
            {isMuted || volume === 0 ? (
              <VolumeX size={22} className="text-gray-300" />
            ) : (
              <Volume2 size={22} className="text-gray-300" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-24 accent-red-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
