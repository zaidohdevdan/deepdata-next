# TASK.MD

## 🚨 EM OCORRÊNCIAS
- [] add uma Ia para auxiliar na elaboração de ocorrencias personalizadas. E que possa ser possível salvar os modelos de ocorrencias criados. E que possa ser possível adicionar novos modelos de ocorrencias. erro: A chave API do Gemini (GEMINI_API_KEY) não está configurada no servidor. Contate o administrador.

##  Problemas Críticos (ação imediata recomendada)
- [] Banco de dados SQLite commitado no Git
O arquivo prisma/dev.db (140 KB) está versionado no repositório público. Ele provavelmente contém:
-- Hashes de senhas de usuários (passwordHash)
-- Logs de auditoria com IPs
-- Dados de ocorrências
-- Possivelmente PII de visitas (nomes, CPFs — ver ponto 2)

Impacto: exposição de credenciais e dados sensíveis. Mesmo com bcrypt, hashes podem ser atacados offline.

- [] Contradição grave entre README e comportamento real (LGPD).
-- O README declara enfaticamente:

Os dados contidos nos relatórios de visitas importados (Nomes de visitantes, CPFs, Nomes de internos e prontuários) nunca são enviados ou gravados no banco de dados do servidor.

E o modelo Visita no schema.prisma armazena explicitamente cpfVisitante, nomeVisitante, custodiado. A página sistema/page.tsx carrega tudo do banco via getVisitasAction().

Isto é uma violação documental e técnica de LGPD — o sistema diz tratar dados de forma privacy-first mas persiste PII sensível de visitantes e custodiados no servidor. Para um sistema prisional, isto pode configurar incidente de segurança reportável.

Ação: ou (a) voltar para o modelo localStorage-only removendo o modelo Visita e a saveVisitasAction, ou (b) atualizar o README, criptografar os campos sensíveis em repouso, e documentar a base legal para o tratamento.
- [] Cliente Prisma gerado commitado.
O diretório prisma/generated-client/ (com binário libquery_engine-debian-openssl-3.0.x.so.node, .wasm e vários .js) está no repositório. Isto:

Incha o repo em dezenas de MB
É específico de plataforma (quebraria em macOS/Windows)
Deveria ser regerado em cada npm install
Ação: adicionar prisma/generated-client/ ao .gitignore e remover do git.

-[]  Inconsistência de provider de banco
schema.prisma declara provider = "postgresql", mas lib/prisma.ts faz fallback para file:./dev.db (SQLite). Isto é contraditório: o Prisma não consegue usar SQLite com um schema declarado como postgresql. O dev.db provavelmente é um resquício antigo e a config atual espera um DATABASE_URL Postgres real — mas isto não está documentado de forma clara.
## Problemas Moderados
- [] Uso extensivo de any
detalhes: any no AuditLogPayload (audit.ts)
visitas: any[] em saveVisitasAction
window as any em sistema/page.tsx para o pdf.js
error: any em vários catches
Isto enfraquece a segurança de tipos que o TypeScript deveria prover.

-[] Chave de API do Gemini sem proteção adicional
generateOccurrenceTextAction envia prompts do usuário para o Gemini sem:

Rate limiting
Sanitização profunda do prompt (potencial prompt injection)
Log de uso para auditoria

- [] Sem rate limiting no login
authorize() em lib/auth.ts não tem proteção contra brute-force. Para um sistema prisional, considere @upstash/ratelimit ou middleware equivalente.

- [] Cobertura de testes baixa
Existe apenas 1 arquivo de teste (tests/escalas.test.ts) cobrindo 5 casos de lógica matemática. Não há testes para:

Server Actions (auth guards, validação)
Validators Zod
Parsers de PDF/Excel
Hooks customizados

- [] Sem middleware global de auth
A proteção de rotas é feita em cada layout.tsx individualmente (if (!session) redirect("/login")). Um middleware.ts na raiz seria mais robusto e DRY.

- [] Arquivos de planilha no public/
public/visitas.xlsx e public/confere.xls estão no repositório. Se contiverem dados reais de visitas, é mais uma exposição de PII.

- [] Poluição de repositório
Pasta scratch/ com scripts JS de debug (check_divs.js, find_mismatch.js, parse_ast.js, parse_jsx_hierarchy.js) — parecem ferramentas temporárias
Arquivos :Zone.Identifier (mark-of-the-web do Windows) commitados: public/visitas.xlsx:Zone.Identifier, public/confere.xls:Zone.Identifier

- [] Sem CI/CD visível
Não há .github/workflows/ — lint, type-check e testes não rodam automaticamente em PRs.

## 🖨️ TRATAMENTO DE IMPRESSÃO

## 👥 VISITA COMUM
