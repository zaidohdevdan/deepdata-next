import fs from "fs"
import path from "path"
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getDatabaseUrl(): string | undefined {
  // Na Vercel / AWS Lambda, o filesystem de deployment (/var/task) é READ-ONLY.
  // SQLite necessita de permissão de escrita para abrir o banco e gerenciar locks/WAL.
  // Por isso, copiamos o banco semeado para /tmp/local.db.
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpDb = "/tmp/local.db"
    if (!fs.existsSync(tmpDb)) {
      const candidates = [
        path.join(process.cwd(), "prisma", "local.db"),
        path.join(process.cwd(), "local.db"),
        path.join(__dirname, "..", "prisma", "local.db"),
        path.join(__dirname, "prisma", "local.db"),
      ]
      for (const cand of candidates) {
        if (fs.existsSync(cand)) {
          try {
            fs.copyFileSync(cand, tmpDb)
            break
          } catch (e) {
            console.error("Falha ao copiar local.db para /tmp:", e)
          }
        }
      }
    }
    return `file:${tmpDb}`
  }

  return undefined
}

const customUrl = getDatabaseUrl()

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(customUrl ? { datasourceUrl: customUrl } : {}),
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
