import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { loginSchema } from "@/lib/validators"

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        username: { label: "Usuário", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const cleanUsername = parsed.data.username.trim().toLowerCase()
        const cleanPassword = parsed.data.password.trim()

        const { ensureLoginAllowed, clearLoginAttempts } = await import('@/middleware/loginRateLimit')
        const loginAllowed = await ensureLoginAllowed(cleanUsername)
        if (!loginAllowed) return null

        let user = null
        try {
          user = await prisma.user.findFirst({
            where: { username: cleanUsername, active: true },
          })
        } catch (err) {
          console.error("Erro ao consultar usuário no banco:", err)
        }

        if (!user) return null

        const valid = await bcrypt.compare(cleanPassword, user.passwordHash)
        if (!valid) return null

        clearLoginAttempts(cleanUsername)

        return {
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = (user as { username?: string }).username
        token.role = (user as { role?: string }).role
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.username = token.username as string
        session.user.role = (token.role as string) || "ADMIN"
        session.user.name = (token.name as string) || session.user.name || "Administrador"
      }
      return session
    },
  },
})
