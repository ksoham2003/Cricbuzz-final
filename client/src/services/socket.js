/**
 * Socket IO Service
 * Manages real-time connections for live scoring and commentary
 */

import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

let socket = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    initSocket();
  }
  return socket;
};

export const closeSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Socket Event Listeners
 */
export const socketService = {
  // Match Events
  joinMatch: (matchId) => {
    getSocket().emit('join:match', { matchId });
  },

  leaveMatch: (matchId) => {
    getSocket().emit('leave:match', { matchId });
  },

  onScoreUpdate: (callback) => {
    getSocket().on('score.updated', callback);
  },

  onCommentaryAdded: (callback) => {
    getSocket().on('commentary.created', callback);
  },

  onMatchStatusChange: (callback) => {
    getSocket().on('match.statusChanged', callback);
  },

  onPlayingXIUpdated: (callback) => {
    getSocket().on('playingXI.updated', callback);
  },

  // Cleanup listeners
  offScoreUpdate: () => getSocket().off('score.updated'),
  offCommentaryAdded: () => getSocket().off('commentary.created'),
  offMatchStatusChange: () => getSocket().off('match.statusChanged'),
  offPlayingXIUpdated: () => getSocket().off('playingXI.updated'),
};
