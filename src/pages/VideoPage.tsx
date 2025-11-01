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
  Send,
  Edit3,
  Trash2,
  Star,
} from "lucide-react";

interface VideoState {
  playing: boolean;
  muted: boolean;
  progress: number;
  duration: number;
  volume: number;
}

const VideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [videoState, setVideoState] = useState<VideoState>({
    playing: false,
    muted: false,
    progress: 0,
    duration: 0,
    volume: 1,
  });
  const [showControls, setShowControls] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (videoState.playing) {
      video.pause();
    } else {
      video.play();
    }
    setVideoState({ ...videoState, playing: !videoState.playing });
  };

  const handleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !videoState.muted;
    setVideoState({ ...videoState, muted: !videoState.muted });
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    const progress = (video.currentTime / video.duration) * 100;
    setVideoState({ ...videoState, progress });
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * video.duration;
    video.currentTime = newTime;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const volume = parseFloat(e.target.value);
    video.volume = volume;
    setVideoState({ ...videoState, volume });
  };

  const handleFullScreen = () => {
    const container = videoContainerRef.current;
    if (container) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        container.requestFullscreen();
      }
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      setVideoState({ ...videoState, duration: video.duration });
    }
  };

  const handleMouseEnter = () => setShowControls(true);
  const handleMouseLeave = () => setShowControls(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white"
      role="main"
      aria-label="Reproductor de video principal"
    >
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 flex items-center text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2"
        aria-label="Regresar a la página anterior"
      >
        <ArrowLeft className="mr-2" aria-hidden="true" />
        Volver
      </button>

      <div
        ref={videoContainerRef}
        className="relative w-full max-w-2xl mx-auto mt-16 rounded-lg overflow-hidden shadow-2xl group aspect-video"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="region"
        aria-label="Área del video"
      >
        <video
          ref={videoRef}
          src={location.state?.videoUrl}
          className="w-full h-full"
          aria-label="Video en reproducción"
          tabIndex={0}
        />

        {showControls && (
          <div
            className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-4 space-y-3 transition-opacity duration-300"
            aria-label="Controles del reproductor de video"
          >
            {/* Barra de progreso */}
            <div
              className="w-full h-2 bg-gray-700 rounded-full cursor-pointer"
              onClick={handleProgressClick}
              aria-label="Barra de progreso"
            >
              <div
                className="h-2 bg-blue-500 rounded-full"
                style={{ width: `${videoState.progress}%` }}
                aria-valuenow={videoState.progress}
                aria-valuemin={0}
                aria-valuemax={100}
                role="progressbar"
              />
            </div>

            {/* Controles */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handlePlayPause}
                  className="p-2 bg-blue-600 rounded-full hover:bg-blue-700 focus:ring-2 focus:ring-white"
                  aria-label={videoState.playing ? "Pausar video" : "Reproducir video"}
                >
                  {videoState.playing ? (
                    <Pause className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <Play className="w-5 h-5" aria-hidden="true" />
                  )}
                </button>

                <button
                  onClick={handleMute}
                  className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 focus:ring-2 focus:ring-white"
                  aria-label={videoState.muted ? "Activar sonido" : "Silenciar video"}
                >
                  {videoState.muted ? (
                    <VolumeX className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <Volume2 className="w-5 h-5" aria-hidden="true" />
                  )}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={videoState.volume}
                  onChange={handleVolumeChange}
                  className="w-24 accent-blue-500 cursor-pointer"
                  aria-label="Control de volumen"
                />
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={handleFullScreen}
                  className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 focus:ring-2 focus:ring-white"
                  aria-label="Pantalla completa"
                >
                  <Maximize2 className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
