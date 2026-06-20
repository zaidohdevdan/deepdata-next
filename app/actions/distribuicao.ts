"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Modulo } from "@prisma/client"

export interface AlaDistribData {
  id: string // alaId
  nome: string
  internos: number
  dietas: number
}

// Fetch all active Alas and their corresponding DistribAla for a modulo
export async function getDistribuicaoData(modulo: Modulo): Promise<AlaDistribData[]> {
  try {
    const alas = await prisma.ala.findMany({
      where: { ativa: true },
      orderBy: { ordem: "asc" },
      include: {
        distribs: {
          where: { modulo },
        },
      },
    })

    return alas.map((ala) => {
      const distrib = ala.distribs[0]
      return {
        id: ala.id,
        nome: ala.nome,
        internos: distrib?.internos ?? 0,
        dietas: distrib?.dietas ?? 0,
      }
    })
  } catch (error) {
    console.error(`Error fetching distribution for ${modulo}:`, error)
    return []
  }
}

// Save all distribution entries for a modulo
export async function saveDistribuicaoData(
  modulo: Modulo,
  data: { id: string; internos: number; dietas: number }[]
) {
  try {
    const operations = data.map((item) => {
      return prisma.distribAla.upsert({
        where: {
          modulo_alaId: {
            modulo,
            alaId: item.id,
          },
        },
        update: {
          internos: item.internos,
          dietas: item.dietas,
        },
        create: {
          modulo,
          alaId: item.id,
          internos: item.internos,
          dietas: item.dietas,
        },
      })
    })

    await prisma.$transaction(operations)
    revalidatePath(`/${modulo.toLowerCase()}`)
    return { success: true }
  } catch (error) {
    console.error("Error saving distribution data:", error)
    return { success: false, error: "Falha ao salvar os dados no banco de dados." }
  }
}

// Reset all distribution entries for a modulo to 0
export async function clearDistribuicaoData(modulo: Modulo) {
  try {
    await prisma.distribAla.updateMany({
      where: { modulo },
      data: {
        internos: 0,
        dietas: 0,
      },
    })
    revalidatePath(`/${modulo.toLowerCase()}`)
    return { success: true }
  } catch (error) {
    console.error(`Error clearing distribution for ${modulo}:`, error)
    return { success: false, error: "Erro ao resetar os valores." }
  }
}

// Add a new Ala and seed empty distribution for all modulos
export async function addAlaAction(nome: string) {
  try {
    const existing = await prisma.ala.findUnique({
      where: { nome: nome.trim().toUpperCase() },
    })

    if (existing) {
      if (existing.ativa) {
        return { success: false, error: "Uma ala com este nome já existe e está ativa." }
      } else {
        // Reactivate
        await prisma.ala.update({
          where: { id: existing.id },
          data: { ativa: true },
        })
        revalidatePath("/(dashboard)", "layout")
        return { success: true }
      }
    }

    const count = await prisma.ala.count()

    const dbAla = await prisma.ala.create({
      data: {
        nome: nome.trim().toUpperCase(),
        ordem: count + 1,
        ativa: true,
      },
    })

    // Seed empty distributions
    const modulos: Modulo[] = ["ALIMENTACAO", "CAFE", "BISCOITO"]
    const seedDistribs = modulos.map((modulo) =>
      prisma.distribAla.create({
        data: {
          modulo,
          alaId: dbAla.id,
          internos: 0,
          dietas: 0,
        },
      })
    )

    await prisma.$transaction(seedDistribs)
    revalidatePath("/(dashboard)", "layout")
    return { success: true }
  } catch (error) {
    console.error("Error adding ala:", error)
    return { success: false, error: "Erro ao criar nova ala." }
  }
}

// Soft delete / deactivate an Ala
export async function deleteAlaAction(alaId: string) {
  try {
    await prisma.ala.update({
      where: { id: alaId },
      data: { ativa: false },
    })
    revalidatePath("/(dashboard)", "layout")
    return { success: true }
  } catch (error) {
    console.error("Error deleting ala:", error)
    return { success: false, error: "Erro ao remover a ala." }
  }
}
