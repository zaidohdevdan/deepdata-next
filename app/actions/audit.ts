"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

interface AuditLogPayload {
  acao: string       // Ex: "CREATE_OCORRENCIA", "UPDATE_ESCALA", "DELETE_USER"
  modulo: string     // Ex: "AUTENTICACAO", "OCORRENCIAS", "ESCALAS", "ADMIN", "CONFIGURACOES", "DISTRIBUICAO"
  detalhes: any      // Qualquer objeto contendo dados de antes/depois da alteração
}

/**
 * Cria um registro de auditoria associado ao usuário atualmente autenticado.
 * Não lança erros para o usuário se falhar, apenas registra no console.
 */
export async function createAuditLogAction(payload: AuditLogPayload) {
  try {
    const session = await auth()
    if (!session || !session.user || !session.user.id) {
      return
    }

    const userId = session.user.id
    const detalhesStr = JSON.stringify(payload.detalhes || {})

    await prisma.auditLog.create({
      data: {
        userId,
        acao: payload.acao,
        modulo: payload.modulo,
        detalhes: detalhesStr,
      },
    })
  } catch (error) {
    console.error("Failed to create audit log:", error)
  }
}
