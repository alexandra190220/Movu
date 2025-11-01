import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  ArrowLeft,
  Send,
  Trash2,
  Star,
} from "lucide-react";

interface Comment {
  _id: string;
  user: string;
  text: string;
}

interface VideoState {
  playing: boolean;
  muted: boolean;
  progress: number;
  duration: number;
  volume: number;
}

const VideoPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const [videoState, setVideoState] = useState<VideoState>({
    playing: false,
    muted: false,
    progress: 0,
    duration: 0,
    volume: 1,
  });

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [showControls, setShowControls] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  // --- VIDEO CONTROLS ---
  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    videoState.playing ? video.pause() : video.play();
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
      document.fullscreenElement ? document.exitFullscreen() : container.requestFullscreen();
    }
  };

  // --- COMMENTS ---
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const commentData = {
      user: "Usuario",
      text: newComment,
    };

    try {
      const response = await fetch("https://movu-back-4mcj.onrender.com/api/v1/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentData),
      });
      const data = await response.json();
      setComments((prev) => [...prev, data]);
      setNewComment("");
    } catch (error) {
      console.error("Error al agregar comentario:", error);
    }
  };

  const confirmDeleteComment = (commentId: string) => {
    setCommentToDelete(commentId);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCommentToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!commentToDelete) return;
    try {
      const response = await fetch("https://movu-back-4mcj.onrender.com/api/v1/comments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId: commentToDelete }),
      });

      if (response.ok) {
        setComments((prev) => prev.filter((c) => c._id !== commentToDelete));
      }
    } catch (error) {
      console.error("Error eliminando comentario:", error);
    } finally {
      cancelDelete();
    }
  };

  // --- RATING ---
  const handleRating = (value: number) => {
    setRating(value);
  };

  // --- EFFECTS ---
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  // --- UI ---
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-950 text-white">
      {/* Volver */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 flex items-center text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2"
        aria-label="Regresar"
      >
        <ArrowLeft className="mr-2" aria-hidden="true" />
        Volver
      </button>

      {/* VIDEO */}
      <div
        ref={videoContainerRef}
        className="relative w-full max-w-2xl mx-auto h-[450px] rounded-lg overflow-hidden shadow-2xl group mt-16"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <video
          ref={videoRef}
          src={location.state?.videoUrl}
          className="w-full h-full object-cover"
          tabIndex={0}
          aria-label="Video principal"
        />

        {showControls && (
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-4 space-y-3 transition-opacity duration-300">
            <div
              className="w-full h-2 bg-gray-700 rounded-full cursor-pointer"
              onClick={handleProgressClick}
              aria-label="Barra de progreso"
            >
              <div
                className="h-2 bg-blue-500 rounded-full"
                style={{ width: `${videoState.progress}%` }}
                role="progressbar"
                aria-valuenow={videoState.progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handlePlayPause}
                  className="p-2 bg-blue-600 rounded-full hover:bg-blue-700 focus:ring-2 focus:ring-white"
                  aria-label={videoState.playing ? "Pausar" : "Reproducir"}
                >
                  {videoState.playing ? <Pause size={18} /> : <Play size={18} />}
                </button>

                <button
                  onClick={handleMute}
                  className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 focus:ring-2 focus:ring-white"
                  aria-label={videoState.muted ? "Activar sonido" : "Silenciar"}
                >
                  {videoState.muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={videoState.volume}
                  onChange={handleVolumeChange}
                  className="w-20 accent-blue-500 cursor-pointer"
                  aria-label="Control de volumen"
                />
              </div>

              <button
                onClick={handleFullScreen}
                className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 focus:ring-2 focus:ring-white"
                aria-label="Pantalla completa"
              >
                <Maximize2 size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Barra de botones */}
      <div className="flex gap-4 items-center justify-center mt-4 bg-[#1f1f1f]/80 backdrop-blur-md px-4 py-2 rounded-xl shadow-md max-w-2xl mx-auto border border-gray-700/40">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            onClick={() => handleRating(i)}
            className={`cursor-pointer ${rating && rating >= i ? "text-yellow-400" : "text-gray-500"}`}
          />
        ))}
      </div>

      {/* Comentarios */}
      <div className="w-full max-w-2xl mt-6 px-4">
        <h2 className="text-xl font-semibold mb-3">Comentarios</h2>

        <div className="space-y-3 max-h-[220px] overflow-y-auto">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="flex justify-between bg-gray-800 rounded-lg px-4 py-2 items-center"
            >
              <p className="text-gray-200">{comment.text}</p>
              <button
                onClick={() => confirmDeleteComment(comment._id)}
                className="p-1 hover:bg-gray-700 rounded transition-all focus:outline-none focus:ring-2 focus:ring-gray-400"
                aria-label="Eliminar comentario"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex mt-4">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe un comentario..."
            className="flex-1 px-3 py-2 rounded-l-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddComment}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-lg focus:ring-2 focus:ring-blue-400"
            aria-label="Enviar comentario"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl p-6 w-[90%] max-w-sm shadow-lg border border-gray-700 text-center">
            <h3 className="text-lg font-semibold mb-3 text-white">Eliminar comentario</h3>
            <p className="text-gray-300 mb-6">
              ¿Seguro que deseas eliminar este comentario? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


