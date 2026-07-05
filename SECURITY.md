# Diretrizes de Segurança - DeepData Next (UPI-4)

Este documento descreve as práticas de segurança e conformidade adotadas no projeto para garantir a integridade dos dados e a proteção de Informações Pessoais Identificáveis (PII), em conformidade com a LGPD.

## 🛡️ Proteção de PII & LGPD
- **Processamento no Cliente:** O processamento de dados confidenciais de visitantes (nomes, CPFs, relatórios) ocorre estritamente no lado do cliente (memória do navegador). Nenhum dado nominal de visitante ou custodiado é enviado ao banco de dados do servidor central.
- **Armazenamento Seguro:** As escalas operacionais e quantitativos de alimentação armazenam apenas dados agregados e numéricos.

## 🔑 Gerenciamento de Segredos e Credenciais
- **Sem Segredos no Código:** Nenhuma chave de API (como `GEMINI_API_KEY`), credencial de banco de dados (`DATABASE_URL`) ou segredo de assinatura JWT (`AUTH_SECRET`) deve ser versionada ou incluída diretamente no código-fonte.
- **Variáveis de Ambiente:** Todos os segredos são injetados exclusivamente via variáveis de ambiente (`.env` em desenvolvimento e variáveis secretas em produção).
- **Gitignore Rígido:** O arquivo `.env` está explicitamente no `.gitignore` para prevenir commits acidentais.

## 🛑 Limitação de Taxa (Rate Limiting)
- **Autenticação:** O sistema possui limitação de tentativas de login por IP/usuário para mitigar ataques de força bruta.
- **API Gemini:** Requisições para o processamento de texto e IA são restritas a limites seguros de requisições por usuário para evitar abusos e custos inesperados.

## 💻 Desenvolvimento Seguro (Prisma)
- **Banco de Dados Único:** O projeto utiliza exclusivamente o **PostgreSQL** para desenvolvimento e produção, garantindo paridade de ambientes e evitando comportamentos inesperados típicos de SQLite em ambientes de concorrência.
