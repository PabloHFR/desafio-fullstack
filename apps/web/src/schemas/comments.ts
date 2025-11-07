import { z } from "zod";

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "O comentário não pode estar vazio")
    .max(500, "O comentário deve ter no máximo 500 caracteres")
    .trim(),
});

export type CreateCommentFormData = z.infer<typeof createCommentSchema>;
