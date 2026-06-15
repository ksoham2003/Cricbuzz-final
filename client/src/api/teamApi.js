import api from './axiosInstance';

export const getAllTeams = () => api.get('/teams');

export const getTeamDetails = (teamId) => api.get(`/teams/${teamId}`);
