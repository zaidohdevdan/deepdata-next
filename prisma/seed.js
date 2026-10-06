/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

// Equipes mockadas para ambiente de desenvolvimento/seed inicial (evita exposição de dados de servidores reais)
const equipeAlfa = [
  { nome: "OPERADOR ALFA 01", matricula: "10000001" },
  { nome: "OPERADOR ALFA 02", matricula: "10000002" },
  { nome: "OPERADOR ALFA 03", matricula: "10000003" },
  { nome: "OPERADOR ALFA 04", matricula: "10000004" },
]

const equipeBravo = [
  { nome: "OPERADOR BRAVO 01", matricula: "20000001" },
  { nome: "OPERADOR BRAVO 02", matricula: "20000002" },
  { nome: "OPERADOR BRAVO 03", matricula: "20000003" },
  { nome: "OPERADOR BRAVO 04", matricula: "20000004" },
]

const equipeEcho = [
  { nome: "OPERADOR ECHO 01", matricula: "30000001" },
  { nome: "OPERADOR ECHO 02", matricula: "30000002" },
  { nome: "OPERADOR ECHO 03", matricula: "30000003" },
  { nome: "OPERADOR ECHO 04", matricula: "30000004" },
]

const equipeFox = [
  { nome: "OPERADOR FOX 01", matricula: "40000001" },
  { nome: "OPERADOR FOX 02", matricula: "40000002" },
  { nome: "OPERADOR FOX 03", matricula: "40000003" },
  { nome: "OPERADOR FOX 04", matricula: "40000004" },
]

async function main() {
  console.log("Seeding database...")

  // 1. Create default configurations (with team members)
  const defaultConfigs = [
    { chave: "nomeUnidade", valor: "UPI-4", descricao: "Nome da Unidade Prisional" },
    { chave: "localidade", valor: "Itaitinga", descricao: "Nome da Localidade/Cidade" },
    { chave: "alimentacaoCaixaCapacidade", valor: "42", descricao: "Capacidade da caixa de quentinhas (unidades)" },
    { chave: "cafeCapacitePacote", valor: "80", descricao: "Capacidade do pacote de pães (unidades)" },
    { chave: "cafePaoesPorInterno", valor: "2", descricao: "Pães consumidos por interno no café" },
    { chave: "cafeLitrosPorGarrafa", valor: "40", descricao: "Litros de café por garrafa" },
    { chave: "biscoitoPorInterno", valor: "8", descricao: "Biscoitos consumidos por interno" },
    { chave: "biscoitoCapacidadePacote", valor: "68", descricao: "Capacidade do pacote de biscoitos (unidades)" },
    { chave: "escalaPoliciaisFixos", valor: "[]", descricao: "JSON de policiais fixos por posto e faixa" },
    { chave: "equipeAlfa", valor: JSON.stringify(equipeAlfa), descricao: "JSON de policiais da equipe Alfa" },
    { chave: "equipeBravo", valor: JSON.stringify(equipeBravo), descricao: "JSON de policiais da equipe Bravo" },
    { chave: "equipeEcho", valor: JSON.stringify(equipeEcho), descricao: "JSON de policiais da equipe Echo" },
    { chave: "equipeFox", valor: JSON.stringify(equipeFox), descricao: "JSON de policiais da equipe Fox" },
  ]

  for (const cfg of defaultConfigs) {
    await prisma.configuracaoGlobal.upsert({
      where: { chave: cfg.chave },
      update: {}, // Não sobrescreve configurações personalizadas salvas pelo administrador
      create: cfg,
    })
  }
  console.log("Global configurations seeded.")

  // 2. Create default users (senhas parametrizáveis via variáveis de ambiente)
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || "Admin@Padrao123!"
  const userPassword = process.env.INITIAL_USER_PASSWORD || "Usuario@Padrao123!"

  const users = [
    {
      username: "admin",
      name: "Administrador",
      password: adminPassword,
      role: "ADMIN",
    },
    {
      username: "upi4",
      name: "Segurança",
      password: userPassword,
      role: "USER",
    },
    {
      username: "alfa",
      name: "Equipe Alfa",
      password: userPassword,
      role: "USER",
    },
    {
      username: "bravo",
      name: "Equipe Bravo",
      password: userPassword,
      role: "USER",
    },
    {
      username: "charlie",
      name: "Equipe Charlie",
      password: userPassword,
      role: "USER",
    },
    {
      username: "delta",
      name: "Equipe Delta",
      password: userPassword,
      role: "USER",
    },
  ]

  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, 10)
    await prisma.user.upsert({
      where: { username: u.username },
      update: {},
      create: {
        username: u.username,
        name: u.name,
        passwordHash,
        role: u.role,
        active: true,
      },
    })
  }
  console.log("Users seeded.")

  // 3. Create default wings (Alas) and their distributions (default 0)
  const defaultAlas = [
    { nome: "A", ordem: 1 },
    { nome: "B", ordem: 2 },
    { nome: "C", ordem: 3 },
    { nome: "D", ordem: 4 },
    { nome: "E", ordem: 5 },
    { nome: "F", ordem: 6 },
    { nome: "SEGURANÇA A", ordem: 7 },
    { nome: "SEGURANÇA B", ordem: 8 },
    { nome: "ENFERMARIA", ordem: 9 },
  ]

  for (const ala of defaultAlas) {
    const dbAla = await prisma.ala.upsert({
      where: { nome: ala.nome },
      update: {},
      create: {
        nome: ala.nome,
        ordem: ala.ordem,
        ativa: true,
      },
    })

    // Seed empty distributions for each modulo
    const modulos = ["ALIMENTACAO", "CAFE", "BISCOITO"]
    for (const mod of modulos) {
      await prisma.distribAla.upsert({
        where: {
          modulo_alaId: {
            modulo: mod,
            alaId: dbAla.id,
          },
        },
        update: {},
        create: {
          modulo: mod,
          alaId: dbAla.id,
          internos: 0,
          dietas: 0,
        },
      })
    }
  }
  console.log("Wings (Alas) and distributions seeded.")
  console.log("Seeding completed successfully.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
