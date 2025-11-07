import { authStore } from "@/stores/authStore";
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

// Base URL da API (API Gateway)
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Instância do Axios configurada para a API
// - Intercepta requisições para adicionar token
// - Intercepta respostas para tratar erros
// - Refresh token automático em caso de 401
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR
// Adiciona token JWT em todas as requisições
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authStore.getState().accessToken;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR
// Trata erros e refresh token automático
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Se for 401 (não autorizado) e não for rota de auth, tenta refresh
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/")
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = authStore.getState().refreshToken;

        if (!refreshToken) {
          // Não tem refresh token, desloga
          authStore.getState().logout();
          return Promise.reject(error);
        }

        // Tenta renovar o token
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
          {
            headers: {
              Authorization: `Bearer ${authStore.getState().accessToken}`,
            },
          }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Atualiza tokens no store
        authStore.getState().setTokens(accessToken, newRefreshToken);

        // Refaz a requisição original com novo token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh falhou, desloga
        authStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Extrair mensagem de erro
export const getErrorMessage = (error: Error): string => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.message ||
      "Ocorreu um erro inesperado"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Ocorreu um erro inesperado";
};
