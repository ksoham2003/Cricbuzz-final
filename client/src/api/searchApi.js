import api from './axiosInstance';

export const search = (query) => api.get('/search', { params: { q: query } });
