"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { createAuditLogAction } from "./audit"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"

async function ensureAdmin() {
  const session = await auth()
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Acesso não autorizado. Apenas administradores podem gerenciar backups.")
  }
  return session
}

export async function exportDatabaseBackupAction() {
  await ensureAdmin()

  try {
    const [configs, alas, distribs, ocorrencias, categorias, visitas, users] = await Promise.all([
      prisma.configuracaoGlobal.findMany(),
      prisma.ala.findMany({ orderBy: { ordem: "asc" } }),
      prisma.distribAla.findMany(),
      prisma.ocorrencia.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.ocorrenciaCategoria.findMany(),
      prisma.visita.findMany({ orderBy: { senha: "asc" } }),
      prisma.user.findMany({
        select: {
          id: true,
          username: true,
          name: true,
          role: true,
          active: true,
        },
      }),
    ])

    const backupData = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      source: "DeepData Database",
      data: {
        configs,
        alas,
        distribs,
        ocorrencias,
        categorias,
        visitas,
        users,
      },
    }

    await createAuditLogAction({
      acao: "EXPORT_BACKUP_LOCAL",
      modulo: "ADMIN",
      detalhes: {
        timestamp: backupData.timestamp,
        visitasCount: visitas.length,
        alasCount: alas.length,
        ocorrenciasCount: ocorrencias.length,
      },
    })

    return { success: true, backupJson: JSON.stringify(backupData, null, 2) }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro desconhecido ao exportar backup."
    console.error("Erro ao exportar backup local:", error)
    return { success: false, error: message }
  }
}

export async function importDatabaseBackupAction(jsonString: string) {
  const session = await ensureAdmin()

  try {
    const parsed = JSON.parse(jsonString)
    if (!parsed.data || !parsed.version) {
      return { success: false, error: "Arquivo de backup inválido ou em formato incompatível." }
    }

    const { configs, alas, distribs, ocorrencias, categorias, visitas, users } = parsed.data

    await prisma.$transaction(async (tx) => {
      // 1. Restaurar configurações
      if (Array.isArray(configs)) {
        for (const cfg of configs) {
          if (cfg.chave && cfg.valor !== undefined) {
            await tx.configuracaoGlobal.upsert({
              where: { chave: cfg.chave },
              update: { valor: String(cfg.valor), descricao: cfg.descricao },
              create: { chave: cfg.chave, valor: String(cfg.valor), descricao: cfg.descricao },
            })
          }
        }
      }

      // 2. Restaurar usuários (se presentes no backup)
      if (Array.isArray(users)) {
        for (const u of users) {
          if (u.id && u.username) {
            await tx.user.upsert({
              where: { username: u.username },
              update: {
                name: u.name,
                role: u.role,
                active: u.active ?? true,
                ...(u.passwordHash ? { passwordHash: u.passwordHash } : {}),
              },
              create: {
                id: u.id,
                username: u.username,
                name: u.name,
                role: u.role,
                active: u.active ?? true,
                passwordHash: u.passwordHash || (await bcrypt.hash(process.env.INITIAL_USER_PASSWORD || "Usuario@Padrao123!", 10)),
              },
            })
          }
        }
      }

      // 3. Restaurar categorias de ocorrência
      if (Array.isArray(categorias)) {
        for (const cat of categorias) {
          if (cat.id && cat.nome) {
            await tx.ocorrenciaCategoria.upsert({
              where: { id: cat.id },
              update: { nome: cat.nome },
              create: { id: cat.id, nome: cat.nome },
            })
          }
        }
      }

      // 4. Restaurar alas e distribuições
      if (Array.isArray(alas)) {
        for (const ala of alas) {
          if (ala.id && ala.nome) {
            await tx.ala.upsert({
              where: { id: ala.id },
              update: { nome: ala.nome, ordem: ala.ordem ?? 0, ativa: ala.ativa ?? true },
              create: { id: ala.id, nome: ala.nome, ordem: ala.ordem ?? 0, ativa: ala.ativa ?? true },
            })
          }
        }
      }

      if (Array.isArray(distribs)) {
        for (const dist of distribs) {
          if (dist.modulo && dist.alaId) {
            await tx.distribAla.upsert({
              where: {
                modulo_alaId: {
                  modulo: dist.modulo,
                  alaId: dist.alaId,
                },
              },
              update: { internos: dist.internos ?? 0, dietas: dist.dietas ?? 0 },
              create: {
                modulo: dist.modulo,
                alaId: dist.alaId,
                internos: dist.internos ?? 0,
                dietas: dist.dietas ?? 0,
              },
            })
          }
        }
      }

      // 5. Restaurar visitas
      if (Array.isArray(visitas)) {
        await tx.visita.deleteMany()
        if (visitas.length > 0) {
          await tx.visita.createMany({
            data: visitas.map((v) => ({
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
              situacao: String(v.situacao || ""),
            })),
          })
        }
      }

      // 6. Restaurar ocorrências
      if (Array.isArray(ocorrencias)) {
        const fallbackAdmin = await tx.user.findFirst({ where: { role: "ADMIN" } })
        const fallbackUserId = session.user?.id || fallbackAdmin?.id

        for (const oc of ocorrencias) {
          if (oc.id && oc.titulo) {
            // Garante que a categoria existe
            let targetCatId = oc.categoriaId
            if (targetCatId) {
              const catExists = await tx.ocorrenciaCategoria.findUnique({ where: { id: targetCatId } })
              if (!catExists) {
                const createdCat = await tx.ocorrenciaCategoria.create({
                  data: { id: targetCatId, nome: `Categoria ${targetCatId.slice(-4)}` },
                })
                targetCatId = createdCat.id
              }
            } else {
              let defaultCat = await tx.ocorrenciaCategoria.findFirst()
              if (!defaultCat) {
                defaultCat = await tx.ocorrenciaCategoria.create({ data: { nome: "Geral" } })
              }
              targetCatId = defaultCat.id
            }

            // Garante que o usuário criador existe
            let targetUserId = oc.criadoPorId
            if (targetUserId) {
              const userExists = await tx.user.findUnique({ where: { id: targetUserId } })
              if (!userExists) {
                targetUserId = fallbackUserId
              }
            } else {
              targetUserId = fallbackUserId
            }

            if (targetCatId && targetUserId) {
              await tx.ocorrencia.upsert({
                where: { id: oc.id },
                update: {
                  titulo: oc.titulo,
                  categoriaId: targetCatId,
                  texto: oc.texto || "",
                  servidor: oc.servidor || "",
                  icone: oc.icone || "📋",
                },
                create: {
                  id: oc.id,
                  titulo: oc.titulo,
                  categoriaId: targetCatId,
                  texto: oc.texto || "",
                  servidor: oc.servidor || "",
                  icone: oc.icone || "📋",
                  criadoPorId: targetUserId,
                  createdAt: oc.createdAt ? new Date(oc.createdAt) : new Date(),
                },
              })
            }
          }
        }
      }
    })

    await createAuditLogAction({
      acao: "IMPORT_BACKUP_LOCAL",
      modulo: "ADMIN",
      detalhes: {
        timestamp: new Date().toISOString(),
        visitasCount: Array.isArray(visitas) ? visitas.length : 0,
      },
    })

    revalidatePath("/", "layout")
    return { success: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro desconhecido ao restaurar backup."
    console.error("Erro ao restaurar backup local:", error)
    return { success: false, error: message }
  }
}
