// proxy.ts
// Proxy raiz do Next.js 16+ (substitui o middleware.ts depreciado).
// Delega a requisição para os middlewares específicos para manter a organização.

import type { NextRequest } from 'next/server';
import { middleware as authGuard } from './middleware/authGuard';

export async function proxy(request: NextRequest) {
  // Executa o guard de autenticação global
  return authGuard(request);
}

export const config = {
  // Executa em todas as rotas exceto arquivos estáticos
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
