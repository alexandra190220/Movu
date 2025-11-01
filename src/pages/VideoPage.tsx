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
  const videoContainerRef = useRef<HTMLDivElement>(null);

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
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);

  const [userRating, setUserRating] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [isRating, setIsRating] = useState<boolean>(false);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const getUserData = async (userId: string): Promise<User | null> => {
    try {
      const response = await fetch(
        `https://movu-back-4mcj.onrender.com/api/v1/users/${userId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        console.error("Error al obtener datos del usuario");
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("Error al cargar datos del usuario:", error);
      return null;
    }
  };

  const fetchUserDataForComments = async (
    comments: Comment[]
  ): Promise<Comment[]> => {
    const commentsWithUsers = await Promise.all(
      comments.map(async (comment) => {
        try {
          if (comment.user) return comment;

          const userData = await getUserData(comment.userId);
          if (userData) {
            return {
              ...comment,
              user: {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
              },
            };
          }
          return comment;
        } catch (error) {
          console.error(`Error obteniendo usuario ${comment.userId}:`, error);
          return comment;
        }
      })
    );
    return commentsWithUsers;
  };

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const response = await fetch(
        `https://movu-back-4mcj.onrender.com/api/v1/comments/video/${video.id}`
      );
      if (response.ok) {
        const data = await response.json();
        const commentsWithUsers = await fetchUserDataForComments(data);
        setComments(commentsWithUsers);
      } else {
        console.error("Error cargando comentarios:", response.status);
      }
    } catch (error) {
      console.error("Error cargando comentarios:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const loadRatings = async () => {
    try {
      const averageResponse = await fetch(
        `https://movu-back-4mcj.onrender.com/api/v1/ratings/average/${video.id}`
      );
      if (averageResponse.ok) {
        const averageData = await averageResponse.json();
        setAverageRating(parseFloat(averageData.average.toFixed(1)) || 0);
      }

      if (currentUser) {
        const userRatingResponse = await fetch(
          `https://movu-back-4mcj.onrender.com/api/v1/ratings/user?userId=${currentUser._id}&videoId=${video.id}`
        );
        if (userRatingResponse.ok) {
          const userRatingData = await userRatingResponse.json();
          if (userRatingData.rating) {
            setUserRating(userRatingData.rating);
          }
        }
      }
    } catch (error) {
      console.error("Error cargando ratings:", error);
    }
  };

  const handleRateVideo = async (rating: number) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      setIsRating(true);
      const response = await fetch(
        "https://movu-back-4mcj.onrender.com/api/v1/ratings",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser._id,
            videoId: video.id,
            rating: rating,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setUserRating(rating);
        loadRatings();
      } else {
        console.error("Error calificando video");
      }
    } catch (error) {
      console.error("Error calificando video:", error);
    } finally {
      setIsRating(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !currentUser) return;

    try {
      const response = await fetch(
        "https://movu-back-4mcj.onrender.com/api/v1/comments",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser._id,
            videoId: video.id,
            text: newComment,
          }),
        }
      );

      if (response.ok) {
        const comment = await response.json();
        const commentWithUser = {
          ...comment,
          user: {
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
          },
        };
        setComments((prev) => [commentWithUser, ...prev]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error agregando comentario:", error);
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment._id);
    setEditText(comment.text);
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editText.trim()) return;
    try {
      const response = await fetch(
        "https://movu-back-4mcj.onrender.com/api/v1/comments",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ commentId, text: editText }),
        }
      );

      if (response.ok) {
        setComments((prev) =>
          prev.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  text: editText,
                  updatedAt: new Date().toISOString(),
                }
              : comment
          )
        );
        setEditingComment(null);
        setEditText("");
      }
    } catch (error) {
      console.error("Error actualizando comentario:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (
      !window.confirm("¿Estás seguro de que quieres eliminar este comentario?")
    )
      return;
    try {
      const response = await fetch(
        "https://movu-back-4mcj.onrender.com/api/v1/comments",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ commentId }),
        }
      );

      if (response.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentId)
        );
      }
    } catch (error) {
      console.error("Error eliminando comentario:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Ahora mismo";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays < 7) return `Hace ${diffDays} d`;
    return date.toLocaleDateString("es-ES");
  };

  const isCommentOwner = (comment: Comment) => {
    return currentUser && comment.userId === currentUser._id;
  };

  const getUserDisplayName = (comment: Comment) => {
    if (isCommentOwner(comment)) return "Tú";
    if (comment.user)
      return `${comment.user.firstName} ${comment.user.lastName}`;
    return "Cargando...";
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
    for (let i = 0; i < tracks.length; i++) {
      tracks[i].mode = "disabled";
    }

    if (lang !== "none") {
      const track = Array.from(tracks).find((t) => t.language === lang);
      if (track) {
        track.mode = "showing";
      }
    }
  };

  const handleVideoLoad = () => {
    if (videoRef.current && activeSubtitle !== "none") {
      const tracks = videoRef.current.textTracks;
      const track = Array.from(tracks).find(
        (t) => t.language === activeSubtitle
      );
      if (track) {
        track.mode = "showing";
      }
    }
  };

  const handleMouseEnter = () => setShowTitle(true);
  const handleMouseLeave = () => setShowTitle(false);

  const hasSubtitleFile = (videoId: number, lang: string): boolean => true;

  const getSubtitleUrl = (lang: string): string => {
    if (video?.id) {
      return `https://movu-back-4mcj.onrender.com/subtitles/${video.id}_${lang}.vtt`;
    }
    return "";
  };

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          const userData = await getUserData(userId);
          if (userData) {
            setCurrentUser(userData);
          }
        }
      } catch (error) {
        console.error("Error cargando usuario:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (video?.id) {
      const subtitles = [];
      if (video.subtitles?.es || hasSubtitleFile(video.id, "es")) {
        subtitles.push("es");
      }
      if (video.subtitles?.en || hasSubtitleFile(video.id, "en")) {
        subtitles.push("en");
      }
      setAvailableSubtitles(subtitles);

      loadComments();
      loadRatings();
    }
  }, [video, currentUser]);

  const hasSubtitles = availableSubtitles.length > 0;

  return (
    <div className="min-h-screen bg-[#2b2f33] text-white p-4">
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 flex items-center gap-2 bg-gray-800 hover:bg-gray-700 transition-all px-3 py-2 rounded-full text-sm z-20"
      >
        <ArrowLeft size={18} />
        Volver
      </button>

      <div className="max-w-6xl mx-auto mt-10">
        <div className="mb-6">
          <div
            ref={videoContainerRef}
            className="relative w-full max-w-4xl mx-auto aspect-video rounded-lg overflow-hidden shadow-2xl group"
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

            <div
              className={`absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent transition-all duration-300 ${
                showTitle
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <h1 className="text-xl font-semibold tracking-wide">
                {video?.video_files?.[0]?.name ||
                  video?.alt ||
                  "Untitled video"}
              </h1>
              <p className="text-sm text-gray-400">
                {video?.user?.name ? `By ${video.user.name}` : ""}
              </p>
            </div>

            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/20" />
          </div>

          <div className="flex gap-4 items-center justify-center mt-4 bg-[#222]/70 backdrop-blur-md px-5 py-3 rounded-full shadow-lg max-w-4xl mx-auto">
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
                      {lang === "es" ? "Español" : "English"}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* SECCIÓN MODIFICADA: Distribución 1/3 para calificaciones y 2/3 para comentarios */}
        <div className="flex flex-col lg:flex-row gap-6 max-w-4xl mx-auto">
          {/* Sección de Calificaciones - 1/3 del ancho, altura ajustada al contenido */}
          <div className="lg:w-1/3">
            <div className="bg-gray-900/50 rounded-lg p-6 backdrop-blur-sm h-fit">
              <h2 className="text-xl font-semibold mb-6 text-center">
                Calificar esta película
              </h2>

              <div className="mb-6">
                <p className="text-sm text-gray-300 mb-4 text-center">
                  Selecciona tu calificación
                </p>
                <div className="flex gap-2 mb-3 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRateVideo(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      disabled={isRating}
                      className={`p-1 transition-all transform hover:scale-110 ${
                        isRating
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      <Star
                        size={28}
                        className={`
                          ${
                            (hoverRating || userRating) >= star
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-400"
                          }
                          transition-colors
                        `}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-lg font-semibold text-center mb-2">
                  {userRating ? `${userRating} / 5` : "0 / 5"}
                </p>
                <p className="text-sm text-gray-400 text-center">
                  {userRating ? "Tu calificación" : "Sin calificar"}
                </p>
              </div>

              <div className="text-center border-t border-gray-700 pt-4">
                <p className="text-sm text-gray-300 mb-2">
                  Calificación promedio
                </p>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Star size={20} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold">{averageRating}</span>
                  <span className="text-gray-400 text-lg">/5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Comentarios - 2/3 del ancho */}
          <div className="lg:w-2/3">
            <div className="bg-gray-900/50 rounded-lg p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4">
                Comentarios ({comments.length})
                {loadingComments && (
                  <span className="text-sm text-gray-400 ml-2">
                    (cargando...)
                  </span>
                )}
              </h2>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">
                  Escribe tu opinión aquí
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                    placeholder="Comparte tu opinión..."
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || !currentUser}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all p-2 rounded-lg"
                  >
                    <Send size={20} />
                  </button>
                </div>
                {!currentUser && (
                  <p className="text-sm text-gray-400 mt-2 text-center">
                    <button
                      onClick={() => navigate("/login")}
                      className="text-red-400 hover:text-red-300 underline"
                    >
                      Inicia sesión
                    </button>{" "}
                    para comentar
                  </p>
                )}
              </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {loadingComments ? (
                  <p className="text-gray-400 text-center py-8">
                    Cargando comentarios...
                  </p>
                ) : comments.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">
                    No hay comentarios aún. ¡Sé el primero en comentar!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="bg-gray-800/50 rounded-lg p-4"
                    >
                      {editingComment === comment._id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white resize-none"
                            rows={3}
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => setEditingComment(null)}
                              className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-500 rounded transition-all"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleUpdateComment(comment._id)}
                              disabled={!editText.trim()}
                              className="px-3 py-1 text-sm bg-red-600 hover:bg-red-500 disabled:bg-gray-600 rounded transition-all"
                            >
                              Guardar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="font-semibold text-red-400">
                                {getUserDisplayName(comment)}
                              </span>
                              <span className="text-gray-400 text-sm ml-2">
                                {formatDate(comment.createdAt)}
                                {comment.updatedAt !== comment.createdAt &&
                                  " (editado)"}
                              </span>
                            </div>
                            {isCommentOwner(comment) && (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleEditComment(comment)}
                                  className="p-1 hover:bg-gray-700 rounded transition-all"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteComment(comment._id)
                                  }
                                  className="p-1 hover:bg-gray-700 rounded transition-all"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                          <p className="text-gray-200 whitespace-pre-wrap">
                            {comment.text}
                          </p>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
