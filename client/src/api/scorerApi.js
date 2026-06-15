import api from './axiosInstance';

// Toss management
export const recordToss = (matchId, data) => 
  api.patch(`/matches/${matchId}/toss`, data);

// Select playing XI
export const selectPlayingXi = (matchId, data) => 
  api.post(`/matches/${matchId}/playing-xi`, data);

// Start match
export const startMatch = (matchId) => 
  api.patch(`/matches/${matchId}/start`);

// Innings break
export const inningsBreak = (matchId) => 
  api.patch(`/matches/${matchId}/innings-break`);

// End/Complete match
export const completeMatch = (matchId, data) => 
  api.patch(`/matches/${matchId}/complete`, data);

// Scores management
export const createScore = (data) => 
  api.post('/scores', data);

export const updateScore = (scoreId, data) => 
  api.patch(`/scores/${scoreId}`, data);

export const getScores = (matchId) => 
  api.get(`/scores/match/${matchId}`);

// Commentary management
export const postCommentary = (data) => 
  api.post('/commentary', data);
