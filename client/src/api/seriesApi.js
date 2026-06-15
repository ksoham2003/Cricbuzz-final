import api from './axiosInstance';

export const getAllSeries = () => api.get('/series');

export const getSeriesDetails = (seriesId) => api.get(`/series/${seriesId}`);

export const getSeriesMatches = (seriesId) => api.get('/matches', { params: { series: seriesId } });

export const getPointsTable = (seriesId) => api.get(`/series/${seriesId}/points-table`);
