export interface ExtractedVisitor {
  senha: number
  custodiado: string
  localizacao: string
}

export const ALAS_VALIDAS_UPI4 = ["A", "B", "C", "D", "E", "F", "SEGURANCA A", "SEGURANÇA B", "ENFERMARIA"]

export const isAlaValida = (localizacao: string): boolean => {
  const match = localizacao.match(/Ala[:\s]+(.+?)\s*-\s*Cela/i)
  if (!match) return false

  const ala = match[1].trim().toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")

  return ALAS_VALIDAS_UPI4.some((validAla) => {
    const normalizedValidAla = validAla.toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
    return ala === normalizedValidAla
  })
}

export const parsePDFText = (text: string): { tempData: ExtractedVisitor[]; rejected: number } => {
  const fixedText = text.replace(/RONALD CAMELO DOS\s+VISITA\s+COM\s+.*?13\s+SANTOS\s+MALOTE/gi, 
                                  "RONALD CAMELO DOS SANTOS VISITA COM MALOTE")
  
  const cleanText = fixedText
    .replace(/Página \d+ de \d+/g, " ")
    .replace(/Gerado em \d{2}\/\d{2}\/\d{4} as \d{2}:\d{2}:\d{2}/g, " ")
    .replace(/RELATÓRIO DE VISITAS\/ENTREGA MALOTES COM SENHAS/g, " ")
    .replace(/\s+/g, " ")

  const regex = /(\d{1,3})\s+(\d{6})\s+-\s+([A-ZÀÉÍÓÚÂÊÔÃÕÇÜÑ][A-ZÀÉÍÓÚÂÊÔÃÕÇÜÑ\s]{2,80}?)\s+VISITA\s+(SEM|COM)\s+MALOTE/gi
  
  let match
  const tempData: ExtractedVisitor[] = []
  const seen = new Set<string>()
  let rejected = 0

  while ((match = regex.exec(cleanText)) !== null) {
    const senha = parseInt(match[1], 10)
    const custodiado = match[3]
      .trim()
      .replace(/\s+/g, " ")
      .replace(/\s+(No|Sim|Não)$/i, "")
    
    const afterMatch = cleanText.substring(match.index, match.index + 800)
    const isCancelada = /Cancelada/i.test(afterMatch.substring(0, 300))
    
    if (isCancelada) continue

    const locRegex = /Bloco[:\s]+(\d+)\s+-\s+Ala[:\s]+([A-ZÀ-Úa-zà-ú0-9\s]+?)\s+-\s+Cela[:\s]+([A-Z0-9]+)/gi
    const locations = []
    let locMatch
    
    while ((locMatch = locRegex.exec(afterMatch)) !== null) {
      locations.push({
        bloco: locMatch[1].trim(),
        ala: locMatch[2].trim(),
        cela: locMatch[3].trim()
      })
    }
    
    let localizacao = "Não encontrada"
    if (locations.length >= 2) {
      const loc = locations[1]
      localizacao = `Bloco ${loc.bloco} - Ala ${loc.ala} - Cela ${loc.cela}`
    } else if (locations.length === 1) {
      const loc = locations[0]
      localizacao = `Bloco ${loc.bloco} - Ala ${loc.ala} - Cela ${loc.cela}`
    }

    if (!isAlaValida(localizacao)) {
      rejected++
      continue
    }

    const key = custodiado.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    
    if (!seen.has(key)) {
      seen.add(key)
      tempData.push({ senha, custodiado, localizacao })
    }
  }

  return { tempData, rejected }
}
