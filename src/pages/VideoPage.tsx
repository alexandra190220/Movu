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

interface Rating {
  _id: string;
  userId: string;
  videoId: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
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

  const [userRating, setUserRating] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [isRating, setIsRating] = useState<boolean>(false);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const getUserData = async (userId: string): Promise<User | null> => {
    try {
      const response = await fetch(`https://movu-back-4mcj.onrender.com/api/v1/users/${userId}`);
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  };

  const loadComments = async () => {
    try {
      const res = await fetch(`https://movu-back-4mcj.onrender.com/api/v1/comments/video/${video.id}`);
      const data = await res.json();
      setComments(data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadRatings = async () => {
    try {
      const avg = await fetch(`https://movu-back-4mcj.onrender.com/api/v1/ratings/average/${video.id}`);
      const avgData = await avg.json();
      setAverageRating(parseFloat(avgData.average.toFixed(1)) || 0);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRateVideo = async (rating: number) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    try {
      setIsRating(true);
      await fetch("https://movu-back-4mcj.onrender.com/api/v1/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser._id, videoId: video.id, rating }),
      });
      setUserRating(rating);
      loadRatings();
    } finally {
      setIsRating(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !currentUser) return;
    const response = await fetch("https://movu-back-4mcj.onrender.com/api/v1/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUser._id, videoId: video.id, text: newComment }),
    });
    const comment = await response.json();
    setComments((prev) => [comment, ...prev]);
    setNewComment("");
  };

  const handleBack = () => navigate("/dashboard");

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
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

  const toggleMute = () => {
    if (videoRef.current) {
      const newMute = !isMuted;
      setIsMuted(newMute);
      videoRef.current.muted = newMute;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) videoRef.current.volume = newVol;
  };

  useEffect(() => {
    const loadUser = async () => {
      const id = localStorage.getItem("userId");
      if (id) {
        const user = await getUserData(id);
        if (user) setCurrentUser(user);
      }
    };
    loadUser();
    loadComments();
    loadRatings();
  }, []);

  return (
    <div className="min-h-screen bg-[#1c1f22] text-white p-4 mt-16">
      <button
        onClick={handleBack}
        aria-label="Volver al catálogo"
        className="absolute top-6 left-6 flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full text-sm transition-all focus-visible:ring-2 focus-visible:ring-red-500"
      >
        <ArrowLeft size={18} /> Volver
      </button>

      <div className="max-w-5xl mx-auto flex flex-col gap-10">
        {/* Video más pequeño y centrado */}
        <div
          className="relative mx-auto w-full max-w-3xl aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl"
          onMouseEnter={() => setShowTitle(true)}
          onMouseLeave={() => setShowTitle(false)}
        >
          <video
            ref={videoRef}
            src={video.video_files?.[0]?.link}
            className="w-full h-full object-contain rounded-2xl"
            onClick={togglePlay}
            aria-label="Reproductor de video"
          />
          {showTitle && (
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-4">
              <h1 className="text-xl font-semibold">{video?.alt || "Untitled video"}</h1>
              <p className="text-sm text-gray-300">{video?.user?.name || ""}</p>
            </div>
          )}
        </div>

        {/* Controles accesibles */}
        <div className="flex gap-4 justify-center items-center bg-gray-800/70 backdrop-blur-sm p-3 rounded-full max-w-3xl mx-auto shadow-md">
          <button aria-label={isPlaying ? "Pausar" : "Reproducir"} onClick={togglePlay} className="hover:text-red-500">
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button aria-label="Detener" onClick={handleStop}>
            <Square size={20} />
          </button>
          <button aria-label={isMuted ? "Activar sonido" : "Silenciar"} onClick={toggleMute}>
            {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            aria-label="Control de volumen"
            className="w-24 accent-red-600 cursor-pointer"
          />
        </div>

        {/* Sección de calificación y comentarios */}
        <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto">
          {/* Calificaciones */}
          <div className="lg:w-1/3 bg-gray-900/50 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-center">Calificar este video</h2>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => handleRateVideo(s)}
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}
                  disabled={isRating}
                  aria-label={`Calificar ${s} estrellas`}
                  className={`transition-transform ${isRating ? "opacity-50" : "hover:scale-110"}`}
                >
                  <Star
                    size={28}
                    className={`${
                      (hoverRating || userRating) >= s
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-500"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-lg font-semibold mb-2">{averageRating} / 5</p>
            <p className="text-center text-gray-400 text-sm">Promedio general</p>
          </div>

          {/* Comentarios */}
          <div className="lg:w-2/3 bg-gray-900/50 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Comentarios ({comments.length})</h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe un comentario..."
                aria-label="Campo para escribir un comentario"
                className="flex-1 bg-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="bg-red-600 hover:bg-red-700 transition-all rounded-lg px-3"
                aria-label="Enviar comentario"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {comments.map((c) => (
                <div key={c._id} className="bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-red-400">{c.user?.firstName || "Usuario"}</p>
                  <p className="text-gray-200">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
