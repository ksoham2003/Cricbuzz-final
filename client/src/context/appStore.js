/**
 * App Data Store - Zustand
 * Global application state for series, teams, matches, etc.
 */

import { create } from 'zustand';
import { apiService } from '../services/api';

export const useAppStore = create((set) => ({
  // State
  series: [],
  teams: [],
  players: [],
  squads: [],
  matches: [],
  scores: [],
  commentary: [],
  currentMatch: null,
  isLoading: false,
  error: null,

  // Series actions
  fetchSeries: async (query = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.getSeries(query);
      set({
        series: response.data.data,
        isLoading: false,
      });
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch series';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  createSeries: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.createSeries(data);
      set((state) => ({
        series: [...state.series, response.data.data],
        isLoading: false,
      }));
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create series';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Teams actions
  fetchTeams: async (query = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.getTeams(query);
      set({
        teams: response.data.data,
        isLoading: false,
      });
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch teams';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  createTeam: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.createTeam(data);
      set((state) => ({
        teams: [...state.teams, response.data.data],
        isLoading: false,
      }));
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create team';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Matches actions
  fetchMatches: async (query = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.getMatches(query);
      set({
        matches: response.data.data,
        isLoading: false,
      });
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch matches';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  getMatchById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.getMatchById(id);
      set({
        currentMatch: response.data.data,
        isLoading: false,
      });
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch match';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  createMatch: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.createMatch(data);
      set((state) => ({
        matches: [...state.matches, response.data.data],
        isLoading: false,
      }));
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create match';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Scores actions
  fetchScores: async (query = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.getScores(query);
      set({
        scores: response.data.data,
        isLoading: false,
      });
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch scores';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Commentary actions
  fetchCommentary: async (query = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.getCommentary(query);
      set({
        commentary: response.data.data,
        isLoading: false,
      });
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch commentary';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Generic actions
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  reset: () =>
    set({
      series: [],
      teams: [],
      players: [],
      squads: [],
      matches: [],
      scores: [],
      commentary: [],
      currentMatch: null,
      isLoading: false,
      error: null,
    }),
}));
