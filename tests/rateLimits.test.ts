import { describe, it, expect, beforeEach, vi } from "vitest"
import { isGeminiRequestAllowed } from "../middleware/geminiRateLimit"
import { ensureLoginAllowed } from "../middleware/loginRateLimit"

describe("Rate Limiters", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  describe("Gemini Rate Limiter", () => {
    it("deve permitir requisições até o limite e bloquear após exceder", () => {
      const userId = "user_test_1"

      // Envia 10 requisições permitidas
      for (let i = 0; i < 10; i++) {
        expect(isGeminiRequestAllowed(userId)).toBe(true)
      }

      // A 11ª deve ser bloqueada
      expect(isGeminiRequestAllowed(userId)).toBe(false)

      // Avança o tempo em 5 minutos (janela padrão)
      vi.advanceTimersByTime(5 * 60 * 1000 + 1)

      // Deve permitir novamente
      expect(isGeminiRequestAllowed(userId)).toBe(true)
    })
  })

  describe("Login Rate Limiter", () => {
    it("deve bloquear o login após 5 tentativas falhas", async () => {
      const username = "admin_test"

      for (let i = 0; i < 5; i++) {
        expect(await ensureLoginAllowed(username)).toBe(true)
      }

      expect(await ensureLoginAllowed(username)).toBe(false)

      // Avança o tempo em 15 minutos (janela padrão de login)
      vi.advanceTimersByTime(15 * 60 * 1000 + 1)

      expect(await ensureLoginAllowed(username)).toBe(true)
    })
  })
})
