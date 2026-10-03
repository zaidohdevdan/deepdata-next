/**
 * Utilitários para cálculos operacionais penitenciários:
 * - Frações da LEP (Lei de Execução Penal) e progressão de regime
 * - Contagem e projeção de prazos em dias/meses/anos
 * - Ciclo de plantão 24x72 das equipes operacionais
 */

export interface FracaoPenalOption {
  label: string
  numerador: number
  denominador: number
  descricao: string
}

export const FRACOES_LEP: FracaoPenalOption[] = [
  { label: "1/6 (16,6%)", numerador: 1, denominador: 6, descricao: "Crime comum sem violência (Primário - LEP antiga)" },
  { label: "16% (16/100)", numerador: 16, denominador: 100, descricao: "Primário, sem violência ou grave ameaça (Pacote Anticrime)" },
  { label: "1/5 (20%)", numerador: 1, denominador: 5, descricao: "Reincidente em crime sem violência (LEP antiga)" },
  { label: "20% (20/100)", numerador: 20, denominador: 100, descricao: "Reincidente, sem violência ou grave ameaça" },
  { label: "25% (25/100)", numerador: 25, denominador: 100, descricao: "Primário, com violência ou grave ameaça" },
  { label: "30% (30/100)", numerador: 30, denominador: 100, descricao: "Reincidente, com violência ou grave ameaça" },
  { label: "1/3 (33,3%)", numerador: 1, denominador: 3, descricao: "Livramento Condicional (Primário crime comum)" },
  { label: "2/5 (40%)", numerador: 2, denominador: 5, descricao: "Hediondo primário (LEP antiga)" },
  { label: "40% (40/100)", numerador: 40, denominador: 100, descricao: "Hediondo ou equiparado primário" },
  { label: "50% (50/100)", numerador: 50, denominador: 100, descricao: "Hediondo com morte primário / Milícia / Org. Criminosa" },
  { label: "3/5 (60%)", numerador: 3, denominador: 60, descricao: "Hediondo reincidente (LEP antiga)" },
  { label: "60% (60/100)", numerador: 60, denominador: 100, descricao: "Hediondo reincidente sem morte" },
  { label: "2/3 (66,6%)", numerador: 2, denominador: 3, descricao: "Livramento Condicional (Crime hediondo primário)" },
  { label: "70% (70/100)", numerador: 70, denominador: 100, descricao: "Hediondo reincidente com resultado morte" },
]

/**
 * Converte pena (anos, meses, dias) em dias totais (ano civil penal = 365 dias, mês = 30 dias).
 */
export function penaParaDias(anos: number, meses: number, dias: number): number {
  return (anos || 0) * 365 + (meses || 0) * 30 + (dias || 0)
}

/**
 * Converte dias totais de volta para anos, meses e dias.
 */
export function diasParaPena(totalDias: number): { anos: number; meses: number; dias: number } {
  const anos = Math.floor(totalDias / 365)
  const restoAnos = totalDias % 365
  const meses = Math.floor(restoAnos / 30)
  const dias = Math.floor(restoAnos % 30)
  return { anos, meses, dias }
}

/**
 * Calcula a fração penal e projeta a data de cumprimento.
 */
export function calcularFracaoPenal(
  anos: number,
  meses: number,
  dias: number,
  numerador: number,
  denominador: number,
  dataInicio?: string
) {
  const totalDiasPena = penaParaDias(anos, meses, dias)
  const diasFracao = Math.floor((totalDiasPena * numerador) / denominador)
  const penaCumprir = diasParaPena(diasFracao)
  const diasRestantes = totalDiasPena - diasFracao
  const penaRestante = diasParaPena(diasRestantes)

  let dataProjecao: string | null = null
  if (dataInicio) {
    const d = new Date(dataInicio + "T00:00:00")
    if (!isNaN(d.getTime())) {
      d.setDate(d.getDate() + diasFracao)
      dataProjecao = d.toLocaleDateString("pt-BR")
    }
  }

  return {
    totalDiasPena,
    diasFracao,
    penaCumprir,
    diasRestantes,
    penaRestante,
    dataProjecao,
  }
}

/**
 * Diferença exata em dias entre duas datas.
 */
export function diferencaDias(data1: string, data2: string): number {
  const d1 = new Date(data1 + "T00:00:00")
  const d2 = new Date(data2 + "T00:00:00")
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Soma dias a uma data e retorna formato pt-BR.
 */
export function somarDias(data: string, dias: number): string {
  const d = new Date(data + "T00:00:00")
  d.setDate(d.getDate() + dias)
  return d.toLocaleDateString("pt-BR")
}

/**
 * Ciclo 24x72 de equipes: Alfa -> Bravo -> Charlie -> Delta.
 * Data base: 02/10/2026 ("Hoje" = Alfa, índice 0).
 * Amanhã (03/10/2026): Bravo (índice 1).
 * Depois (04/10/2026): Charlie (índice 2).
 * Depois (05/10/2026): Delta (índice 3).
 * O ciclo se repete continuamente até o fim do ano.
 */
export const EQUIPES_PLANTAO = [
  { id: "ALFA", nome: "Alfa", color: "bg-blue-600 text-white", border: "border-blue-500", tint: "bg-blue-50 text-blue-700" },
  { id: "BRAVO", nome: "Bravo", color: "bg-amber-600 text-white", border: "border-amber-500", tint: "bg-amber-50 text-amber-700" },
  { id: "CHARLIE", nome: "Charlie", color: "bg-emerald-600 text-white", border: "border-emerald-500", tint: "bg-emerald-50 text-emerald-700" },
  { id: "DELTA", nome: "Delta", color: "bg-purple-600 text-white", border: "border-purple-500", tint: "bg-purple-50 text-purple-700" },
]

export const DATA_BASE_CICLO = new Date(2026, 9, 2) // 02 de Outubro de 2026

export function getEquipeDoDia(targetDate: Date, baseDate = DATA_BASE_CICLO, baseEquipeIndex = 0) {
  const d1 = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate()).getTime()
  const d2 = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).getTime()
  const diffDays = Math.round((d2 - d1) / (1000 * 60 * 60 * 24))
  const offset = (((baseEquipeIndex + diffDays) % 4) + 4) % 4
  return EQUIPES_PLANTAO[offset]
}

/**
 * Feriados Nacionais Brasileiros recorrentes.
 */
export function getFeriadosAno(ano: number): Record<string, string> {
  return {
    [`${ano}-01-01`]: "Confraternização Universal",
    [`${ano}-04-21`]: "Tiradentes",
    [`${ano}-05-01`]: "Dia do Trabalho",
    [`${ano}-09-07`]: "Independência do Brasil",
    [`${ano}-10-12`]: "N. Sra. Aparecida",
    [`${ano}-11-02`]: "Finados",
    [`${ano}-11-15`]: "Proclamação da República",
    [`${ano}-11-20`]: "Dia da Consciência Negra",
    [`${ano}-12-25`]: "Natal",
  }
}
