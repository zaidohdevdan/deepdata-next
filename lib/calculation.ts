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

  // Specific scale configs
  escalaPoliciaisFixos_diurna?: string
  escalaPoliciaisFixos_almoco?: string
  escalaPoliciaisFixos_janta?: string
  escalaPoliciaisFixos_noturna?: string
  escalaPoliciaisFixos_alvorada?: string

  escalaPostosConfig_diurna?: string
  escalaPostosConfig_almoco?: string
  escalaPostosConfig_janta?: string
  escalaPostosConfig_noturna?: string
  escalaPostosConfig_alvorada?: string

  escalaHoraInicio_diurna?: string
  escalaHoraInicio_almoco?: string
  escalaHoraInicio_janta?: string
  escalaHoraInicio_noturna?: string
  escalaHoraInicio_alvorada?: string

  escalaHoraFim_diurna?: string
  escalaHoraFim_almoco?: string
  escalaHoraFim_janta?: string
  escalaHoraFim_noturna?: string
  escalaHoraFim_alvorada?: string

  escalaNumFaixas_diurna?: string
  escalaNumFaixas_almoco?: string
  escalaNumFaixas_janta?: string
  escalaNumFaixas_noturna?: string
  escalaNumFaixas_alvorada?: string
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

  escalaPoliciaisFixos_diurna: "[]",
  escalaPoliciaisFixos_almoco: "[]",
  escalaPoliciaisFixos_janta: "[]",
  escalaPoliciaisFixos_noturna: "[]",
  escalaPoliciaisFixos_alvorada: "[]",

  escalaPostosConfig_diurna: "",
  escalaPostosConfig_almoco: "",
  escalaPostosConfig_janta: "",
  escalaPostosConfig_noturna: "",
  escalaPostosConfig_alvorada: "",

  escalaHoraInicio_diurna: "06:00",
  escalaHoraInicio_almoco: "11:00",
  escalaHoraInicio_janta: "17:00",
  escalaHoraInicio_noturna: "18:00",
  escalaHoraInicio_alvorada: "06:00",

  escalaHoraFim_diurna: "18:00",
  escalaHoraFim_almoco: "13:30",
  escalaHoraFim_janta: "19:30",
  escalaHoraFim_noturna: "06:00",
  escalaHoraFim_alvorada: "08:00",

  escalaNumFaixas_diurna: "2",
  escalaNumFaixas_almoco: "2",
  escalaNumFaixas_janta: "2",
  escalaNumFaixas_noturna: "2",
  escalaNumFaixas_alvorada: "1",
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

      // Specific scale configs
      escalaPoliciaisFixos_diurna: (map.escalaPoliciaisFixos_diurna as string) ?? DEFAULT_CONFIG.escalaPoliciaisFixos_diurna,
      escalaPoliciaisFixos_almoco: (map.escalaPoliciaisFixos_almoco as string) ?? DEFAULT_CONFIG.escalaPoliciaisFixos_almoco,
      escalaPoliciaisFixos_janta: (map.escalaPoliciaisFixos_janta as string) ?? DEFAULT_CONFIG.escalaPoliciaisFixos_janta,
      escalaPoliciaisFixos_noturna: (map.escalaPoliciaisFixos_noturna as string) ?? map.escalaPoliciaisFixos ?? DEFAULT_CONFIG.escalaPoliciaisFixos_noturna, // fallback to legacy key
      escalaPoliciaisFixos_alvorada: (map.escalaPoliciaisFixos_alvorada as string) ?? DEFAULT_CONFIG.escalaPoliciaisFixos_alvorada,

      escalaPostosConfig_diurna: (map.escalaPostosConfig_diurna as string) ?? DEFAULT_CONFIG.escalaPostosConfig_diurna,
      escalaPostosConfig_almoco: (map.escalaPostosConfig_almoco as string) ?? DEFAULT_CONFIG.escalaPostosConfig_almoco,
      escalaPostosConfig_janta: (map.escalaPostosConfig_janta as string) ?? DEFAULT_CONFIG.escalaPostosConfig_janta,
      escalaPostosConfig_noturna: (map.escalaPostosConfig_noturna as string) ?? DEFAULT_CONFIG.escalaPostosConfig_noturna,
      escalaPostosConfig_alvorada: (map.escalaPostosConfig_alvorada as string) ?? DEFAULT_CONFIG.escalaPostosConfig_alvorada,

      escalaHoraInicio_diurna: (map.escalaHoraInicio_diurna as string) ?? DEFAULT_CONFIG.escalaHoraInicio_diurna,
      escalaHoraInicio_almoco: (map.escalaHoraInicio_almoco as string) ?? DEFAULT_CONFIG.escalaHoraInicio_almoco,
      escalaHoraInicio_janta: (map.escalaHoraInicio_janta as string) ?? DEFAULT_CONFIG.escalaHoraInicio_janta,
      escalaHoraInicio_noturna: (map.escalaHoraInicio_noturna as string) ?? DEFAULT_CONFIG.escalaHoraInicio_noturna,
      escalaHoraInicio_alvorada: (map.escalaHoraInicio_alvorada as string) ?? DEFAULT_CONFIG.escalaHoraInicio_alvorada,

      escalaHoraFim_diurna: (map.escalaHoraFim_diurna as string) ?? DEFAULT_CONFIG.escalaHoraFim_diurna,
      escalaHoraFim_almoco: (map.escalaHoraFim_almoco as string) ?? DEFAULT_CONFIG.escalaHoraFim_almoco,
      escalaHoraFim_janta: (map.escalaHoraFim_janta as string) ?? DEFAULT_CONFIG.escalaHoraFim_janta,
      escalaHoraFim_noturna: (map.escalaHoraFim_noturna as string) ?? DEFAULT_CONFIG.escalaHoraFim_noturna,
      escalaHoraFim_alvorada: (map.escalaHoraFim_alvorada as string) ?? DEFAULT_CONFIG.escalaHoraFim_alvorada,

      escalaNumFaixas_diurna: (map.escalaNumFaixas_diurna as string) ?? DEFAULT_CONFIG.escalaNumFaixas_diurna,
      escalaNumFaixas_almoco: (map.escalaNumFaixas_almoco as string) ?? DEFAULT_CONFIG.escalaNumFaixas_almoco,
      escalaNumFaixas_janta: (map.escalaNumFaixas_janta as string) ?? DEFAULT_CONFIG.escalaNumFaixas_janta,
      escalaNumFaixas_noturna: (map.escalaNumFaixas_noturna as string) ?? DEFAULT_CONFIG.escalaNumFaixas_noturna,
      escalaNumFaixas_alvorada: (map.escalaNumFaixas_alvorada as string) ?? DEFAULT_CONFIG.escalaNumFaixas_alvorada,
    }
  } catch {
    return DEFAULT_CONFIG
  }
}

// Helper to get dynamic header names based on globalConfig settings
export function getDynamicHeader(
  colKey: string,
  defaultHeader: string,
  globalConfig: ConfigValues,
  modulo: string
): string {
  if (modulo === "ALIMENTACAO") {
    if (colKey === "caixas") return `Caixas (${globalConfig.alimentacaoCaixaCapacidade}un)`
  } else if (modulo === "CAFE") {
    if (colKey === "pacotes") return `Pacotes (${globalConfig.cafeCapacitePacote}un)`
    if (colKey === "garrafas") return `Garrafas (${globalConfig.cafeLitrosPorGarrafa}L)`
  } else if (modulo === "BISCOITO") {
    if (colKey === "pacotes") return `Pacotes (${globalConfig.biscoitoCapacidadePacote}un)`
  }
  return defaultHeader
}

