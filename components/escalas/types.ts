export interface Policial {
  nome: string
  matricula: string
  qra?: string
}

export interface FaixaHorario {
  inicio: string
  fim: string
}

export interface PolicialFixo {
  matricula: string
  nome: string
  posto: string
  faixa: string
}

export interface PolicialEquipe {
  nome: string
  matricula: string
  qra?: string
}

export interface ChefeEquipe {
  id: string
  nome: string
  matricula: string
  equipes: string[]
}

export interface EscalasContainerProps {
  tipo: "diurna" | "almoco" | "janta" | "noturna" | "alvorada"
  initialPoliciaisFixos: PolicialFixo[]
  currentUser: { username: string; name: string; role: string } | null
  equipeAlfa: PolicialEquipe[]
  equipeBravo: PolicialEquipe[]
  equipeEcho: PolicialEquipe[]
  equipeFox: PolicialEquipe[]
  nomeUnidade?: string
  localidade?: string
  initialPostosConfig?: string
  initialHoraInicio?: string
  initialHoraFim?: string
  initialNumFaixas?: string
}

export const INDEPENDENT_POSTS = ["G1", "G3", "G5", "G6", "TENDA ABC"]

export const DEFAULT_INDEPENDENT_HORARIOS: Record<string, string[]> = {
  G1: ["00:00 - 06:00", "06:00 - 12:00", "12:00 - 18:00", "18:00 - 00:00"],
  G3: ["00:00 - 06:00", "06:00 - 12:00", "12:00 - 18:00", "18:00 - 00:00"],
  G5: ["00:00 - 06:00", "06:00 - 12:00", "12:00 - 18:00", "18:00 - 00:00"],
  G6: ["00:00 - 06:00", "06:00 - 12:00", "12:00 - 18:00", "18:00 - 00:00"],
  "TENDA ABC": ["00:00 - 06:00", "06:00 - 12:00", "12:00 - 18:00", "18:00 - 00:00"]
}

export const DEFAULT_INDEPENDENT_ESTADO: Record<string, Record<number, string[]>> = {
  G1: { 0: [], 1: [], 2: [], 3: [] },
  G3: { 0: [], 1: [], 2: [], 3: [] },
  G5: { 0: [], 1: [], 2: [], 3: [] },
  G6: { 0: [], 1: [], 2: [], 3: [] },
  "TENDA ABC": { 0: [], 1: [], 2: [], 3: [] }
}

export const minutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number)
  return h * 60 + m
}

export const toHHMM = (min: number) => {
  const h = Math.floor(min / 60) % 24
  const m = Math.floor(min % 60)
  return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0")
}

export const calcularFaixas = (iniStr: string, endStr: string, n: number): FaixaHorario[] => {
  if (!iniStr || !endStr || !n) return []
  const ini = minutes(iniStr)
  let end = minutes(endStr)
  if (end <= ini) end += 24 * 60 // crosses midnight
  const total = end - ini
  const step = total / n

  const out: FaixaHorario[] = []
  for (let i = 0; i < n; i++) {
    const a = ini + step * i
    const b = ini + step * (i + 1)
    out.push({ inicio: toHHMM(a), fim: toHHMM(b) })
  }
  return out
}
