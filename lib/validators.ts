import { z } from "zod"

export const loginSchema = z.object({
  username: z.string().min(1, "Usuário é obrigatório").max(50),
  password: z.string().min(1, "Senha é obrigatória").max(100),
})

export const userCreateSchema = z.object({
  username: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(30, "Máximo 30 caracteres")
    .regex(/^[a-z0-9_]+$/, "Apenas letras minúsculas, números e underscore"),
  name: z.string().min(2, "Nome é obrigatório").max(100),
  password: z.string().min(6, "Mínimo 6 caracteres").max(100),
  role: z.enum(["ADMIN", "USER"]).default("USER"),
})

export const userUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  password: z.string().min(6).max(100).optional(),
  role: z.enum(["ADMIN", "USER"]).optional(),
  active: z.boolean().optional(),
})

export const configSchema = z.object({
  nomeUnidade: z.string().min(1).max(100),
  localidade: z.string().min(1).max(100),
  alimentacaoCaixaCapacidade: z.coerce.number().int().min(1),
  cafeCapacitePacote: z.coerce.number().int().min(1),
  cafePaoesPorInterno: z.coerce.number().int().min(1),
  cafeLitrosPorGarrafa: z.coerce.number().int().min(1),
  biscoitoPorInterno: z.coerce.number().int().min(1),
  biscoitoCapacidadePacote: z.coerce.number().int().min(1),
  escalaPoliciaisFixos: z.string().optional(),
  equipeAlfa: z.string().optional(),
  equipeBravo: z.string().optional(),
  equipeEcho: z.string().optional(),
  equipeFox: z.string().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type UserCreateInput = z.infer<typeof userCreateSchema>
export type UserUpdateInput = z.infer<typeof userUpdateSchema>
export type ConfigInput = z.infer<typeof configSchema>

export const ocorrenciaSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório").max(150, "Máximo 150 caracteres"),
  categoria: z.string().min(1, "Categoria é obrigatória").max(100),
  icone: z.string().max(10).default("📋"),
  texto: z.string().min(1, "Texto é obrigatório"),
  servidor: z.string().min(1, "Servidor é obrigatório").max(150),
})

export type OcorrenciaInput = z.infer<typeof ocorrenciaSchema>

