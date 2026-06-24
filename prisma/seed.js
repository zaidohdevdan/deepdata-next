/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("./generated-client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

const equipeAlfa = [
  { nome: "ADAITON CANDIDO DE ALCANTARA", matricula: "30063317" },
  { nome: "AECIO CRISTIANO DE OLIVEIRA", matricula: "30060717" },
  { nome: "ALFREDO DE SOUSA SERAFIM", matricula: "43101978" },
  { nome: "ANTONIA FLAUBIA SILVEIRA DA SILVA CAVALCANTE", matricula: "4308271X" },
  { nome: "ANTONIO CARDOSO DE ARAUJO", matricula: "43095676" },
  { nome: "ANTONIO EMERSON FERRO CRUZ RODRIGUES", matricula: "43100548" },
  { nome: "AUGUSTO CARLOS FIRMINO DOS SANTOS", matricula: "43101137" },
  { nome: "BRENO DOS SANTOS ALVES", matricula: "43089498" },
  { nome: "BRUNO HENRIQUE COSTA DE SA", matricula: "4308934X" },
  { nome: "CARLOS FELIPE FERREIRA MOREIRA", matricula: "43097814" },
  { nome: "CLEYLSON COSTA DA ROCHA", matricula: "4308884X" },
  { nome: "CRISTIANO DE CARVALHO FRANCELINO", matricula: "43042815" },
  { nome: "ENIO SILVA DA COSTA", matricula: "30066413" },
  { nome: "FERNANDO XAVIER DE QUEIROZ", matricula: "43095056" },
  { nome: "FRANCISCO WELTON BRAGA SILVA", matricula: "30021517" },
  { nome: "GEAN CARLOS DE SOUSA", matricula: "47341515" },
  { nome: "GEICIANO DA SILVA VIANA", matricula: "43094823" },
  { nome: "GLAUCO SANTIAGO GALVAO", matricula: "43100971" },
  { nome: "GUILHERME SOUZA DE FARIAS", matricula: "43101250" },
  { nome: "ISRAEL MONTEIRO RIBEIRO", matricula: "30086112" },
  { nome: "JANDEILSON TIAGO LIMA MATIAS", matricula: "43088750" },
  { nome: "JANISON MAXIMO FERRAZ", matricula: "30090314" },
  { nome: "JANYEIRE PAULINO CASTRO", matricula: "43091557" },
  { nome: "JOEDSON MAIA DOS SANTOS", matricula: "30087917" },
  { nome: "JULIO CESAR ARAUJO SILVA", matricula: "43089145" },
  { nome: "KARINA NOIALY UCHOA DE ARAUJO", matricula: "43108158" },
  { nome: "MARCIO DE SOUZA ALENCAR", matricula: "47302412" },
  { nome: "MARCIO TAVARES DA SILVA", matricula: "43096893" },
  { nome: "MARCO ANTONIO LINHARES", matricula: "30024311" },
  { nome: "MARLON SANTANA DA COSTA", matricula: "43088653" },
  { nome: "ORISVALDO RODRIGUES DE CASTRO", matricula: "43089412" },
  { nome: "PEDRO PAULO TOME DE SOUSA", matricula: "43060716" },
  { nome: "RAIMUNDO IRANILDO NOGUEIRA SILVA", matricula: "12583710" },
  { nome: "ROBSON MACIEL DE ANDRADE", matricula: "47351316" },
  { nome: "SAMUEL TEIXEIRA LIMA", matricula: "43101099" },
  { nome: "SERGIO PINHEIRO MOREIRA", matricula: "30044819" },
  { nome: "VILSON BARBOSA DO NASCIMENTO", matricula: "43099892" }
]

const equipeBravo = [
  { nome: "AKEL PEREIRA CAVALCANTE", matricula: "43067818" },
  { nome: "ANA CAROLINE DA SILVA MOREIRA", matricula: "43097946" },
  { nome: "ANDERSSON ELAN ALENCAR DE CARVALHO", matricula: "43091190" },
  { nome: "CARLOS AURELIO LEITAO MORAIS", matricula: "43090739" },
  { nome: "DANIEL FERREIRA DE ALMEIDA", matricula: "43100947" },
  { nome: "EDSON NUNES DE LIMA", matricula: "47344417" },
  { nome: "ELIAS BATISTA DE LIMA", matricula: "30081218" },
  { nome: "ELISANDRO PEREIRA DA SILVA", matricula: "43096877" },
  { nome: "EMIDIO SOARES DA COSTA JUNIOR", matricula: "43100378" },
  { nome: "FABRICIO ARAUJO DE MESQUITA", matricula: "43094580" },
  { nome: "FELIPE DOS SANTOS PINHEIRO", matricula: "43096303" },
  { nome: "FRANCISCO CLAUDE CANDIDO PEREIRA", matricula: "30082710" },
  { nome: "FRANCISCO JEOVAR BERNARDINO DE SOUSA", matricula: "47346118" },
  { nome: "FRANCISCO PATRICIO PASSOS DOS SANTOS", matricula: "30003705" },
  { nome: "HERKMAN FRANCISCO SCHRAMM RIBEIRO", matricula: "12582919" },
  { nome: "HUMBERLUCIA DA SILVA LIMA CARDOSO", matricula: "30075013" },
  { nome: "IGOR ERICH DE OLIVEIRA", matricula: "30022211" },
  { nome: "ISNARDE LEITE ALVES", matricula: "47336813" },
  { nome: "JEAN CARLOS MORAES DA SILVA", matricula: "30102517" },
  { nome: "JOACI RODRIGUES FARIAS", matricula: "47296811" },
  { nome: "JOSE MAURICELIO AURELIANO MOREIRA", matricula: "30023013" },
  { nome: "JOSENEZ ALVES", matricula: "43089447" },
  { nome: "LAERCIO JOSE DA SILVA", matricula: "43092782" },
  { nome: "LOURIVAL BEZERRA DA SILVA", matricula: "43105604" },
  { nome: "MAIKON MARQUES DA SILVA FERNANDES", matricula: "47304512" },
  { nome: "MANOEL RICARDO AQUINO DE OLIVEIRA", matricula: "43088327" },
  { nome: "MARCELO ALVES DE LIMA", matricula: "43088572" },
  { nome: "MARCILIO DA SILVA MONTEIRO", matricula: "12580916" },
  { nome: "MARCO AURELIO MARQUES MOURA", matricula: "30041615" },
  { nome: "RITA CRISTINA MEIRELES TEIXEIRA", matricula: "47261112" },
  { nome: "TANISIA RODRIGUES GOIS", matricula: "43095897" },
  { nome: "TARCISIO DE SOUSA ROCHA POSSA", matricula: "43094459" },
  { nome: "TIAGO CUNHA DE SOUSA", matricula: "30040619" },
  { nome: "VANTUI BARBOSA DE OLIVEIRA", matricula: "3005881X" },
  { nome: "WAGNER PINHEIRO BARRETO", matricula: "47310016" },
  { nome: "WILKISON CARVALHO DA ROCHA", matricula: "43091107" }
]

const equipeEcho = [
  { nome: "ADVANILSON MARCIANO DE OLIVEIRA", matricula: "43092901" },
  { nome: "ALBERTO DE SOUZA MARQUES NETTO", matricula: "30017013" },
  { nome: "ANDRE AUGUSTO PEREIRA", matricula: "43097709" },
  { nome: "ANDRE CAVALCANTE MOUTA", matricula: "43094637" },
  { nome: "BISMARK OLIVEIRA DE MORAIS", matricula: "47350719" },
  { nome: "CLEITON PERICLES PEREIRA DA SILVA", matricula: "30034813" },
  { nome: "DANIEL MIRANDA DOS SANTOS", matricula: "43101072" },
  { nome: "DANIELA ALVES SOBRINHO CARNEIRO", matricula: "47300215" },
  { nome: "EMANUEL GUILHERME DE OLIVEIRA", matricula: "47288010" },
  { nome: "FRANCISCO DELFINO DE OLIVEIRA", matricula: "4310246X" },
  { nome: "FRANCISCO JUNIOR ALVES ALMEIDA", matricula: "47277310" },
  { nome: "FRANCISCO LAZARO MELO FREIRES", matricula: "4729391X" },
  { nome: "FRANCISCO WILSON DE SOUSA SALES", matricula: "47345812" },
  { nome: "GERDSON LIMA DE SOUZA", matricula: "30047117" },
  { nome: "GUILHERME ALBERTO DE SOUSA GOMES", matricula: "4310084X" },
  { nome: "ILDEMBERG FERREIRA LOPES DA SILVA", matricula: "47297915" },
  { nome: "ISRAEL DE SOUZA TAVARES", matricula: "47298415" },
  { nome: "ITALO LEITE TAVARES", matricula: "30022416" },
  { nome: "JACQUELINE DE JESUS GOMES DE CASTRO", matricula: "30102916" },
  { nome: "JORGE LUCAS SOUZA MARTINS", matricula: "43088734" },
  { nome: "JOSE ALVES NOGUEIRA", matricula: "47314011" },
  { nome: "JOSE RONALDO FERREIRA NUNES JUNIOR", matricula: "43090801" },
  { nome: "JOSE VANDERLIN MIRANDA DE ARAUJO", matricula: "47312817" },
  { nome: "LEOSMAR VIEIRA DA SILVA", matricula: "43092561" },
  { nome: "LUCAS SILVA MONTE", matricula: "43093436" },
  { nome: "LUIS DE OLIVEIRA ARAUJO", matricula: "43093371" },
  { nome: "RAFAEL RODRIGUES DE ANDRADE", matricula: "47316111" },
  { nome: "RAIMUNDO NONATO BARBOSA BASTOS", matricula: "4309971X" },
  { nome: "RAMSES SERRA", matricula: "47317916" },
  { nome: "RODRIGO DE ALMEIDA GIRAO", matricula: "43106473" },
  { nome: "SHEILA SANTOS DE LIMA", matricula: "43108166" },
  { nome: "TIMOTEO ALVES DE SOUSA", matricula: "47311918" },
  { nome: "VANIA MARIA BARROS DE OLIVEIRA", matricula: "4733411X" },
  { nome: "VIRGILIO DE SOUZA REIS", matricula: "43101307" },
  { nome: "WARLEN LOPES MACIEL", matricula: "43097903" },
  { nome: "YARLO LUCELIO SOARES", matricula: "30026616" }
]

const equipeFox = [
  { nome: "ANDRE FERREIRA DO NASCIMENTO", matricula: "30051610" },
  { nome: "ANTONIO ALISON BARROS DA SILVA", matricula: "43094610" },
  { nome: "ANTONIO ARAMIR PORFIRIO FILHO", matricula: "43101056" },
  { nome: "ANTONY NACELIO FURTADO NETO", matricula: "4724451X" },
  { nome: "CARLOS JOSE CAVALCANTE LOPES", matricula: "43090097" },
  { nome: "DANIEL PEIXOTO DE SOUSA", matricula: "47289017" },
  { nome: "DANIELLE CARVALHO DE ARAUJO", matricula: "47246318" },
  { nome: "DAVI MESQUITA DE ARAUJO", matricula: "30069714" },
  { nome: "DEIVYSON MIKAEL DOS REIS HAGE", matricula: "43106929" },
  { nome: "DEVANIO GOMES DE MATOS", matricula: "30030419" },
  { nome: "EDSON GOMES DE SOUSA", matricula: "30068610" },
  { nome: "ERISVALDO JOSE DE FRANCA", matricula: "30019814" },
  { nome: "FABIO HENRIQUE SOUSA PEREIRA", matricula: "47248418" },
  { nome: "FABIO SALES AZEVEDO", matricula: "43100823" },
  { nome: "FELIPE ROCHA DE SOUZA", matricula: "43101110" },
  { nome: "FRANCISCA CELIANE DE ALMEIDA CELESTINO DIOGENES", matricula: "47248817" },
  { nome: "FRANCISCO ALVES DA SILVA JUNIOR", matricula: "4734221X" },
  { nome: "FREDERICO ROMULO SILVA E SOUZA", matricula: "30084314" },
  { nome: "GEORGE HENRIQUE PRATA MOTA", matricula: "43100211" },
  { nome: "HUDSON RAMOS DE CARVALHO", matricula: "47297117" },
  { nome: "JOAO PAULO DUARTE LIMA", matricula: "47314410" },
  { nome: "JORGE ADRIANO LIMA", matricula: "43106287" },
  { nome: "JORGE MIGUEL BALDINO DE MIRANDA", matricula: "43090267" },
  { nome: "JOSE OSVALDO DOS SANTOS LIMA", matricula: "43100815" },
  { nome: "JOSEIAS VIANA DA SILVA", matricula: "43106805" },
  { nome: "LEANDRO CAVALCANTE DE SA", matricula: "43092081" },
  { nome: "LUCIA DE FATIMA BRINDEIRO MAIA", matricula: "30082311" },
  { nome: "PLINIO MARCOS SANCHES ANDRADE", matricula: "30058011" },
  { nome: "RAIMUNDO MACHADO DA SILVA FILHO", matricula: "47316316" },
  { nome: "RAMYRO DA COSTA CANDIDO", matricula: "43094041" },
  { nome: "RODRIGO DA SILVA MOTTA", matricula: "30041712" },
  { nome: "ROZIELDO FERREIRA DE OLIVEIRA", matricula: "43094599" },
  { nome: "SAID LIMA FREITAS", matricula: "47262011" },
  { nome: "THIAGO RAFAEL MEDEIROS DA SILVA", matricula: "43063219" },
  { nome: "WENDELL ARAUJO DE MARIA SOARES", matricula: "4310733X" },
  { nome: "WESLLEY CANDIDO DE LIMA", matricula: "43091034" }
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
      update: { valor: cfg.valor }, // update the values if configuration already exists (e.g. over empty arrays)
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
