import { create } from "zustand";
import { persist } from "zustand/middleware";
import { connectWebSocket, disconnectWebSocket } from "@/lib/websocket";
import type { UserResponse } from "@monorepo/types";

// Store de autenticação com Zustand
// - Persiste no localStorage
// - Gerencia tokens e user
// - Conecta/desconecta WebSocket automaticamente
interface AuthState {
  // Estado
  user: UserResponse | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  // Ações
  login: (
    user: UserResponse,
    accessToken: string,
    refreshToken: string
  ) => void;
  logout: () => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: UserResponse) => void;
}

export const authStore = create<AuthState>()(
  persist(
    (set) => ({
      // Estado inicial
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      // Login
      login: (user, accessToken, refreshToken) => {
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });

        // Conecta WebSocket com userId
        connectWebSocket(user.id);

        console.log("Login realizado:", user.username);
      },

      // Logout
      logout: () => {
        // Desconecta WebSocket
        disconnectWebSocket();

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });

        console.log("Logout realizado");
      },

      // Atualiza apenas tokens (usado no refresh)
      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken });
      },

      // Atualiza apenas user
      setUser: (user) => {
        set({ user });
      },
    }),
    {
      name: "auth-storage", // Nome no localStorage
      partialize: (state) => ({
        // Persiste apenas estes campos
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Reconecta WebSocket ao carregar a página (se estiver logado)
const state = authStore.getState();
if (state.isAuthenticated && state.user) {
  connectWebSocket(state.user.id);
}
