"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { ocorrenciaSchema } from "@/lib/validators"
import { auth } from "@/lib/auth"

import { createAuditLogAction } from "./audit"

import { Ocorrencia, OcorrenciaCategoria } from "@prisma/client"

async function ensureAuthenticated() {
  const session = await auth()
  if (!session) {
    throw new Error("Não autorizado. Você precisa estar autenticado.")
  }
  return session
}

type OcorrenciaComCategoria = Ocorrencia & {
  categoria: OcorrenciaCategoria
}

export async function getOcorrenciasAction() {
  await ensureAuthenticated()
  try {
    const list = await prisma.ocorrencia.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        categoria: true
      }
    })
    return list.map((o: OcorrenciaComCategoria) => ({
      ...o,
      categoria: o.categoria.nome
    }))
  } catch (error) {
    console.error("Error fetching ocorrencias:", error)
    return []
  }
}

export async function createOcorrenciaAction(formData: unknown) {
  const session = await ensureAuthenticated()

  const parsed = ocorrenciaSchema.safeParse(formData)
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(", ")
    return { success: false, error: errorMsg }
  }

  const { titulo, categoria: categoriaNome, icone, texto, servidor } = parsed.data

  try {
    let catRecord = await prisma.ocorrenciaCategoria.findUnique({
      where: { nome: categoriaNome.trim() }
    })
    if (!catRecord) {
      catRecord = await prisma.ocorrenciaCategoria.create({
        data: { nome: categoriaNome.trim() }
      })
    }

    const ocorrencia = await prisma.ocorrencia.create({
      data: {
        titulo,
        categoriaId: catRecord.id,
        icone,
        texto,
        servidor,
        criadoPorId: session.user.id,
      },
      include: {
        categoria: true
      }
    })

    // Auditoria
    await createAuditLogAction({
      acao: "CREATE_OCORRENCIA",
      modulo: "OCORRENCIAS",
      detalhes: {
        ocorrenciaId: ocorrencia.id,
        titulo: ocorrencia.titulo,
        categoria: catRecord.nome
      }
    })

    revalidatePath("/ocorrencias")
    return {
      success: true,
      data: {
        ...ocorrencia,
        categoria: ocorrencia.categoria.nome,
        createdAt: ocorrencia.createdAt.toISOString(),
        updatedAt: ocorrencia.updatedAt.toISOString(),
      }
    }
  } catch (error) {
    console.error("Error creating ocorrencia:", error)
    return { success: false, error: "Erro interno ao registrar ocorrência." }
  }
}

export async function updateOcorrenciaAction(id: string, formData: unknown) {
  const session = await ensureAuthenticated()

  const parsed = ocorrenciaSchema.safeParse(formData)
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(", ")
    return { success: false, error: errorMsg }
  }

  const { titulo, categoria: categoriaNome, icone, texto, servidor } = parsed.data

  try {
    const oldOcorrencia = await prisma.ocorrencia.findUnique({
      where: { id },
      include: { categoria: true }
    })

    let catRecord = await prisma.ocorrenciaCategoria.findUnique({
      where: { nome: categoriaNome.trim() }
    })
    if (!catRecord) {
      catRecord = await prisma.ocorrenciaCategoria.create({
        data: { nome: categoriaNome.trim() }
      })
    }

    const ocorrencia = await prisma.ocorrencia.update({
      where: { id },
      data: {
        titulo,
        categoriaId: catRecord.id,
        icone,
        texto,
        servidor,
        atualizadoPorId: session.user.id,
      },
      include: {
        categoria: true
      }
    })

    // Auditoria
    await createAuditLogAction({
      acao: "UPDATE_OCORRENCIA",
      modulo: "OCORRENCIAS",
      detalhes: {
        ocorrenciaId: id,
        antes: {
          titulo: oldOcorrencia?.titulo,
          categoria: oldOcorrencia?.categoria.nome,
          texto: oldOcorrencia?.texto
        },
        depois: {
          titulo: ocorrencia.titulo,
          categoria: catRecord.nome,
          texto: ocorrencia.texto
        }
      }
    })

    revalidatePath("/ocorrencias")
    return {
      success: true,
      data: {
        ...ocorrencia,
        categoria: ocorrencia.categoria.nome,
        createdAt: ocorrencia.createdAt.toISOString(),
        updatedAt: ocorrencia.updatedAt.toISOString(),
      }
    }
  } catch (error) {
    console.error("Error updating ocorrencia:", error)
    return { success: false, error: "Erro ao atualizar a ocorrência." }
  }
}

export async function deleteOcorrenciaAction(id: string) {
  await ensureAuthenticated()

  try {
    const oldOcorrencia = await prisma.ocorrencia.findUnique({
      where: { id },
      include: { categoria: true }
    })

    await prisma.ocorrencia.delete({
      where: { id },
    })

    // Auditoria
    await createAuditLogAction({
      acao: "DELETE_OCORRENCIA",
      modulo: "OCORRENCIAS",
      detalhes: {
        ocorrenciaId: id,
        titulo: oldOcorrencia?.titulo,
        categoria: oldOcorrencia?.categoria.nome
      }
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

// Ensures default categories exist in the database.
// Should only be called during app initialization (e.g., seed.js) or admin setup.
export async function ensureDefaultCategoriasAction() {
  await ensureAdmin()
  try {
    const count = await prisma.ocorrenciaCategoria.count()
    if (count === 0) {
      const defaults = ["Saúde", "Jurídico/Atendimento", "Operação/Rotina", "Escoltas", "Alimentação"]
      await prisma.ocorrenciaCategoria.createMany({
        data: defaults.map(name => ({ nome: name }))
      })
    }
    return { success: true }
  } catch (error) {
    console.error("Error seeding default categories:", error)
    return { success: false, error: "Erro ao criar categorias padrão." }
  }
}

export async function getCategoriasAction() {
  await ensureAuthenticated()
  try {
    return await prisma.ocorrenciaCategoria.findMany({
      orderBy: { nome: "asc" }
    })
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

import { isGeminiRequestAllowed } from "@/middleware/geminiRateLimit"

export async function generateOccurrenceTextAction(prompt: string) {
  const session = await ensureAuthenticated()
  const userId = session.user.id

  // 1. Rate Limiting por Usuário
  if (!isGeminiRequestAllowed(userId)) {
    return { 
      success: false, 
      error: "Limite de requisições excedido. Por favor, aguarde alguns minutos antes de tentar novamente." 
    }
  }

  // 2. Validação e Sanitização de Input (Tamanho e caracteres suspeitos)
  if (!prompt || !prompt.trim()) {
    return { success: false, error: "O resumo do fato é obrigatório." }
  }

  const cleanedPrompt = prompt.trim()
  if (cleanedPrompt.length > 1000) {
    return { success: false, error: "O resumo do fato é muito longo (máximo de 1000 caracteres)." }
  }

  // Sanitização básica contra injeções de prompt
  const sanitizedPrompt = cleanedPrompt
    .replace(/[<>]/g, "") // Remove potenciais tags HTML/XML para evitar injeções
    .substring(0, 1000)

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY

  if (!apiKey) {
    return { 
      success: false, 
      error: "A chave API do Gemini (GEMINI_API_KEY) não está configurada no servidor. Contate o administrador." 
    }
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Você é um assistente de redação oficial para policiais penais em uma unidade prisional (UPI-4). Escreva um texto formal, impessoal e detalhado em português para um livro de ocorrências com base no seguinte resumo fornecido. Escreva apenas o texto final da ocorrência, sem introduções, cumprimentos, observações ou caracteres de formatação Markdown extra (como asteriscos de negrito, a não ser que seja estritamente necessário para tabelas). Resumo: ${sanitizedPrompt}`,
                },
              ],
            },
          ],
        }),
      }
    )

    if (!response.ok) {
      const errBody = await response.text()
      console.error("Gemini API error response:", errBody)
      return { success: false, error: `Erro na API do Gemini: ${response.statusText}` }
    }

    const resData = await response.json()
    const generatedText = resData?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!generatedText) {
      return { success: false, error: "A resposta do modelo de IA veio vazia." }
    }

    return { success: true, text: generatedText.trim() }
  } catch (error: unknown) {
    console.error("Error generating occurrence text via AI:", error)
    const message = error instanceof Error ? error.message : "Erro de conexão ao servidor de IA."
    return { success: false, error: message }
  }
}


