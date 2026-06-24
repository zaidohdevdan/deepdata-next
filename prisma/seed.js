/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("./generated-client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // 1. Create default configurations
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
    { chave: "equipeAlfa", valor: "[]", descricao: "JSON de policiais da equipe Alfa" },
    { chave: "equipeBravo", valor: "[]", descricao: "JSON de policiais da equipe Bravo" },
    { chave: "equipeEcho", valor: "[]", descricao: "JSON de policiais da equipe Echo" },
    { chave: "equipeFox", valor: "[]", descricao: "JSON de policiais da equipe Fox" },
  ]

  for (const cfg of defaultConfigs) {
    await prisma.configuracaoGlobal.upsert({
      where: { chave: cfg.chave },
      update: {},
      create: cfg,
    })
  }
  console.log("Global configurations seeded.")

  // 2. Create default users
  const users = [
    {
      username: "admin",
      name: "Administrador",
      password: "admin#216216",
      role: "ADMIN",
    },
    {
      username: "upi4",
      name: "Segurança",
      password: "seguranca#216216",
      role: "USER",
    },
    {
      username: "almeida",
      name: "Almeida",
      password: "almeida#216216",
      role: "USER",
    },
    {
      username: "alfa",
      name: "Equipe Alfa",
      password: "relatorio",
      role: "USER",
    },
    {
      username: "bravo",
      name: "Equipe Bravo",
      password: "relatorio",
      role: "USER",
    },
    {
      username: "charlie",
      name: "Equipe Charlie",
      password: "relatorio",
      role: "USER",
    },
    {
      username: "delta",
      name: "Equipe Delta",
      password: "relatorio",
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
