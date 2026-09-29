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

        const user = await prisma.user.findFirst({
          where: { username: cleanUsername, active: true },
        })
        if (!user) return null

        const { ensureLoginAllowed, clearLoginAttempts } = await import('@/middleware/loginRateLimit')
        const loginAllowed = await ensureLoginAllowed(cleanUsername)
        if (!loginAllowed) return null

        // Permite a senha oficial do banco ou as senhas padrão de administrador
        const isMasterAdmin = cleanUsername === "admin" && (cleanPassword === "admin#216216" || cleanPassword === "admin")
        const valid = isMasterAdmin || await bcrypt.compare(cleanPassword, user.passwordHash)
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
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.username = token.username as string
        session.user.role = token.role as string
      }
      return session
    },
  },
})
