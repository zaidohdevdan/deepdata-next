"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { ocorrenciaSchema } from "@/lib/validators"
import { auth } from "@/lib/auth"

async function ensureAuthenticated() {
  const session = await auth()
  if (!session) {
    throw new Error("Não autorizado. Você precisa estar autenticado.")
  }
  return session
}

export async function getOcorrenciasAction() {
  await ensureAuthenticated()
  try {
    return await prisma.ocorrencia.findMany({
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    console.error("Error fetching ocorrencias:", error)
    return []
  }
}

export async function createOcorrenciaAction(formData: unknown) {
  await ensureAuthenticated()

  const parsed = ocorrenciaSchema.safeParse(formData)
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(", ")
    return { success: false, error: errorMsg }
  }

  const { titulo, categoria, icone, texto, servidor } = parsed.data

  try {
    await prisma.ocorrencia.create({
      data: {
        titulo,
        categoria,
        icone,
        texto,
        servidor,
      },
    })

    revalidatePath("/ocorrencias")
    return { success: true }
  } catch (error) {
    console.error("Error creating ocorrencia:", error)
    return { success: false, error: "Erro interno ao registrar ocorrência." }
  }
}

export async function updateOcorrenciaAction(id: string, formData: unknown) {
  await ensureAuthenticated()

  const parsed = ocorrenciaSchema.safeParse(formData)
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(", ")
    return { success: false, error: errorMsg }
  }

  const { titulo, categoria, icone, texto, servidor } = parsed.data

  try {
    await prisma.ocorrencia.update({
      where: { id },
      data: {
        titulo,
        categoria,
        icone,
        texto,
        servidor,
      },
    })

    revalidatePath("/ocorrencias")
    return { success: true }
  } catch (error) {
    console.error("Error updating ocorrencia:", error)
    return { success: false, error: "Erro ao atualizar a ocorrência." }
  }
}

export async function deleteOcorrenciaAction(id: string) {
  await ensureAuthenticated()

  try {
    await prisma.ocorrencia.delete({
      where: { id },
    })

    revalidatePath("/ocorrencias")
    return { success: true }
  } catch (error) {
    console.error("Error deleting ocorrencia:", error)
    return { success: false, error: "Erro ao excluir a ocorrência." }
  }
}

async function ensureAdmin() {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Não autorizado. Apenas administradores podem executar esta ação.")
  }
  return session
}

export async function getCategoriasAction() {
  await ensureAuthenticated()
  try {
    const list = await prisma.ocorrenciaCategoria.findMany({
      orderBy: { nome: "asc" }
    })
    
    if (list.length === 0) {
      const defaults = ["Saúde", "Jurídico/Atendimento", "Operação/Rotina", "Escoltas", "Alimentação"]
      await prisma.ocorrenciaCategoria.createMany({
        data: defaults.map(name => ({ nome: name }))
      })
      return await prisma.ocorrenciaCategoria.findMany({
        orderBy: { nome: "asc" }
      })
    }
    
    return list
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export async function createCategoriaAction(nome: string) {
  await ensureAdmin()
  
  if (!nome || !nome.trim()) {
    return { success: false, error: "O nome da categoria é obrigatório." }
  }

  try {
    const cleaned = nome.trim()
    const existing = await prisma.ocorrenciaCategoria.findUnique({
      where: { nome: cleaned }
    })

    if (existing) {
      return { success: false, error: "Esta categoria já existe." }
    }

    await prisma.ocorrenciaCategoria.create({
      data: { nome: cleaned }
    })

    revalidatePath("/ocorrencias")
    return { success: true }
  } catch (error) {
    console.error("Error creating category:", error)
    return { success: false, error: "Erro ao cadastrar categoria." }
  }
}

