"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { createAuditLogAction } from "./audit"

interface VisitaInput {
  prontuario?: number | string
  senha?: number | string
  custodiado?: string
  localizacao?: string
  ala?: string
  prioridade?: string
  cela?: string
  cpfVisitante?: string
  nomeVisitante?: string
  relacao?: string
  situacao?: string
}

async function ensureAuthenticated() {
  const session = await auth()
  if (!session) {
    throw new Error("Não autorizado. Você precisa estar autenticado.")
  }
  return session
}

async function ensureAdmin() {
  const session = await auth()
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Não autorizado. Apenas administradores podem limpar o histórico de visitas.")
  }
  return session
}

export async function getVisitasAction() {
  await ensureAuthenticated()
  try {
    const list = await prisma.visita.findMany({
      orderBy: { senha: "asc" }
    })
    return list
  } catch (error) {
    console.error("Erro ao obter visitas:", error)
    return []
  }
}

export async function saveVisitasAction(visitas: VisitaInput[]) {
  await ensureAuthenticated()
  try {
    // 1. Limpa todas as visitas existentes no banco de dados
    await prisma.visita.deleteMany()

    // 2. Insere os novos dados mapeados
    const dataToInsert = visitas.map((v) => ({
      prontuario: Number(v.prontuario || 0),
      senha: Number(v.senha || 0),
      custodiado: String(v.custodiado || ""),
      localizacao: String(v.localizacao || ""),
      ala: String(v.ala || ""),
      prioridade: String(v.prioridade || ""),
      cela: String(v.cela || ""),
      cpfVisitante: String(v.cpfVisitante || ""),
      nomeVisitante: String(v.nomeVisitante || ""),
      relacao: String(v.relacao || ""),
      situacao: String(v.situacao || "")
    }))

    if (dataToInsert.length > 0) {
      await prisma.visita.createMany({
        data: dataToInsert
      })
    }

    // 3. Registra auditoria
    await createAuditLogAction({
      acao: "IMPORT_VISITAS",
      modulo: "SISTEMA",
      detalhes: { count: dataToInsert.length }
    })

    revalidatePath("/sistema")
    return { success: true, count: dataToInsert.length }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro interno ao salvar visitas."
    console.error("Erro ao salvar visitas:", error)
    return { success: false, error: message }
  }
}

export async function clearVisitasAction() {
  await ensureAdmin()
  try {
    await prisma.visita.deleteMany()

    // Registra auditoria
    await createAuditLogAction({
      acao: "CLEAR_VISITAS",
      modulo: "SISTEMA",
      detalhes: { cleared: true }
    })

    revalidatePath("/sistema")
    return { success: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro ao limpar visitas."
    console.error("Erro ao limpar visitas:", error)
    return { success: false, error: message }
  }
}
