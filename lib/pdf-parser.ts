export interface ExtractedVisitor {
  // Dados do interno
  prontuario: number          // prontuário do interno
  senha: number               // senha da visita
  custodiado: string          // nome do interno
  localizacao: string         // texto completo "Bloco … - Ala … - Cela …"
  ala: string                 // "A", "B", "SEGURANÇA A", etc.
  prioridade: string          // "sim" | "não"
  cela: string                // formatado "D-03", "SEG - I02", etc.
  // Dados do visitante
  cpfVisitante: string
  nomeVisitante: string
  relacao: string
  situacao: string            // "Agendada" | "Cancelada" | etc.
  visitantes: string[]
}

// Todas as alas válidas da UPI4
export const ALAS_VALIDAS_UPI4 = [
  "A", "B", "C", "D", "E", "F", "SEGURANÇA A", "SEGURANÇA B"
]

const normalizeStr = (s: string) =>
  s.trim().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

export const isAlaValida = (ala: string): boolean => {
  const norm = normalizeStr(ala)
  return ALAS_VALIDAS_UPI4.some((v) => normalizeStr(v) === norm)
}

export const parsePDFText = (
  text: string
): { tempData: ExtractedVisitor[]; rejected: number } => {
  const fixedText = text.replace(
    /RONALD CAMELO DOS\s+VISITA\s+COM\s+.*?13\s+SANTOS\s+MALOTE/gi,
    "RONALD CAMELO DOS SANTOS VISITA COM MALOTE"
  )

  const cleanText = fixedText
    .replace(/Página \d+ de \d+/g, " ")
    .replace(/Gerado em \d{2}\/\d{2}\/\d{4} as \d{2}:\d{2}:\d{2}/g, " ")
    .replace(/RELATÓRIO DE VISITAS\/ENTREGA MALOTES COM SENHAS/g, " ")
    .replace(/\s+/g, " ")

  const regex =
    /(\d{1,3})\s+(\d{6})\s+-\s+([A-ZÀÉÍÓÚÂÊÔÃÕÇÜÑ][A-ZÀÉÍÓÚÂÊÔÃÕÇÜÑ\s]{2,80}?)\s+VISITA\s+(SEM|COM)\s+MALOTE/gi

  let match
  const tempData: ExtractedVisitor[] = []
  const seen = new Set<string>()
  let rejected = 0

  while ((match = regex.exec(cleanText)) !== null) {
    const senha = parseInt(match[1], 10)
    const prontuario = parseInt(match[2], 10)
    const custodiado = match[3]
      .trim()
      .replace(/\s+/g, " ")
      .replace(/\s+(No|Sim|Não)$/i, "")

    const afterMatch = cleanText.substring(match.index, match.index + 800)
    const isCancelada = /Cancelada/i.test(afterMatch.substring(0, 300))
    if (isCancelada) continue

    const locRegex =
      /Bloco[:\s]+(\d+)\s+-\s+Ala[:\s]+([A-ZÀ-Úa-zà-ú0-9\s]+?)\s+-\s+Cela[:\s]+([A-Z0-9]+)/gi
    const locations: { bloco: string; ala: string; cela: string }[] = []
    let locMatch
    while ((locMatch = locRegex.exec(afterMatch)) !== null) {
      locations.push({
        bloco: locMatch[1].trim(),
        ala: locMatch[2].trim(),
        cela: locMatch[3].trim(),
      })
    }

    let localizacao = "Não encontrada"
    let alaStr = ""
    let celaFormatted = ""
    const loc = locations.length >= 2 ? locations[1] : locations[0]
    if (loc) {
      alaStr = loc.ala
      localizacao = `Bloco ${loc.bloco} - Ala ${loc.ala} - Cela ${loc.cela}`
      const alaUpper = loc.ala.toUpperCase()
      if (alaUpper.includes("SEGURANÇA")) {
        celaFormatted = `SEG-${loc.cela}`
      } else {
        celaFormatted = `${alaUpper.charAt(0)}-${loc.cela}`
      }
    }

    if (!isAlaValida(alaStr)) {
      rejected++
      continue
    }

    // Tentar extrair dados do visitante do texto ao redor
    const cpfMatch = afterMatch.match(/CPF(?:\s+Visitante)?[:\s]+([\d.-]{11,14})/i)
    const cpfVisitante = cpfMatch ? cpfMatch[1].replace(/[.-]/g, "").trim() : ""

    const nomeMatch = afterMatch.match(/Visitante[:\s]+([A-ZÀ-Ú\s]{3,60})(?=\s+(?:CPF|Relação|Parentesco|Bloco|Cela|$))/i)
    const nomeVisitante = nomeMatch ? nomeMatch[1].trim().replace(/\s+/g, " ") : ""

    const relacaoMatch = afterMatch.match(/(?:Relação|Parentesco)[:\s]+([A-ZÀ-Ú\s]{2,20})/i)
    const relacao = relacaoMatch ? relacaoMatch[1].trim() : ""

    const situacaoMatch = afterMatch.match(/Situação(?:\s+Visita)?[:\s]+([A-ZÀ-Úa-zà-ú\s]{3,20})/i)
    const situacao = situacaoMatch ? situacaoMatch[1].trim() : "Agendada"

    const prioridadeMatch = afterMatch.match(/Prioridade[:\s]+(Sim|Não)/i)
    const prioridade = prioridadeMatch ? prioridadeMatch[1].trim().toLowerCase() : "não"

    const key = `${senha}-${normalizeStr(custodiado)}`
    if (!seen.has(key)) {
      seen.add(key)
      tempData.push({
        prontuario,
        senha,
        custodiado,
        localizacao,
        ala: alaStr.toUpperCase(),
        prioridade,
        cela: celaFormatted,
        cpfVisitante,
        nomeVisitante,
        relacao,
        situacao,
        visitantes: [],
      })
    }
  }

  return { tempData, rejected }
}
