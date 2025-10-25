import axios from "axios";

// URL de tu backend en Render
const API_URL = "https://movu-back-4mcj.onrender.com/api/v1/favorites";

export const FavoriteService = {
  // Obtener todos los favoritos de un usuario
  async getFavorites(userId: string) {
    const res = await axios.get(`${API_URL}/${userId}`);
    // El backend devuelve { videoId, userId, createdAt, updatedAt, videoData }
    return res.data.map((fav: any) => ({
      videoId: fav.videoId,
      videoData: fav.videoData,
    }));
  },

  // Agregar un video a favoritos
  async addFavorite(userId: string, videoId: string, videoData: any) {
    // Enviamos videoData completo al backend para almacenarlo
    const res = await axios.post(API_URL, { userId, videoId, videoData });
    return {
      videoId: res.data.videoId,
      videoData: res.data.videoData,
    };
  },

  // Eliminar un video de favoritos
  async removeFavorite(userId: string, videoId: string) {
    const res = await axios.delete(API_URL, { data: { userId, videoId } });
    return res.data;
  },

  // Verificar si un video está en favoritos
  async checkFavorite(userId: string, videoId: string) {
    const res = await axios.get(`${API_URL}/check/favorite`, {
      params: { userId, videoId },
    });
    return res.data.isFavorite;
  },
};
