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

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

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
    if (videoEl) {
      if (videoEl.requestFullscreen) videoEl.requestFullscreen();
      else if ((videoEl as any).webkitRequestFullscreen)
        (videoEl as any).webkitRequestFullscreen();
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
    <div className="min-h-screen bg-gradient-to-b from-black via-[#141414] to-[#1f1f1f] text-white flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-3xl aspect-video rounded-lg overflow-hidden shadow-2xl group">
        {/* Video */}
        <video
          ref={videoRef}
          src={video.video_files?.[0]?.link}
          className="w-full h-full object-contain"
          onClick={togglePlay}
        />

        {/* Overlay con título */}
        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
          <h1 className="text-xl font-semibold tracking-wide">
            {video?.video_files?.[0]?.name || video?.alt || "Video sin título"}
          </h1>
          <p className="text-sm text-gray-400">
            {video?.user?.name ? `Por ${video.user.name}` : ""}
          </p>
        </div>
      </div>

      {/* Controles */}
      <div className="flex gap-5 items-center justify-center mt-5 bg-[#222]/70 backdrop-blur-md px-5 py-3 rounded-full shadow-lg">
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

        <button onClick={toggleMute} className="hover:text-yellow-400 transition-all">
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
      </div>
    </div>
  );
};
