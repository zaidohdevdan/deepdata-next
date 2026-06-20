import { prisma } from "@/lib/prisma"

export interface Ala {
  id: string
  nome: string
  internos: number
  dietas: number
}

export interface Totais {
  totalInternos: number
  [key: string]: number | string
}

export interface ColunaDef {
  key: string
  header: string
  editable?: boolean
  computed?: boolean
  unit?: string
}

export interface DistribuicaoConfig {
  titulo: string
  emoji: string
  storageKey: string
  modulo: "ALIMENTACAO" | "CAFE" | "BISCOITO"
  headerColor: string
  colunas: ColunaDef[]
  temDietas: boolean
  calcularAla: (ala: Ala, cfg: ConfigValues) => Record<string, number>
  calcularResumo: (alas: Ala[], cfg: ConfigValues) => Record<string, number | string>
}

export interface ConfigValues {
  nomeUnidade: string
  localidade: string
  alimentacaoCaixaCapacidade: number
  cafeCapacitePacote: number
  cafePaoesPorInterno: number
  cafeLitrosPorGarrafa: number
  biscoitoPorInterno: number
  biscoitoCapacidadePacote: number
  escalaPoliciaisFixos: string
  equipeAlfa: string
  equipeBravo: string
  equipeEcho: string
  equipeFox: string
}

export const DEFAULT_CONFIG: ConfigValues = {
  nomeUnidade: "UPI-4",
  localidade: "Itaitinga",
  alimentacaoCaixaCapacidade: 42,
  cafeCapacitePacote: 80,
  cafePaoesPorInterno: 2,
  cafeLitrosPorGarrafa: 40,
  biscoitoPorInterno: 8,
  biscoitoCapacidadePacote: 68,
  escalaPoliciaisFixos: "[]",
  equipeAlfa: "[]",
  equipeBravo: "[]",
  equipeEcho: "[]",
  equipeFox: "[]",
}

// ============================================
// UTILITÁRIOS
// ============================================
export function arredondarGarrafas(valor: number): number {
  const parteInteira = Math.floor(valor)
  const decimal = valor - parteInteira
  if (decimal <= 0.3) return parteInteira
  if (decimal >= 0.7) return Math.ceil(valor)
  return Math.round(valor * 10) / 10
}

// ============================================
// CONFIGS DOS 3 MÓDULOS
// ============================================

export const alimentacaoConfig: DistribuicaoConfig = {
  titulo: "Controle de Distribuição de Alimentação",
  emoji: "🍽️",
  storageKey: "controleAlimentacaoUPI4",
  modulo: "ALIMENTACAO",
  headerColor: "from-green-600 to-green-800",
  temDietas: true,
  colunas: [
    { key: "nome", header: "Ala", editable: true },
    { key: "internos", header: "Qtd. Internos", editable: true },
    { key: "caixas", header: "Caixas (42un)", computed: true },
    { key: "normal", header: "Normal", computed: true },
    { key: "dietas", header: "Dietas", editable: true },
  ],
  calcularAla(ala, cfg) {
    const internosNormais = ala.internos - ala.dietas
    const caixas = Math.floor(internosNormais / cfg.alimentacaoCaixaCapacidade)
    const normal = internosNormais % cfg.alimentacaoCaixaCapacidade
    return { caixas, normal }
  },
  calcularResumo(alas, cfg) {
    let totalInternos = 0
    let totalQuentinhas = 0

    for (const ala of alas) {
      totalInternos += ala.internos
      totalQuentinhas += ala.internos
    }

    const caixasTotais = Math.floor(totalQuentinhas / cfg.alimentacaoCaixaCapacidade)
    const unidadesAvulsas = totalQuentinhas % cfg.alimentacaoCaixaCapacidade

    return {
      "Total de Internos": totalInternos,
      "Total de Quentinhas": totalQuentinhas,
      Caixas: `${caixasTotais} cx e ${unidadesAvulsas} un`,
    }
  },
}

export const cafeConfig: DistribuicaoConfig = {
  titulo: "Controle de Distribuição de Café",
  emoji: "☕",
  storageKey: "controleCafeUPI4",
  modulo: "CAFE",
  headerColor: "from-amber-700 to-amber-900",
  temDietas: false,
  colunas: [
    { key: "nome", header: "Ala", editable: true },
    { key: "internos", header: "Qtd. Internos", editable: true },
    { key: "pacotes", header: "Pacotes (80un)", computed: true },
    { key: "unidades", header: "Unidades", computed: true },
    { key: "garrafas", header: "Garrafas (40L)", computed: true },
  ],
  calcularAla(ala, cfg) {
    const totalPaes = ala.internos * cfg.cafePaoesPorInterno
    const pacotes = Math.floor(totalPaes / cfg.cafeCapacitePacote)
    const unidades = totalPaes % cfg.cafeCapacitePacote
    const garrafas = arredondarGarrafas(ala.internos / cfg.cafeLitrosPorGarrafa)
    return { pacotes, unidades, garrafas }
  },
  calcularResumo(alas, cfg) {
    let totalInternos = 0
    let totalPaes = 0
    let totalPacotes = 0
    let totalGarrafas = 0

    for (const ala of alas) {
      totalInternos += ala.internos
      totalPaes += ala.internos * cfg.cafePaoesPorInterno
      totalPacotes += Math.floor((ala.internos * cfg.cafePaoesPorInterno) / cfg.cafeCapacitePacote)
      totalGarrafas += ala.internos / cfg.cafeLitrosPorGarrafa
    }

    return {
      "Total de Internos": totalInternos,
      "Total de Pães": totalPaes,
      "Total de Pacotes": totalPacotes,
      "Total de Garrafas": arredondarGarrafas(totalGarrafas),
    }
  },
}

export const biscoitoConfig: DistribuicaoConfig = {
  titulo: "Controle de Distribuição de Biscoitos",
  emoji: "🍪",
  storageKey: "controleBiscoitosUPI4",
  modulo: "BISCOITO",
  headerColor: "from-yellow-600 to-yellow-800",
  temDietas: false,
  colunas: [
    { key: "nome", header: "Ala", editable: true },
    { key: "internos", header: "Qtd. Internos", editable: true },
    { key: "pacotes", header: "Pacotes (68un)", computed: true },
    { key: "unidades", header: "Unidades", computed: true },
    { key: "garrafas", header: "Garrafas (40L)", computed: true },
  ],
  calcularAla(ala, cfg) {
    const totalBiscoitos = ala.internos * cfg.biscoitoPorInterno
    const pacotes = Math.floor(totalBiscoitos / cfg.biscoitoCapacidadePacote)
    const unidades = totalBiscoitos % cfg.biscoitoCapacidadePacote
    const garrafas = arredondarGarrafas(ala.internos / 40)
    return { pacotes, unidades, garrafas }
  },
  calcularResumo(alas, cfg) {
    let totalInternos = 0
    let totalBiscoitos = 0
    let totalPacotes = 0
    let totalGarrafas = 0

    for (const ala of alas) {
      const totalB = ala.internos * cfg.biscoitoPorInterno
      totalInternos += ala.internos
      totalBiscoitos += totalB
      totalPacotes += Math.floor(totalB / cfg.biscoitoCapacidadePacote)
      totalGarrafas += ala.internos / 40
    }

    return {
      "Total de Internos": totalInternos,
      "Total de Biscoitos": totalBiscoitos,
      "Total de Pacotes": totalPacotes,
      "Total de Garrafas": arredondarGarrafas(totalGarrafas),
    }
  },
}

// ============================================
// FETCH CONFIG FROM DB
// ============================================
interface ConfiguracaoGlobalRecord {
  chave: string
  valor: string | number | null
}

export async function getConfigValues(): Promise<ConfigValues> {
  try {
    const configs = await prisma.configuracaoGlobal.findMany()
    const map = Object.fromEntries(configs.map((c: ConfiguracaoGlobalRecord) => [c.chave, c.valor])) as Record<string, string | number | null>

    return {
      nomeUnidade: (map.nomeUnidade as string) ?? DEFAULT_CONFIG.nomeUnidade,
      localidade: (map.localidade as string) ?? DEFAULT_CONFIG.localidade,
      alimentacaoCaixaCapacidade: Number(map.alimentacaoCaixaCapacidade ?? DEFAULT_CONFIG.alimentacaoCaixaCapacidade),
      cafeCapacitePacote: Number(map.cafeCapacitePacote ?? DEFAULT_CONFIG.cafeCapacitePacote),
      cafePaoesPorInterno: Number(map.cafePaoesPorInterno ?? DEFAULT_CONFIG.cafePaoesPorInterno),
      cafeLitrosPorGarrafa: Number(map.cafeLitrosPorGarrafa ?? DEFAULT_CONFIG.cafeLitrosPorGarrafa),
      biscoitoPorInterno: Number(map.biscoitoPorInterno ?? DEFAULT_CONFIG.biscoitoPorInterno),
      biscoitoCapacidadePacote: Number(map.biscoitoCapacidadePacote ?? DEFAULT_CONFIG.biscoitoCapacidadePacote),
      escalaPoliciaisFixos: (map.escalaPoliciaisFixos as string) ?? DEFAULT_CONFIG.escalaPoliciaisFixos,
      equipeAlfa: (map.equipeAlfa as string) ?? DEFAULT_CONFIG.equipeAlfa,
      equipeBravo: (map.equipeBravo as string) ?? DEFAULT_CONFIG.equipeBravo,
      equipeEcho: (map.equipeEcho as string) ?? DEFAULT_CONFIG.equipeEcho,
      equipeFox: (map.equipeFox as string) ?? DEFAULT_CONFIG.equipeFox,
    }
  } catch {
    return DEFAULT_CONFIG
  }
}
