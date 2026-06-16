/**
 * Axios API Service
 * Handles all HTTP requests with authentication
 */

import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../config/api.js';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Enable cookies for httpOnly tokens
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken, user } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify(user));

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear auth and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * API Service Methods
 */
export const apiService = {
  // Auth Services
  register: (data) => apiClient.post(API_ENDPOINTS.AUTH_REGISTER, data),
  login: (email, password) =>
    apiClient.post(API_ENDPOINTS.AUTH_LOGIN, { email, password }),
  logout: () => apiClient.post(API_ENDPOINTS.AUTH_LOGOUT),
  refreshToken: () => apiClient.post(API_ENDPOINTS.AUTH_REFRESH),
  getMe: () => apiClient.get(API_ENDPOINTS.AUTH_GET_ME),

  // User Management Services
  getUsers: (query = {}) => apiClient.get(API_ENDPOINTS.USERS_LIST, { params: query }),
  createUser: (data) => apiClient.post(API_ENDPOINTS.USERS_CREATE, data),
  getUser: (id) => apiClient.get(API_ENDPOINTS.USERS_GET(id)),
  updateUser: (id, data) => apiClient.patch(API_ENDPOINTS.USERS_UPDATE(id), data),
  deleteUser: (id) => apiClient.delete(API_ENDPOINTS.USERS_DELETE(id)),

  // Series Services
  getSeries: (query = {}) => apiClient.get(API_ENDPOINTS.SERIES_LIST, { params: query }),
  createSeries: (data) => apiClient.post(API_ENDPOINTS.SERIES_CREATE, data),
  getSeriesById: (id) => apiClient.get(API_ENDPOINTS.SERIES_GET(id)),
  updateSeries: (id, data) => apiClient.patch(API_ENDPOINTS.SERIES_UPDATE(id), data),
  deleteSeries: (id) => apiClient.delete(API_ENDPOINTS.SERIES_DELETE(id)),

  // Team Services
  getTeams: (query = {}) => apiClient.get(API_ENDPOINTS.TEAMS_LIST, { params: query }),
  createTeam: (data) => apiClient.post(API_ENDPOINTS.TEAMS_CREATE, data),
  getTeamById: (id) => apiClient.get(API_ENDPOINTS.TEAMS_GET(id)),
  updateTeam: (id, data) => apiClient.patch(API_ENDPOINTS.TEAMS_UPDATE(id), data),
  deleteTeam: (id) => apiClient.delete(API_ENDPOINTS.TEAMS_DELETE(id)),

  // Player Services
  getPlayers: (query = {}) => apiClient.get(API_ENDPOINTS.PLAYERS_LIST, { params: query }),
  createPlayer: (data) => apiClient.post(API_ENDPOINTS.PLAYERS_CREATE, data),
  getPlayerById: (id) => apiClient.get(API_ENDPOINTS.PLAYERS_GET(id)),
  updatePlayer: (id, data) => apiClient.patch(API_ENDPOINTS.PLAYERS_UPDATE(id), data),
  deletePlayer: (id) => apiClient.delete(API_ENDPOINTS.PLAYERS_DELETE(id)),

  // Squad Services
  getSquads: (query = {}) => apiClient.get(API_ENDPOINTS.SQUADS_LIST, { params: query }),
  createSquad: (data) => apiClient.post(API_ENDPOINTS.SQUADS_CREATE, data),
  getSquadById: (id) => apiClient.get(API_ENDPOINTS.SQUADS_GET(id)),
  getSquadByTeam: (teamId) => apiClient.get(API_ENDPOINTS.SQUADS_GET_BY_TEAM(teamId)),
  updateSquad: (id, data) => apiClient.patch(API_ENDPOINTS.SQUADS_UPDATE(id), data),
  addPlayerToSquad: (id, playerId) =>
    apiClient.post(API_ENDPOINTS.SQUADS_ADD_PLAYER(id), { playerId }),
  removePlayerFromSquad: (id, playerId) =>
    apiClient.delete(API_ENDPOINTS.SQUADS_REMOVE_PLAYER(id, playerId)),

  // Match Services
  getMatches: (query = {}) => apiClient.get(API_ENDPOINTS.MATCHES_LIST, { params: query }),
  createMatch: (data) => apiClient.post(API_ENDPOINTS.MATCHES_CREATE, data),
  getMatchById: (id) => apiClient.get(API_ENDPOINTS.MATCHES_GET(id)),
  updateMatch: (id, data) => apiClient.patch(API_ENDPOINTS.MATCHES_UPDATE(id), data),
  conductToss: (id, data) => apiClient.post(API_ENDPOINTS.MATCHES_TOSS(id), data),
  startMatch: (id) => apiClient.post(API_ENDPOINTS.MATCHES_START(id)),
  selectPlayingXi: (id, data) => apiClient.post(API_ENDPOINTS.PLAYING_XI_SELECT(id), data),
  inningsBreak: (id, data) => apiClient.post(API_ENDPOINTS.MATCHES_INNINGS_BREAK(id), data),
  completeMatch: (id, data) => apiClient.post(API_ENDPOINTS.MATCHES_COMPLETE(id), data),

  // Playing XI Services
  getPlayingXi: (matchId) => apiClient.get(API_ENDPOINTS.PLAYING_XI_GET(matchId)),
  getTeamPlayingXi: (matchId, teamNum) =>
    apiClient.get(API_ENDPOINTS.PLAYING_XI_GET_TEAM(matchId, teamNum)),

  // Score Services
  getScores: (query = {}) => apiClient.get(API_ENDPOINTS.SCORES_LIST, { params: query }),
  createScore: (data) => apiClient.post(API_ENDPOINTS.SCORES_CREATE, data),
  getScoreById: (id) => apiClient.get(API_ENDPOINTS.SCORES_GET(id)),
  updateScore: (id, data) => apiClient.patch(API_ENDPOINTS.SCORES_UPDATE(id), data),
  deleteScore: (id) => apiClient.delete(API_ENDPOINTS.SCORES_DELETE(id)),

  // Commentary Services
  getCommentary: (query = {}) => apiClient.get(API_ENDPOINTS.COMMENTARY_LIST, { params: query }),
  createCommentary: (data) => apiClient.post(API_ENDPOINTS.COMMENTARY_CREATE, data),
  deleteCommentary: (id) => apiClient.delete(API_ENDPOINTS.COMMENTARY_DELETE(id)),
};

export default apiClient;
