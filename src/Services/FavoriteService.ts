    import axios from "axios";

    // ⚠️ Reemplaza esta URL con la de tu backend en Render
    const API_URL = "https://movu-back-4mcj.onrender.com/api/v1/favorites";

    export const FavoriteService = {
    // Obtener todos los favoritos de un usuario
    async getFavorites(userId: string) {
        const res = await axios.get(`${API_URL}/${userId}`);
        return res.data;
    },

    // Agregar un video a favoritos
    async addFavorite(userId: string, videoId: string) {
        const res = await axios.post(API_URL, { userId, videoId });
        return res.data;
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
