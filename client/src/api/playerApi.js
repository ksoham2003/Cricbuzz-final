import api from './axiosInstance';

export const getAllPlayers = () => api.get('/players');

export const getPlayerDetails = (playerId) => api.get(`/players/${playerId}`);
