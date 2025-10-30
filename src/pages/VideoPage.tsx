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
  video: any;
}

interface Comment {
  _id: string;
  userId: string;
  videoId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export const VideoPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { video } = location.state as VideoState;
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [activeSubtitle, setActiveSubtitle] = useState<string>("none");
  const [availableSubtitles, setAvailableSubtitles] = useState<string[]>([]);
  const [showTitle, setShowTitle] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingComments, setLoadingComments] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [isRating, setIsRating] = useState<boolean>(false);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const handleBack = () => navigate("/dashboard");

  const togglePlay = () => {
    const videoEl = videoRef.current;
    if (videoEl) {
      if (isPlaying) videoEl.pause();
      else videoEl.play();
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

  useEffect(() => {
    if (video?.id) {
      const subtitles = ["es", "en"];
      setAvailableSubtitles(subtitles);
    }
  }, [video]);

  return (
    <div className="min-h-screen bg-[#1c1e22] text-white p-4">
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 flex items-center gap-2 bg-gray-800 hover:bg-gray-700 transition-all px-3 py-2 rounded-full text-sm z-20"
      >
        <ArrowLeft size={18} />
        Volver
      </button>

      {/* Contenedor principal centrado */}
      <div className="max-w-4xl mx-auto space-y-10 mt-10">

        {/* Video */}
        <div
          className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-lg"
          onMouseEnter={() => setShowTitle(true)}
          onMouseLeave={() => setShowTitle(false)}
        >
          <video
            ref={videoRef}
            src={video.video_files?.[0]?.link}
            className="w-full h-full object-contain"
            onClick={togglePlay}
            controls={false}
          />

          {/* Gradiente inferior con título */}
          <div
            className={`absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent transition-all duration-300 ${
              showTitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <h1 className="text-lg font-semibold">
              {video?.video_files?.[0]?.name || video?.alt || "Video sin título"}
            </h1>
          </div>
        </div>

        {/* Controles de reproducción */}
        <div className="flex flex-wrap justify-center items-center gap-4 bg-[#2b2f33]/80 rounded-full px-6 py-3 shadow-md">
          <button onClick={togglePlay} className="hover:text-red-500 transition-all">
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button onClick={handleStop} className="hover:text-gray-400 transition-all">
            <Square size={22} />
          </button>
          <button onClick={handleFullscreen} className="hover:text-blue-400 transition-all">
            <Maximize2 size={22} />
          </button>
          <button onClick={toggleMute} className="hover:text-yellow-400 transition-all">
            {isMuted || volume === 0 ? <VolumeX size={22} /> : <Volume2 size={22} />}
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
          {availableSubtitles.length > 0 && (
            <div className="flex items-center gap-2">
              <Captions size={22} className="text-gray-300" />
              <select
                value={activeSubtitle}
                onChange={(e) => setActiveSubtitle(e.target.value)}
                className="bg-gray-800 text-sm rounded px-2 py-1 outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="none">Sin subtítulos</option>
                {availableSubtitles.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang === "es" ? "Español" : "English"}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Calificación */}
        <div className="bg-[#24272b] rounded-2xl shadow-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold text-center mb-4">
            Calificar esta película
          </h2>

          <div className="flex justify-center mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setUserRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star
                  size={28}
                  className={`${
                    (hoverRating || userRating) >= star
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-400"
                  }`}
                />
              </button>
            ))}
          </div>

          <p className="text-sm text-center text-gray-400">
            {userRating
              ? `Tu calificación: ${userRating} estrellas`
              : "Selecciona tu calificación"}
          </p>

          <div className="flex justify-center items-center gap-2 mt-4">
            <Star size={20} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xl font-bold">{averageRating}</span>
            <span className="text-gray-400">/5</span>
          </div>
        </div>

        {/* Comentarios */}
        <div className="bg-[#24272b] rounded-2xl shadow-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-center mb-4">
            Comentarios ({comments.length})
          </h2>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe un comentario..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              onClick={() => {
                if (newComment.trim()) {
                  setComments((prev) => [
                    { _id: Date.now().toString(), text: newComment, userId: "1", videoId: video.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
                    ...prev,
                  ]);
                  setNewComment("");
                }
              }}
              className="bg-red-600 hover:bg-red-700 transition-all p-2 rounded-lg"
            >
              <Send size={20} />
            </button>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {comments.length === 0 ? (
              <p className="text-gray-400 text-center">No hay comentarios aún.</p>
            ) : (
              comments.map((c) => (
                <div key={c._id} className="bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-gray-200">{c.text}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Hace un momento
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
