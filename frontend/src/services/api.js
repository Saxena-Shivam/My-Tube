import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = "http://localhost:5000/api/v1";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // For HttpOnly cookies
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await api.post("/users/refresh-token");
        const { accessToken } = response.data.data;
        localStorage.setItem("accessToken", accessToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // Show error toast for other errors
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Something went wrong!");
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (formData) =>
    api.post("/users/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  login: (credentials) => api.post("/users/login", credentials),
  logout: () => api.post("/users/logout"),
  refreshToken: () => api.post("/users/refresh-token"),
  changePassword: (passwords) => api.post("/users/change-password", passwords),
  getCurrentUser: () => api.get("/users/current-user"),
  updateAccount: (data) => api.patch("/users/update-account", data),
  updateAvatar: (formData) =>
    api.patch("/users/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateCoverImage: (formData) =>
    api.patch("/users/cover-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getChannelByUsername: (username) => api.get(`/users/c/${username}`),
  getWatchHistory: () => api.get("/users/history"),
};

// Video API
export const videoAPI = {
  getAllVideos: (page = 1, limit = 10) =>
    api.get(`/videos?page=${page}&limit=${limit}`),
  uploadVideo: (formData, onUploadProgress) =>
    api.post("/videos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    }),
  getVideoById: (videoId) => api.get(`/videos/${videoId}`),
  updateVideo: (videoId, data) => api.patch(`/videos/${videoId}`, data),
  deleteVideo: (videoId) => api.delete(`/videos/${videoId}`),
  togglePublishStatus: (videoId) =>
    api.patch(`/videos/toggle/publish/${videoId}`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get("/dashboard/stats"),
  getUserVideos: () => api.get("/dashboard/videos"),
};

// Likes API
export const likesAPI = {
  toggleVideoLike: (videoId) => api.post(`/likes/toggle/v/${videoId}`),
  toggleCommentLike: (commentId) => api.post(`/likes/toggle/c/${commentId}`),
  toggleTweetLike: (tweetId) => api.post(`/likes/toggle/t/${tweetId}`),
  getLikedVideos: () => api.get("/likes/videos"),
};

// Tweets API
export const tweetsAPI = {
  createTweet: (content) => api.post("/tweets", { content }),
  getUserTweets: (userId) => api.get(`/tweets/user/${userId}`),
  updateTweet: (tweetId, content) =>
    api.patch(`/tweets/${tweetId}`, { content }),
  deleteTweet: (tweetId) => api.delete(`/tweets/${tweetId}`),
};

// Subscriptions API
export const subscriptionsAPI = {
  getSubscribedChannels: (channelId) =>
    api.get(`/subscriptions/c/${channelId}`),
  toggleSubscription: (channelId) => api.post(`/subscriptions/c/${channelId}`),
  getSubscribers: (subscriberId) => api.get(`/subscriptions/u/${subscriberId}`),
};

// Playlists API
export const playlistsAPI = {
  createPlaylist: (data) => api.post("/playlists", data),
  getPlaylistById: (playlistId) => api.get(`/playlists/${playlistId}`),
  updatePlaylist: (playlistId, data) =>
    api.patch(`/playlists/${playlistId}`, data),
  deletePlaylist: (playlistId) => api.delete(`/playlists/${playlistId}`),
  addVideoToPlaylist: (videoId, playlistId) =>
    api.patch(`/playlists/add/${videoId}/${playlistId}`),
  removeVideoFromPlaylist: (videoId, playlistId) =>
    api.patch(`/playlists/remove/${videoId}/${playlistId}`),
  getUserPlaylists: (userId) => api.get(`/playlists/user/${userId}`),
};

// Health check
export const healthAPI = {
  check: () => api.get("/healthcheck"),
};

export default api;
