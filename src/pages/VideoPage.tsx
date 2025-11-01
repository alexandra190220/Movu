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
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Estados principales
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [activeSubtitle, setActiveSubtitle] = useState<string>("none");
  const [availableSubtitles, setAvailableSubtitles] = useState<string[]>([]);
  const [showTitle, setShowTitle] = useState(false);

  // Comentarios
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);

  // Calificaciones
  const [userRating, setUserRating] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [isRating, setIsRating] = useState<boolean>(false);
  const [hoverRating, setHoverRating] = useState<number>(0);

  // === FUNCIONES AUXILIARES ===

  const getUserData = async (userId: string): Promise<User | null> => {
    try {
      const response = await fetch(`https://movu-back-4mcj.onrender.com/api/v1/users/${userId}`);
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  };

  const fetchUserDataForComments = async (comments: Comment[]) => {
    return Promise.all(
      comments.map(async (comment) => {
        if (comment.user) return comment;
        const userData = await getUserData(comment.userId);
        return userData
          ? { ...comment, user: userData }
          : comment;
      })
    );
  };

  // === CARGA DE DATOS ===

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const res = await fetch(`https://movu-back-4mcj.onrender.com/api/v1/comments/video/${video.id}`);
      if (res.ok) {
        const data = await res.json();
        setComments(await fetchUserDataForComments(data));
      }
    } finally {
      setLoadingComments(false);
    }
  };

  const loadRatings = async () => {
    try {
      const avgRes = await fetch(`https://movu-back-4mcj.onrender.com/api/v1/ratings/average/${video.id}`);
      if (avgRes.ok) {
        const avgData = await avgRes.json();
        setAverageRating(parseFloat(avgData.average.toFixed(1)) || 0);
      }

      if (currentUser) {
        const userRes = await fetch(
          `https://movu-back-4mcj.onrender.com/api/v1/ratings/user?userId=${currentUser._id}&videoId=${video.id}`
        );
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.rating) setUserRating(userData.rating);
        }
      }
    } catch (e) {
      console.error("Error cargando ratings:", e);
    }
  };

  // === MANEJO DE CALIFICACIONES ===

  const handleRateVideo = async (rating: number) => {
    if (!currentUser) return navigate("/login");
    try {
      setIsRating(true);
      const res = await fetch("https://movu-back-4mcj.onrender.com/api/v1/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser._id, videoId: video.id, rating }),
      });
      if (res.ok) {
        setUserRating(rating);
        loadRatings();
      }
    } finally {
      setIsRating(false);
    }
  };

  // === MANEJO DE COMENTARIOS ===

  const handleAddComment = async () => {
    if (!newComment.trim() || !currentUser) return;
    const res = await fetch("https://movu-back-4mcj.onrender.com/api/v1/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: currentUser._id,
        videoId: video.id,
        text: newComment,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setComments([{ ...data, user: currentUser }, ...comments]);
      setNewComment("");
    }
  };

  const handleUpdateComment = async (id: string) => {
    if (!editText.trim()) return;
    const res = await fetch("https://movu-back-4mcj.onrender.com/api/v1/comments", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId: id, text: editText }),
    });
    if (res.ok) {
      setComments((prev) =>
        prev.map((c) => (c._id === id ? { ...c, text: editText, updatedAt: new Date().toISOString() } : c))
      );
      setEditingComment(null);
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (!window.confirm("¿Eliminar comentario?")) return;
    const res = await fetch("https://movu-back-4mcj.onrender.com/api/v1/comments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId: id }),
    });
    if (res.ok) setComments((prev) => prev.filter((c) => c._id !== id));
  };

  // === VIDEO CONTROLS ===

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) v.pause();
    else v.play();
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleFullscreen = () => videoRef.current?.requestFullscreen();

  const toggleMute = () => {
    if (videoRef.current) {
      const mute = !isMuted;
      videoRef.current.muted = mute;
      setIsMuted(mute);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      setIsMuted(vol === 0);
    }
  };

  // === SUBTÍTULOS ===

  const handleSubtitleChange = (lang: string) => {
    setActiveSubtitle(lang);
    const tracks = videoRef.current?.textTracks;
    if (!tracks) return;
    Array.from(tracks).forEach((t) => (t.mode = "disabled"));
    const track = Array.from(tracks).find((t) => t.language === lang);
    if (track) track.mode = "showing";
  };

  const getSubtitleUrl = (lang: string) =>
    video?.id ? `https://movu-back-4mcj.onrender.com/subtitles/${video.id}_${lang}.vtt` : "";

  // === CARGA INICIAL ===

  useEffect(() => {
    const loadUser = async () => {
      const id = localStorage.getItem("userId");
      if (id) setCurrentUser(await getUserData(id));
      setLoadingUser(false);
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (video?.id) {
      const langs = ["es", "en"].filter((lang) => true); // siempre disponibles
      setAvailableSubtitles(langs);
      loadComments();
      loadRatings();
    }
  }, [video, currentUser]);

  // === RENDER ===

  return (
    <div className="min-h-screen bg-[#2b2f33] text-white p-4">
      {/* Botón de regreso */}
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-6 left-6 flex items-center gap-2 bg-gray-800 hover:bg-gray-700 transition-all px-3 py-2 rounded-full text-sm z-20 focus:ring-2 focus:ring-red-500"
        aria-label="Volver al dashboard"
      >
        <ArrowLeft size={18} />
        Volver
      </button>

      <div className="max-w-6xl mx-auto mt-16">
        {/* Reproductor */}
        <div
          ref={videoContainerRef}
          className="relative w-full max-w-4xl mx-auto aspect-video rounded-lg overflow-hidden shadow-2xl group"
        >
          <video
            ref={videoRef}
            src={video.video_files?.[0]?.link}
            className="w-full h-full object-contain"
            onClick={togglePlay}
            crossOrigin="anonymous"
          >
            {availableSubtitles.map((lang) => (
              <track
                key={lang}
                src={getSubtitleUrl(lang)}
                kind="subtitles"
                srcLang={lang}
                label={lang === "es" ? "Español" : "English"}
                default={activeSubtitle === lang}
              />
            ))}
          </video>

          {/* Controles */}
          <div className="absolute bottom-0 left-0 w-full bg-black/50 p-4 flex gap-3 justify-center items-center">
            <button onClick={togglePlay} aria-label="Reproducir/Pausar video">
              {isPlaying ? <Pause /> : <Play />}
            </button>
            <button onClick={handleStop} aria-label="Detener video">
              <Square />
            </button>
            <button onClick={handleFullscreen} aria-label="Pantalla completa">
              <Maximize2 />
            </button>
            <button onClick={toggleMute} aria-label="Silenciar">
              {isMuted ? <VolumeX /> : <Volume2 />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 accent-red-600 cursor-pointer"
              aria-label="Control de volumen"
            />
            <Captions />
            <select
              value={activeSubtitle}
              onChange={(e) => handleSubtitleChange(e.target.value)}
              className="bg-gray-800 rounded px-2 py-1 text-sm"
              aria-label="Seleccionar subtítulos"
            >
              <option value="none">Sin subtítulos</option>
              {availableSubtitles.map((lang) => (
                <option key={lang} value={lang}>
                  {lang === "es" ? "Español" : "English"}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
