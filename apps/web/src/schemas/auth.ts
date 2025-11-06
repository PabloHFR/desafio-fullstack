import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email ou nome de usuário é obrigatório")
    .trim(),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres").trim(),
});

export const registerSchema = z.object({
  email: z
    .string()
    .email("Email inválido")
    .min(1, "Email é obrigatório")
    .trim()
    .toLowerCase(),
  username: z
    .string()
    .min(3, "Nome de usuário deve ter no mínimo 3 caracteres")
    .max(30, "Nome de usuário deve ter no máximo 30 caracteres")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Nome de usuário pode conter apenas letras, números, _ e -"
    )
    .trim(),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres").trim(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
