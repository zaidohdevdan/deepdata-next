"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { userCreateSchema, userUpdateSchema } from "@/lib/validators"
import { auth } from "@/lib/auth"

// Guard helper to ensure only admins can execute these actions
async function ensureAdmin() {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Não autorizado. Apenas administradores podem executar esta ação.")
  }
  return session
}

export async function getUsersAction() {
  await ensureAdmin()
  try {
    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        active: true,
        createdAt: true,
      },
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

export async function createUserAction(formData: unknown) {
  await ensureAdmin()

  const parsed = userCreateSchema.safeParse(formData)
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(", ")
    return { success: false, error: errorMsg }
  }

  const { username, name, password, role } = parsed.data

  try {
    const existing = await prisma.user.findUnique({
      where: { username },
    })

    if (existing) {
      return { success: false, error: "Este usuário já está cadastrado." }
    }

    const passwordHash = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        username,
        name,
        passwordHash,
        role,
        active: true,
      },
    })

    revalidatePath("/admin/usuarios")
    return { success: true }
  } catch (error) {
    console.error("Error creating user:", error)
    return { success: false, error: "Erro interno ao cadastrar usuário." }
  }
}

export async function updateUserAction(id: string, formData: unknown) {
  await ensureAdmin()

  const parsed = userUpdateSchema.safeParse(formData)
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(", ")
    return { success: false, error: errorMsg }
  }

  const { name, role, active, password } = parsed.data

  try {
    const updateData: { name?: string; role?: "ADMIN" | "USER"; active?: boolean; passwordHash?: string } = {}
    if (name) updateData.name = name
    if (role) updateData.role = role
    if (active !== undefined) updateData.active = active
    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10)
    }

    await prisma.user.update({
      where: { id },
      data: updateData,
    })

    revalidatePath("/admin/usuarios")
    return { success: true }
  } catch (error) {
    console.error("Error updating user:", error)
    return { success: false, error: "Erro ao atualizar os dados do usuário." }
  }
}

export async function toggleUserStatusAction(id: string, active: boolean) {
  const session = await ensureAdmin()
  
  // Protect self-deactivation
  if (id === session.user.id) {
    return { success: false, error: "Você não pode desativar seu próprio usuário." }
  }

  try {
    await prisma.user.update({
      where: { id },
      data: { active },
    })
    revalidatePath("/admin/usuarios")
    return { success: true }
  } catch (error) {
    console.error("Error toggling user status:", error)
    return { success: false, error: "Erro ao alterar status do usuário." }
  }
}
