/**
 * Utilitário de detecção/discriminação de gênero para visitantes (Homens / Mulheres)
 * Prioriza a relação de parentesco declarada e, subsidiariamente, analisa o prenome.
 */

const FEMALE_RELATIONS = new Set([
  "MAE", "MÃE", "ESPOSA", "COMPANHEIRA", "IRMA", "IRMÃ", "FILHA", "TIA",
  "AVO", "AVÓ", "SOGRA", "NORA", "CUNHADA", "AMIGA", "NAMORADA", "MADRASTA",
  "SOBRINHA", "NETA", "PRIMINHA", "PRIMA", "MADRINHA", "COMADRE", "ENTEADA", "CONVIVENTE"
])

const MALE_RELATIONS = new Set([
  "PAI", "ESPOSO", "MARIDO", "COMPANHEIRO", "IRMAO", "IRMÃO", "FILHO", "TIO",
  "AVO", "AVÔ", "SOGRO", "GENRO", "CUNHADO", "AMIGO", "NAMORADO", "PADRASTO",
  "SOBRINHO", "NETO", "PRIMINHO", "PRIMO", "PADRINHO", "COMPADRE", "ENTEADO"
])

const COMMON_FEMALE_NAMES = new Set([
  "MARIA", "ANA", "FRANCISCA", "ANTONIA", "ADRIANA", "JULIANA", "MARCIA", "FERNANDA",
  "PATRICIA", "ALINE", "CAMILA", "AMANDA", "BRUNA", "JESSICA", "LETICIA", "VANESSA",
  "CARLA", "BEATRIZ", "RENATA", "RAQUEL", "DANIELA", "DANIELE", "LARISSA", "GABRIELA",
  "LUANA", "CLAUDIA", "TATIANE", "SIMONE", "LUCINHA", "CLEIDE", "SANDRA", "SILVIA",
  "ROSANGELA", "CRISTINA", "MONICA", "ANDREIA", "ANDREZA", "BIANCA", "TALITA", "THAYS",
  "THAIS", "SABRINA", "FABIANA", "PRISCILA", "PALOMA", "EDILENE", "ELIANE", "ROSILENE",
  "RAIMUNDA", "TEREZA", "TEREZINHA", "MARLENE", "IVONE", "AURORA", "SUELI", "ZULENE",
  "INGRID", "ESTHER", "ESTER", "ALICE", "HELENA", "LAURA", "VALENTINA", "SOPHIA", "SOFIA",
  "ISABELA", "ISABELLA", "MANUELA", "EMANUELLY", "LIVIA", "GIOVANNA", "CLARA", "LUIZA"
])

const COMMON_MALE_NAMES = new Set([
  "JOSE", "JOSÉ", "JOAO", "JOÃO", "ANTONIO", "ANTÔNIO", "FRANCISCO", "CARLOS",
  "PAULO", "PEDRO", "LUCAS", "LUIZ", "LUIS", "MARCOS", "GABRIEL", "RAFAEL",
  "DANIEL", "MARCELO", "BRUNO", "EDUARDO", "FELIPE", "RODRIGO", "MANOEL", "MATEUS",
  "MATHEUS", "ANDRE", "ANDRÉ", "LEONARDO", "GUSTAVO", "GUILHERME", "TIAGO", "THIAGO",
  "CAIO", "VINICIUS", "DIEGO", "ROBERTO", "FERNANDO", "VITOR", "VICTOR", "SAMUEL",
  "RICARDO", "ALEXANDRE", "FABIO", "FÁBIO", "LEANDRO", "WESLEY", "IGOR", "VANDERLEI",
  "RAIMUNDO", "SEBASTIAO", "SEBASTIÃO", "GERALDO", "VALDIR", "CLAUDIO", "CLÁUDIO",
  "ELIAS", "JONAS", "LUCAS", "ISAAC", "DAVI", "ARTHUR", "HEITOR", "BERNARDO", "THEO",
  "DOUGLAS", "DENIS", "ELVIS", "ALAN", "ALLAN", "LUAN", "JEAN", "RENAN", "WILLIAN", "WILLIAM"
])

function normalizeWord(str: string): string {
  return str
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

export function detectVisitorGender(relacao?: string, nomeVisitante?: string, explicitGender?: string): "M" | "F" {
  // 0. Se gênero explícito foi informado
  if (explicitGender) {
    const norm = normalizeWord(explicitGender)
    if (norm === "M" || norm === "MASCULINO" || norm === "HOMEM" || norm === "H") return "M"
    if (norm === "F" || norm === "FEMININO" || norm === "MULHER") return "F"
  }

  // 1. Tentar por relação de parentesco declarada
  if (relacao) {
    const normRel = normalizeWord(relacao)
    if (FEMALE_RELATIONS.has(normRel)) return "F"
    if (MALE_RELATIONS.has(normRel)) return "M"
  }

  // 2. Tentar pelo primeiro nome do visitante
  if (nomeVisitante) {
    const firstName = normalizeWord(nomeVisitante.split(/\s+/)[0] || "")
    if (firstName) {
      if (COMMON_FEMALE_NAMES.has(firstName)) return "F"
      if (COMMON_MALE_NAMES.has(firstName)) return "M"

      // Heurística de terminação de prenomes no português
      if (firstName.endsWith("A") && !["LUCA", "JEHOVA"].includes(firstName)) {
        return "F"
      }
      if (
        firstName.endsWith("O") ||
        firstName.endsWith("OS") ||
        firstName.endsWith("ON") ||
        firstName.endsWith("OR") ||
        firstName.endsWith("EL")
      ) {
        return "M"
      }
    }
  }

  // Padrão em unidades prisionais masculinas para visitantes gerais sem identificação explícita
  // mais de 90% das visitas cadastradas são do sexo feminino (mães, companheiras, irmãs).
  return "F"
}
