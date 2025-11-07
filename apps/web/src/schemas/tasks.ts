import { TaskPriority, TaskStatus } from "@monorepo/types";
import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(3, "O título deve ter no mínimo 3 caracteres")
    .max(100, "O título deve ter no máximo 100 caracteres")
    .trim(),
  description: z
    .string()
    .min(10, "A descrição deve ter no mínimo 10 caracteres")
    .max(1000, "A descrição deve ter no máximo 1000 caracteres")
    .trim(),
  deadline: z.string().optional(), // ISO string
  priority: z.nativeEnum(TaskPriority).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  assignedTo: z.array(z.string().uuid()).optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;
