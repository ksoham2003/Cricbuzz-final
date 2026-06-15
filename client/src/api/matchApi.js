import api from './axiosInstance';

export const getHomeData = () => api.get('/home');

export const getMatches = (status) => {
  const params = status ? { status } : {};
  return api.get('/matches', { params });
};

export const getMatchDetails = (matchId) => api.get(`/matches/${matchId}`);

export const getMatchCenter = (matchId) => api.get(`/matches/${matchId}/center`);

export const getScorecard = (matchId) => api.get(`/matches/${matchId}/scorecard`);

export const getCommentary = (matchId, page = 1, limit = 50) =>
  api.get(`/matches/${matchId}/commentary`, { params: { page, limit } });
