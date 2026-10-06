"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

async function ensureAuthenticated() {
  const session = await auth()
  if (!session) {
    throw new Error("Não autorizado. Você precisa estar autenticado.")
  }
}

async function ensureAdmin() {
  const session = await auth()
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Não autorizado. Apenas administradores podem alterar os chefes de equipe.")
  }
}

export interface ChefeEquipe {
  id: string
  nome: string
  matricula: string
  equipes: string[] // ['alfa', 'bravo', 'charlie', 'delta']
}

export async function getChefesAction() {
  await ensureAuthenticated()
  try {
    const config = await prisma.configuracaoGlobal.findUnique({
      where: { chave: "chefesEquipe" }
    })
    if (!config) return []
    return JSON.parse(config.valor) as ChefeEquipe[]
  } catch (error) {
    console.error("Error fetching chefes de equipe:", error)
    return []
  }
}

export async function saveChefesAction(chefes: ChefeEquipe[]) {
  await ensureAdmin()
  try {
    await prisma.configuracaoGlobal.upsert({
      where: { chave: "chefesEquipe" },
      update: { valor: JSON.stringify(chefes) },
      create: {
        chave: "chefesEquipe",
        valor: JSON.stringify(chefes),
        descricao: "Cadastro de chefes de equipe e suas vinculações às escalas"
      }
    })
    revalidatePath("/", "layout")
    return { success: true }
  } catch (error) {
    console.error("Error saving chefes de equipe:", error)
    return { success: false, error: "Erro ao salvar chefes de equipe." }
  }
}
