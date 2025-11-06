import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, getErrorMessage } from "@/lib/api";
import type {
  Comment,
  CommentsResponse,
  CreateCommentRequest,
} from "@monorepo/types";

/**
 * Hook para gerenciar comentários
 */

// QUERY: Listar Comentários de uma Task
export const useComments = (taskId: string, page = 1, size = 10) => {
  return useQuery({
    queryKey: ["comments", taskId, page, size],
    queryFn: async () => {
      const response = await api.get<CommentsResponse>(
        `/tasks/${taskId}/comments`,
        {
          params: { page, size },
        }
      );
      return response.data;
    },
    enabled: !!taskId,
  });
};

// MUTATION: Criar Comentário
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      data,
    }: {
      taskId: string;
      data: CreateCommentRequest;
    }) => {
      const response = await api.post<Comment>(
        `/tasks/${taskId}/comments`,
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalida comentários da task
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.taskId],
      });

      toast.success("Comentário adicionado!");
    },
    onError: (error) => {
      toast.error("Erro ao adicionar comentário", {
        description: getErrorMessage(error),
      });
    },
  });
};
