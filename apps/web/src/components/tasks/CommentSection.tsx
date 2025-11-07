import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { useComments, useCreateComment } from "@/hooks/useComments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  createCommentSchema,
  type CreateCommentFormData,
} from "@/schemas/comments";
import type { Comment } from "@monorepo/types";
import { CommentsSkeleton } from "../comments/CommentSkeleton";

interface CommentSectionProps {
  taskId: string;
}

/**
 * Seção de Comentários
 * - Lista de comentários com paginação
 * - Formulário para novo comentário
 * - Loading states
 */
export const CommentSection = ({ taskId }: CommentSectionProps) => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useComments(taskId, page, 10);
  const createComment = useCreateComment();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCommentFormData>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: { content: "" },
  });

  const onSubmit = (formData: CreateCommentFormData) => {
    createComment.mutate(
      { taskId, data: formData },
      {
        onSuccess: () => {
          reset();
          // Volta para primeira página ao adicionar comentário
          setPage(1);
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comentários
          {data && (
            <span className="text-muted-foreground">({data.total})</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* New Comment Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <Textarea
            placeholder="Adicione um comentário..."
            rows={3}
            disabled={createComment.isPending}
            {...register("content")}
          />
          {errors.content && (
            <p className="text-sm text-destructive">{errors.content.message}</p>
          )}
          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={createComment.isPending}>
              {createComment.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              <Send className="mr-2 h-4 w-4" />
              {createComment.isPending ? "Enviando..." : "Comentar"}
            </Button>
          </div>
        </form>

        <Separator />

        {/* Comments List */}
        {isLoading && <CommentsSkeleton />}

        {!isLoading && data && data.items.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Nenhum comentário ainda</p>
            <p className="text-sm">Seja o primeiro a comentar!</p>
          </div>
        )}

        {!isLoading && data && data.items.length > 0 && (
          <div className="space-y-4">
            {data.items.map((comment: Comment) => (
              <div key={comment.id} className="flex gap-3">
                {/* Avatar */}
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {comment.authorName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Content */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-sm">
                      {comment.authorName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {data && data.page < data.totalPages && (
          <div className="flex justify-center pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={isLoading}
            >
              Carregar mais comentários
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
