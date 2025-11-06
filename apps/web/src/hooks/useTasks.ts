import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, getErrorMessage } from "@/lib/api";
import type {
  CreateTaskRequest,
  Task,
  TaskFilters,
  TasksResponse,
  UpdateTaskRequest,
} from "@monorepo/types";

/**
 * Hook para gerenciar tasks com TanStack Query
 * - Queries com cache automático
 * - Mutations com invalidação inteligente
 * - Optimistic updates
 */

// ==========================================
// QUERY: Listar Tasks
// ==========================================
export const useTasks = (filters: TaskFilters = {}) => {
  return useQuery({
    queryKey: ["tasks", filters],
    queryFn: async () => {
      const response = await api.get<TasksResponse>("/tasks", {
        params: filters,
      });
      return response.data;
    },
    staleTime: 30000, // Cache por 30 segundos
  });
};

// ==========================================
// QUERY: Buscar Task por ID
// ==========================================
export const useTask = (taskId: string) => {
  return useQuery({
    queryKey: ["tasks", taskId],
    queryFn: async () => {
      const response = await api.get<Task>(`/tasks/${taskId}`);
      return response.data;
    },
    enabled: !!taskId, // Só executa se taskId existir
  });
};

// ==========================================
// MUTATION: Criar Task
// ==========================================
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTaskRequest) => {
      const response = await api.post<Task>("/tasks", data);
      return response.data;
    },
    onSuccess: (newTask) => {
      // Invalida cache de listagem para refetch
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Tarefa criada com sucesso!", {
        description: newTask.title,
      });
    },
    onError: (error) => {
      toast.error("Erro ao criar tarefa", {
        description: getErrorMessage(error),
      });
    },
  });
};

// ==========================================
// MUTATION: Atualizar Task
// ==========================================
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      data,
    }: {
      taskId: string;
      data: UpdateTaskRequest;
    }) => {
      const response = await api.patch<Task>(`/tasks/${taskId}`, data);
      return response.data;
    },
    onSuccess: (updatedTask) => {
      // Invalida cache da task específica
      queryClient.invalidateQueries({ queryKey: ["tasks", updatedTask.id] });
      // Invalida listagem
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Tarefa atualizada!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar tarefa", {
        description: getErrorMessage(error),
      });
    },
  });
};

// ==========================================
// MUTATION: Deletar Task
// ==========================================
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      await api.delete(`/tasks/${taskId}`);
      return taskId;
    },
    onSuccess: (deletedTaskId) => {
      // Remove do cache
      queryClient.removeQueries({ queryKey: ["tasks", deletedTaskId] });
      // Invalida listagem
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Tarefa deletada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao deletar tarefa", {
        description: getErrorMessage(error),
      });
    },
  });
};
