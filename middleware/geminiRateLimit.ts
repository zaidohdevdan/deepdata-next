// middleware/geminiRateLimit.ts
// Limitador de taxa simples em memória para requisições ao Gemini.
// Permite até 10 requisições a cada 5 minutos por ID de usuário.

interface RateLimitInfo {
  timestamps: number[];
}

const RATE_LIMIT_MAX = 10; // máximo de 10 chamadas
const WINDOW_MS = 5 * 60 * 1000; // janela de 5 minutos

const userRequestMap: Map<string, RateLimitInfo> = new Map();

/**
 * Verifica se um usuário específico pode realizar a chamada de IA.
 * Retorna true se a requisição for permitida, false se exceder o limite.
 */
export function isGeminiRequestAllowed(userId: string): boolean {
  const now = Date.now();
  const info = userRequestMap.get(userId) ?? { timestamps: [] };

  // Filtra e mantém apenas requisições dentro da janela de tempo atual
  info.timestamps = info.timestamps.filter((ts) => now - ts < WINDOW_MS);

  if (info.timestamps.length >= RATE_LIMIT_MAX) {
    return false;
  }

  info.timestamps.push(now);
  userRequestMap.set(userId, info);
  return true;
}
