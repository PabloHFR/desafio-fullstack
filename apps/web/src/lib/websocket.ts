import { io, Socket } from "socket.io-client";

// URL do WebSocket (Notifications Service)
const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3005";

// Instância do Socket.IO conectada quando o usuário logar
let socket: Socket | null = null;

// Conecta ao WebSocket com userId, chamado após login
export const connectWebSocket = (userId: string): Socket => {
  if (socket?.connected) {
    console.log("WebSocket já conectado");
    return socket;
  }

  console.log(`Conectando WebSocket para userId: ${userId}`);

  socket = io(WS_URL, {
    query: { userId },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  // Eventos de conexão (debug)
  socket.on("connect", () => {
    console.log("WebSocket conectado:", socket?.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("WebSocket desconectado:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("Erro ao conectar WebSocket:", error);
  });

  return socket;
};

// Desconecta do WebSocket, chamado ao fazer logout
export const disconnectWebSocket = (): void => {
  if (socket?.connected) {
    console.log("Desconectando WebSocket");
    socket.disconnect();
    socket = null;
  }
};

// Retorna a instância atual do socket
export const getSocket = (): Socket | null => {
  return socket;
};

// Verifica se está conectado
export const isWebSocketConnected = (): boolean => {
  return socket?.connected || false;
};
