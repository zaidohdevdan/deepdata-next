"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { configSchema } from "@/lib/validators"
import { auth } from "@/lib/auth"

async function ensureAuthenticated() {
  const session = await auth()
  if (!session) {
    throw new Error("Não autorizado. Você precisa estar autenticado.")
  }
}

export async function saveGlobalConfigAction(formData: unknown) {
  await ensureAuthenticated()

  const parsed = configSchema.safeParse(formData)
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(", ")
    return { success: false, error: errorMsg }
  }

  const {
    nomeUnidade,
    localidade,
    alimentacaoCaixaCapacidade,
    cafeCapacitePacote,
    cafePaoesPorInterno,
    cafeLitrosPorGarrafa,
    biscoitoPorInterno,
    biscoitoCapacidadePacote,
    escalaPoliciaisFixos,
    equipeAlfa,
    equipeBravo,
    equipeEcho,
    equipeFox,
  } = parsed.data

  const session = await auth()
  const isAdmin = session?.user?.role === "ADMIN"

  let finalEquipeAlfa = equipeAlfa
  let finalEquipeBravo = equipeBravo
  let finalEquipeEcho = equipeEcho
  let finalEquipeFox = equipeFox

  if (!isAdmin) {
    const currentConfigs = await prisma.configuracaoGlobal.findMany({
      where: {
        chave: {
          in: ["equipeAlfa", "equipeBravo", "equipeEcho", "equipeFox"]
        }
      }
    })
    finalEquipeAlfa = currentConfigs.find(c => c.chave === "equipeAlfa")?.valor || "[]"
    finalEquipeBravo = currentConfigs.find(c => c.chave === "equipeBravo")?.valor || "[]"
    finalEquipeEcho = currentConfigs.find(c => c.chave === "equipeEcho")?.valor || "[]"
    finalEquipeFox = currentConfigs.find(c => c.chave === "equipeFox")?.valor || "[]"
  }

  try {
    const updates = [
      { chave: "nomeUnidade", valor: nomeUnidade, descricao: "Nome da Unidade Prisional" },
      { chave: "localidade", valor: localidade, descricao: "Nome da Localidade/Cidade" },
      {
        chave: "alimentacaoCaixaCapacidade",
        valor: String(alimentacaoCaixaCapacidade),
        descricao: "Capacidade da caixa de quentinhas (unidades)",
      },
      {
        chave: "cafeCapacitePacote",
        valor: String(cafeCapacitePacote),
        descricao: "Capacidade do pacote de pães (unidades)",
      },
      {
        chave: "cafePaoesPorInterno",
        valor: String(cafePaoesPorInterno),
        descricao: "Pães consumidos por interno no café",
      },
      {
        chave: "cafeLitrosPorGarrafa",
        valor: String(cafeLitrosPorGarrafa),
        descricao: "Litros de café por garrafa",
      },
      {
        chave: "biscoitoPorInterno",
        valor: String(biscoitoPorInterno),
        descricao: "Biscoitos consumidos por interno",
      },
      {
        chave: "biscoitoCapacidadePacote",
        valor: String(biscoitoCapacidadePacote),
        descricao: "Capacidade do pacote de biscoitos (unidades)",
      },
      {
        chave: "escalaPoliciaisFixos",
        valor: escalaPoliciaisFixos || "[]",
        descricao: "JSON de policiais fixos por posto e faixa",
      },
      {
        chave: "equipeAlfa",
        valor: finalEquipeAlfa || "[]",
        descricao: "JSON de policiais da equipe Alfa",
      },
      {
        chave: "equipeBravo",
        valor: finalEquipeBravo || "[]",
        descricao: "JSON de policiais da equipe Bravo",
      },
      {
        chave: "equipeEcho",
        valor: finalEquipeEcho || "[]",
        descricao: "JSON de policiais da equipe Echo",
      },
      {
        chave: "equipeFox",
        valor: finalEquipeFox || "[]",
        descricao: "JSON de policiais da equipe Fox",
      },
    ]

    const operations = updates.map((up) =>
      prisma.configuracaoGlobal.upsert({
        where: { chave: up.chave },
        update: { valor: up.valor },
        create: up,
      })
    )

    await prisma.$transaction(operations)

    revalidatePath("/", "layout")
    return { success: true }
  } catch (error) {
    console.error("Error saving global configurations:", error)
    return { success: false, error: "Erro interno ao salvar configurações." }
  }
}

export async function saveScaleConfigAction(
  tipo: "diurna" | "almoco" | "janta" | "noturna" | "alvorada",
  policiaisFixos: string,
  postosConfig: string,
  horaInicio?: string,
  horaFim?: string,
  numFaixas?: string
) {
  await ensureAuthenticated()

  try {
    const updates = [
      { chave: `escalaPoliciaisFixos_${tipo}`, valor: policiaisFixos, descricao: `JSON de policiais fixos da escala ${tipo}` },
      { chave: `escalaPostosConfig_${tipo}`, valor: postosConfig, descricao: `JSON de postos e limites da escala ${tipo}` },
    ]

    if (horaInicio) {
      updates.push({ chave: `escalaHoraInicio_${tipo}`, valor: horaInicio, descricao: `Horário de início padrão da escala ${tipo}` })
    }
    if (horaFim) {
      updates.push({ chave: `escalaHoraFim_${tipo}`, valor: horaFim, descricao: `Horário de fim padrão da escala ${tipo}` })
    }
    if (numFaixas) {
      updates.push({ chave: `escalaNumFaixas_${tipo}`, valor: numFaixas, descricao: `Quantidade padrão de turnos/faixas da escala ${tipo}` })
    }

    const operations = updates.map((up) =>
      prisma.configuracaoGlobal.upsert({
        where: { chave: up.chave },
        update: { valor: up.valor },
        create: up,
      })
    )

    await prisma.$transaction(operations)
    revalidatePath("/", "layout")
    return { success: true }
  } catch (error) {
    console.error(`Error saving scale config for ${tipo}:`, error)
    return { success: false, error: `Erro ao salvar configurações da escala ${tipo}.` }
  }
}
