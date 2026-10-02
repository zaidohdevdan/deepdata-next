# DeepData Next — UPI-4 (Unidade Prisional de Itaitinga - 4)

O **DeepData Next** é um sistema moderno de gestão operacional. O sistema otimiza a criação de escalas de plantão, gerencia a distribuição de alimentação, registra ocorrências diárias e oferece um painel avançado de processamento de visitas com segurança e privacidade rígidas de dados.

---

## 🚀 Tecnologias Utilizadas

A aplicação é construída sobre um ecossistema moderno, rápido e seguro:

* **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) — Renderização híbrida e rotas otimizadas.
* **Interface & Estilização:** [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/) (com efeitos customizados de *glassmorphism* e paleta de cores premium baseada em tons violeta e ardósia), e ícones por [Lucide React](https://lucide.dev/).
* **Banco de Dados & ORM:** [Prisma ORM](https://www.prisma.io/) com suporte exclusivo para **PostgreSQL** para garantir consistência entre os ambientes de desenvolvimento e produção.
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

### Processamento e Armazenamento Local 100% Offline (SQLite)
* **Sem Envio para Nuvem Externa:** Toda a aplicação opera localmente. Os dados contidos nos relatórios de visitas importados, ocorrências, distribuições e configurações operacionais residem de forma isolada na base SQLite local da máquina operadora (`prisma/local.db`), sem tráfego ou sincronização para servidores externos.
* **Processamento no Navegador e Persistência Local:** Toda a extração e decodificação dos arquivos PDF e Excel ocorrem na máquina, sendo então persistidos de forma segura no banco local para consultas rápidas, filtros e geração de relatórios de plantão.
* **Backup e Restauração Local:** Permite a exportação e restauração completa da base em arquivo estruturado `.json` diretamente pelo painel administrativo para rotinas de contingência e preservação histórica.

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

2. Configure o arquivo `.env` na raiz do projeto (nunca cometa este arquivo):
   ```env
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/nomedobanco"
   AUTH_SECRET="seu-segredo-de-autenticacao-jwt"
   GEMINI_API_KEY="sua-chave-gemini-aqui"
   ```

3. Aplique as migrações no banco de dados PostgreSQL:
   ```bash
   npx prisma migrate dev
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
