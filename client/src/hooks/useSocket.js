import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000';

export function useSocket(matchId, handlers = {}) {
  const socketRef = useRef(null);
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!matchId) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join-match', matchId);
    });

    socket.on('score.updated', (data) => {
      handlersRef.current.onScoreUpdate?.(data);
    });

    socket.on('commentary.created', (data) => {
      handlersRef.current.onCommentary?.(data);
    });

    socket.on('match.started', (data) => {
      handlersRef.current.onMatchStarted?.(data);
    });

    socket.on('match.completed', (data) => {
      handlersRef.current.onMatchCompleted?.(data);
    });

    socket.on('toss.updated', (data) => {
      handlersRef.current.onTossUpdate?.(data);
    });

    socket.on('playingXI.updated', (data) => {
      handlersRef.current.onPlayingXIUpdate?.(data);
    });

    return () => {
      socket.emit('leave-match', matchId);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [matchId]);

  const emit = useCallback((event, data) => {
    socketRef.current?.emit(event, data);
  }, []);

  return { socket: socketRef.current, emit };
}
