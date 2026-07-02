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
    const ocorrencia = await prisma.ocorrencia.create({
      data: {
        titulo,
        categoria,
        icone,
        texto,
        servidor,
      },
    })

    revalidatePath("/ocorrencias")
    return {
      success: true,
      data: {
        ...ocorrencia,
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
  await ensureAuthenticated()

  const parsed = ocorrenciaSchema.safeParse(formData)
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(", ")
    return { success: false, error: errorMsg }
  }

  const { titulo, categoria, icone, texto, servidor } = parsed.data

  try {
    const ocorrencia = await prisma.ocorrencia.update({
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
    return {
      success: true,
      data: {
        ...ocorrencia,
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

export async function generateOccurrenceTextAction(prompt: string) {
  await ensureAuthenticated()

  if (!prompt || !prompt.trim()) {
    return { success: false, error: "O resumo do fato é obrigatório." }
  }

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
                  text: `Você é um assistente de redação oficial para policiais penais em uma unidade prisional (UPI-4). Escreva um texto formal, impessoal e detalhado em português para um livro de ocorrências com base no seguinte resumo fornecido. Escreva apenas o texto final da ocorrência, sem introduções, cumprimentos, observações ou caracteres de formatação Markdown extra (como asteriscos de negrito, a não ser que seja estritamente necessário para tabelas). Resumo: ${prompt.trim()}`,
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
  } catch (error: any) {
    console.error("Error generating occurrence text via AI:", error)
    return { success: false, error: error.message || "Erro de conexão ao servidor de IA." }
  }
}


