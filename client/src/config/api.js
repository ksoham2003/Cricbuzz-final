/**
 * API Configuration
 * Centralized API base URL and axios instance
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  // Auth
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGIN: '/auth/login',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_GET_ME: '/auth/me',
  AUTH_GOOGLE: '/auth/google',

  // Users (Admin)
  USERS_LIST: '/users',
  USERS_CREATE: '/users',
  USERS_GET: (id) => `/users/${id}`,
  USERS_UPDATE: (id) => `/users/${id}`,
  USERS_DELETE: (id) => `/users/${id}`,

  // Series
  SERIES_LIST: '/series',
  SERIES_CREATE: '/series',
  SERIES_GET: (id) => `/series/${id}`,
  SERIES_UPDATE: (id) => `/series/${id}`,
  SERIES_DELETE: (id) => `/series/${id}`,

  // Teams
  TEAMS_LIST: '/teams',
  TEAMS_CREATE: '/teams',
  TEAMS_GET: (id) => `/teams/${id}`,
  TEAMS_UPDATE: (id) => `/teams/${id}`,
  TEAMS_DELETE: (id) => `/teams/${id}`,

  // Players
  PLAYERS_LIST: '/players',
  PLAYERS_CREATE: '/players',
  PLAYERS_GET: (id) => `/players/${id}`,
  PLAYERS_UPDATE: (id) => `/players/${id}`,
  PLAYERS_DELETE: (id) => `/players/${id}`,
  PLAYERS_UPLOAD: '/players/upload',

  // Squads
  SQUADS_LIST: '/squads',
  SQUADS_CREATE: '/squads',
  SQUADS_GET: (id) => `/squads/${id}`,
  SQUADS_GET_BY_TEAM: (teamId) => `/squads/team/${teamId}`,
  SQUADS_UPDATE: (id) => `/squads/${id}`,
  SQUADS_ADD_PLAYER: (id) => `/squads/${id}/players`,
  SQUADS_REMOVE_PLAYER: (id, playerId) => `/squads/${id}/players/${playerId}`,
  SQUADS_UPDATE_STATUS: (id) => `/squads/${id}/status`,

  // Matches
  MATCHES_LIST: '/matches',
  MATCHES_CREATE: '/matches',
  MATCHES_GET: (id) => `/matches/${id}`,
  MATCHES_UPDATE: (id) => `/matches/${id}`,
  MATCHES_TOSS: (id) => `/matches/${id}/toss`,
  MATCHES_START: (id) => `/matches/${id}/start`,
  MATCHES_PLAYING_XI: (id) => `/matches/${id}/playing-xi`,
  MATCHES_INNINGS_BREAK: (id) => `/matches/${id}/innings-break`,
  MATCHES_COMPLETE: (id) => `/matches/${id}/complete`,

  // Playing XI
  PLAYING_XI_GET: (matchId) => `/playing-xi/${matchId}`,
  PLAYING_XI_GET_TEAM: (matchId, teamNum) => `/playing-xi/${matchId}/team/${teamNum}`,
  PLAYING_XI_SELECT: (matchId) => `/playing-xi/${matchId}`,

  // Scores
  SCORES_LIST: '/scores',
  SCORES_CREATE: '/scores',
  SCORES_GET: (id) => `/scores/${id}`,
  SCORES_UPDATE: (id) => `/scores/${id}`,
  SCORES_DELETE: (id) => `/scores/${id}`,

  // Commentary
  COMMENTARY_LIST: '/commentary',
  COMMENTARY_CREATE: '/commentary',
  COMMENTARY_DELETE: (id) => `/commentary/${id}`,
};

export default API_BASE_URL;
