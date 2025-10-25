import axios from "axios";

const API_URL = "https://movu-back-4mcj.onrender.com/api/v1/favorites";

/**
 * @file FavoriteService.ts
 * @description Service module for managing user favorite videos through API requests.
 * Provides methods to get, add, remove, and check favorite videos for a specific user.
 */

export const FavoriteService = {
  /**
   * Retrieves all favorite videos of a given user.
   * @async
   * @param {string} userId - The unique identifier of the user.
   * @returns {Promise<Array<{videoId: string, videoData: any}>>} List of favorite videos.
   */
  async getFavorites(userId: string) {
    const res = await axios.get(`${API_URL}/${userId}`);
    return res.data.map((fav: any) => ({
      videoId: fav.videoId,
      videoData: fav.videoData,
    }));
  },

  /**
   * Adds a video to the user's list of favorites.
   * @async
   * @param {string} userId - The unique identifier of the user.
   * @param {string} videoId - The unique identifier of the video.
   * @param {any} videoData - The complete video data object to be stored.
   * @returns {Promise<{videoId: string, videoData: any}>} The added favorite video data.
   */
  async addFavorite(userId: string, videoId: string, videoData: any) {
    const res = await axios.post(API_URL, { userId, videoId, videoData });
    return {
      videoId: res.data.videoId,
      videoData: res.data.videoData,
    };
  },

  /**
   * Removes a video from the user's list of favorites.
   * @async
   * @param {string} userId - The unique identifier of the user.
   * @param {string} videoId - The unique identifier of the video to be removed.
   * @returns {Promise<any>} The server response after deletion.
   */
  async removeFavorite(userId: string, videoId: string) {
    const res = await axios.delete(API_URL, { data: { userId, videoId } });
    return res.data;
  },

  /**
   * Checks whether a specific video is in the user's list of favorites.
   * @async
   * @param {string} userId - The unique identifier of the user.
   * @param {string} videoId - The unique identifier of the video to check.
   * @returns {Promise<boolean>} True if the video is a favorite, false otherwise.
   */
  async checkFavorite(userId: string, videoId: string) {
    const res = await axios.get(`${API_URL}/check/favorite`, {
      params: { userId, videoId },
    });
    return res.data.isFavorite;
  },
};
