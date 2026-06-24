# DeepData Next — UPI-4 (Unidade Prisional de Itaitinga - 4)

O **DeepData Next** é um sistema moderno de gestão operacional. O sistema otimiza a criação de escalas de plantão, gerencia a distribuição de alimentação, registra ocorrências diárias e oferece um painel avançado de processamento de visitas com segurança e privacidade rígidas de dados.

---

## 🚀 Tecnologias Utilizadas

A aplicação é construída sobre um ecossistema moderno, rápido e seguro:

* **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) — Renderização híbrida e rotas otimizadas.
* **Interface & Estilização:** [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/) (com efeitos customizados de *glassmorphism* e paleta de cores premium baseada em tons violeta e ardósia), e ícones por [Lucide React](https://lucide.dev/).
* **Banco de Dados & ORM:** [Prisma ORM](https://www.prisma.io/) com suporte flexível para **SQLite** (ambiente local de desenvolvimento) e **Postgres** (produção).
* **Autenticação:** [Auth.js v5 (NextAuth)](https://authjs.dev/) — Sessões seguras baseadas em JSON Web Tokens (JWT) e criptografia com `bcryptjs`.
* **Processamento de Arquivos:** 
  * [SheetJS (XLSX)](https://sheetjs.com/) — Leitura e escrita de planilhas locais.
  * [PDF.js](https://mozilla.github.io/pdf.js/) — Extração e leitura de dados textuais de arquivos PDF diretamente no cliente.

---

## 🏛️ Arquitetura e Estrutura do Projeto

O projeto segue a estrutura padrão do Next.js App Router, dividida logicamente em camadas de componentes reutilizáveis, lógica de negócios e persistência:

```
deepdata-next/
├── app/                  # Roteamento e Páginas (App Router)
│   ├── (auth)/           # Rotas de Autenticação (Login)
│   ├── (dashboard)/      # Telas operacionais principais do sistema
│   │   ├── escalas/      # Módulo de Escalas (Rotas Dinâmicas)
│   │   └── sistema/      # Painel de Controle de Visitas
│   ├── admin/            # Telas administrativas exclusivas (Admin)
│   └── actions/          # Next.js Server Actions para escrita no banco
├── components/           # Componentes de UI e Blocos de Negócio
│   ├── escalas/          # Grid interativo e blocos do construtor de escalas
│   ├── sistema/          # Tabelas e painéis do leitor de visitas
│   └── ui/               # Componentes visuais básicos reutilizáveis
├── lib/                  # Utilitários, conexões (Prisma) e Validadores
├── prisma/               # Esquema do banco de dados (schema.prisma) e migrações
└── public/               # Ativos estáticos e mídias
```

---

## 🛡️ Políticas de Segurança e Tratamento de Dados (LGPD Compliance)

O sistema adota uma política de **vazamento zero de dados pessoais sensíveis** de custodiados e visitantes. Para cumprir com os mais altos padrões de segurança e autorização, o sistema realiza uma separação rígida do armazenamento de dados:

### Processamento Local de PII (Informações Pessoais Identificáveis)
* **Sem Banco de Dados Remoto:** Os dados contidos nos relatórios de visitas importados (Nomes de visitantes, CPFs, Nomes de internos e prontuários) **nunca são enviados ou gravados no banco de dados do servidor**.
* **Processamento Client-Side:** Toda a leitura e parser de arquivos PDF e Excel ocorrem na memória local do navegador do operador.
* **Armazenamento:** Esses dados residem unicamente no `localStorage` do navegador da máquina operadora (`sistema_visitas_data` e `sistema_visitas_total`). Caso o navegador seja limpo ou outro computador seja usado, os dados não estarão acessíveis, garantindo privacidade absoluta.

### Persistência no Banco de Dados
Apenas informações de configuração e relatórios agregados sem dados nominais sensíveis são salvos no banco de dados central:
* **Usuários:** Credenciais de servidores autorizados para login.
* **Configurações Gerais:** Relação de postos de plantão e policiais definidos como fixos por escala.
* **Dados de Distribuição:** **Apenas os totais numéricos** de internos e dietas de cada ala (ex: Ala A - 50 internos, 5 dietas) para controle de cozinha, sem os nomes ou prontuários individuais dos detentos.
* **Ocorrências:** Registros administrativos do andamento do plantão.

---

## ⚙️ Funções e Operacionalidade do Sistema

### 1. Construtor e Gerador de Escalas de Plantão
O sistema suporta a criação descentralizada de 5 modalidades de escala com horários, postos e regras específicas:
* **Diurna (`diurna`):** Horário `06:00` às `18:00`.
* **Revezamento Almoço (`almoco`):** Horário `11:00` às `13:30` (Travada em exatamente 2 turnos/colunas).
* **Revezamento Janta (`janta`):** Horário `17:00` às `19:30`.
* **Noturna (`noturna`):** Horário `18:00` às `06:00` (Inclui tabelas independentes de Guaritas Operacionais G1, G3, G5, G6 e Tenda Operacional).
* **Alvorada (`alvorada`):** Horário `06:00` às `08:00` (Travada em exatamente 1 turno/coluna).

#### Recursos do Gerador de Escalas:
* **Configuração de Policiais Fixos:** Permite predefinir policiais para postos e turnos específicos de forma persistente.
* **Distribuição Inteligente (Auto-Ocupar):** Algoritmo que aloca automaticamente os policiais presentes com base na necessidade de cada posto, respeitando as capacidades ideais.
* **Regra de Dupla Alocação Permitida:** Permite que o mesmo policial cubra dois postos simultâneos no mesmo turno se pertencerem às seguintes exceções:
  * *Acesso Externo* + *Acesso Interno*
  * *Acesso Interno* + *Recepção*
* **Impressão Inteligente (A4 Economia de Papel):** Quando um posto tem múltiplos policiais escalados, eles são formatados **lado a lado** com uma divisória estilosa na impressão. Isso economiza papel e garante que a escala caiba inteiramente em uma única folha A4 vertical.

### 2. Painel de Visitas UPI-4
* **Parser de Excel & PDF:** Permite fazer upload direto do relatório oficial de visitas do Estado.
* **Filtros Avançados:** Filtre instantaneamente por Nome do Interno, Nome do Visitante, CPF, Ala, Cela, Celas de Paridade (Apenas Celas Pares ou Ímpares) e prioridade de atendimento.
* **Exportação:** Exporte a lista filtrada de volta para Excel ou gere um relatório PDF formatado e limpo para impressão rápida.

### 3. Distribuição Alimentícia & Ocorrências
* **Alimentação:** Lançamento diário de quantidades de marmitas e dietas especiais servidas em cada ala para os turnos de Café, Almoço e Biscoito/Janta.
* **Ocorrências:** Registro formal do histórico do plantão, categorizado por tipo e com controle de autoria do servidor.

---

## 🛠️ Instalação e Execução Local

1. Instale as dependências do projeto:
   ```bash
   npm install
   ```

2. Configure o arquivo `.env` na raiz do projeto:
   ```env
   DATABASE_URL="file:./dev.db"
   AUTH_SECRET="seu-segredo-de-autenticacao-jwt"
   ```

3. Execute as migrações do banco de dados para criar a estrutura local do SQLite:
   ```bash
   npx prisma db push
   ```

4. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   Acesse a aplicação em `http://localhost:3000`.

---

## 🔮 Futuras Implementações (Backlog)

* [ ] **Log de Auditoria de Impressões:** Histórico de alterações e impressões de escalas para controle de versão físico.
* [ ] **Integração com Leitor Óptico:** Leitura rápida do CPF de visitantes na recepção para dar baixa automática na lista local.
* [ ] **Editor Dinâmico de Turnos:** Permitir que o administrador configure a quantidade e a faixa exata de horários de cada turno diretamente pela interface de configurações (sem travar no código).
* [ ] **Backup Criptografado de Rascunhos:** Permitir a exportação de rascunhos de escalas locais em arquivos compactados criptografados para transferência segura entre turnos.

---

## 💻 Desenvolvedores

* **Daniel de Almeida** — Desenvolvedor Líder (Engenheiro Operacional).
* **Antigravity** — Assistente de Inteligência Artificial e Co-Piloto de Desenvolvimento.
