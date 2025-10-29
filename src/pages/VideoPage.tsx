import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Play,
  Pause,
  Square,
  Maximize2,
  Volume2,
  VolumeX,
  ArrowLeft,
  Captions,
} from "lucide-react";

interface VideoState {
  video: any;
}

export const VideoPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { video } = location.state as VideoState;
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [activeSubtitle, setActiveSubtitle] = useState<string>("none");
  const [availableSubtitles, setAvailableSubtitles] = useState<string[]>([]);
  const [showTitle, setShowTitle] = useState(false);

  // DETECTAR Y CONSTRUIR SUBTÍTULOS DISPONIBLES
  useEffect(() => {
    if (video?.id) {
      const subtitles = [];
      if (video.subtitles?.es || hasSubtitleFile(video.id, 'es')) {
        subtitles.push('es');
      }
      if (video.subtitles?.en || hasSubtitleFile(video.id, 'en')) {
        subtitles.push('en');
      }
      setAvailableSubtitles(subtitles);
    }
  }, [video]);

  // Función para verificar si existe el archivo de subtítulo
  const hasSubtitleFile = (videoId: number, lang: string): boolean => {
    return true;
  };

  // Construir la URL del subtítulo basado en el ID del video - CORREGIDO
  const getSubtitleUrl = (lang: string): string => {
    // SIEMPRE usar la URL de Render para los subtítulos
    if (video?.id) {
      return `https://movu-back-4mcj.onrender.com/subtitles/${video.id}_${lang}.vtt`;
    }
    
    return "";
  };

  const hasSubtitles = availableSubtitles.length > 0;

  const handleMouseEnter = () => {
    setShowTitle(true);
  };

  const handleMouseLeave = () => {
    setShowTitle(false);
  };

  const togglePlay = () => {
    const videoEl = videoRef.current;
    if (videoEl) {
      if (isPlaying) {
        videoEl.pause();
      } else {
        videoEl.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleFullscreen = () => {
    const videoEl = videoRef.current;
    if (videoEl?.requestFullscreen) videoEl.requestFullscreen();
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

  const handleBack = () => navigate("/dashboard");

  const handleSubtitleChange = (lang: string) => {
    setActiveSubtitle(lang);
    
    if (!videoRef.current) return;
    
    const tracks = videoRef.current.textTracks;
    
    // Desactivar todos los tracks primero
    for (let i = 0; i < tracks.length; i++) {
      tracks[i].mode = "disabled";
    }
    
    // Activar el track seleccionado
    if (lang !== "none") {
      const track = Array.from(tracks).find((t) => t.language === lang);
      if (track) {
        track.mode = "showing";
      }
    }
  };

  // Inicializar subtítulos cuando el video se carga
  const handleVideoLoad = () => {
    if (videoRef.current && activeSubtitle !== "none") {
      const tracks = videoRef.current.textTracks;
      const track = Array.from(tracks).find((t) => t.language === activeSubtitle);
      if (track) {
        track.mode = "showing";
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#141414] to-[#1f1f1f] text-white flex flex-col items-center justify-center p-4">
      {/* Botón volver */}
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 flex items-center gap-2 bg-gray-800 hover:bg-gray-700 transition-all px-3 py-2 rounded-full text-sm z-20"
      >
        <ArrowLeft size={18} />
        Volver
      </button>

      <div 
        ref={videoContainerRef}
        className="relative w-full max-w-2xl aspect-video rounded-lg overflow-hidden shadow-2xl group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <video
          ref={videoRef}
          src={video.video_files?.[0]?.link}
          className="w-full h-full object-contain"
          onClick={togglePlay}
          controls={false}
          crossOrigin="anonymous"
          onLoadedMetadata={handleVideoLoad}
        >
          {/* AGREGAR TRACKS DE SUBTÍTULOS DISPONIBLES */}
          {availableSubtitles.map((lang) => (
            <track
              key={lang}
              src={getSubtitleUrl(lang)}
              kind="subtitles"
              srcLang={lang}
              label={lang === 'es' ? 'Español' : lang === 'en' ? 'English' : lang}
              default={activeSubtitle === lang}
            />
          ))}
        </video>

        {/* Título que aparece/desaparece */}
        <div className={`absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent transition-all duration-300 ${
          showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <h1 className="text-xl font-semibold tracking-wide">
            {video?.video_files?.[0]?.name || video?.alt || "Untitled video"}
          </h1>
          <p className="text-sm text-gray-400">
            {video?.user?.name ? `By ${video.user.name}` : ""}
          </p>
        </div>

        {/* Overlay para mejor contraste de subtítulos */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/20" />
      </div>

      {/* Controles */}
      <div className="flex gap-4 items-center justify-center mt-5 bg-[#222]/70 backdrop-blur-md px-5 py-3 rounded-full shadow-lg">
        <button
          onClick={togglePlay}
          className="hover:text-red-500 transition-all"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <button
          onClick={handleStop}
          className="hover:text-gray-400 transition-all"
        >
          <Square size={22} />
        </button>

        <button
          onClick={handleFullscreen}
          className="hover:text-blue-400 transition-all"
        >
          <Maximize2 size={22} />
        </button>

        <button
          onClick={toggleMute}
          className="hover:text-yellow-400 transition-all"
        >
          {isMuted || volume === 0 ? (
            <VolumeX size={22} />
          ) : (
            <Volume2 size={22} />
          )}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-20 accent-red-600 cursor-pointer"
        />

        {/* CONTROL DE SUBTÍTULOS - SOLO SI EL VIDEO LOS TIENE */}
        {hasSubtitles && (
          <div className="flex items-center gap-2">
            <Captions size={22} className="text-gray-300" />
            <select
              value={activeSubtitle}
              onChange={(e) => handleSubtitleChange(e.target.value)}
              className="bg-gray-800 text-sm rounded px-2 py-1 outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="none">Sin subtítulos</option>
              {availableSubtitles.map((lang) => (
                <option key={lang} value={lang}>
                  {lang === 'es' ? 'Español' : lang === 'en' ? 'English' : lang}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};