import { describe, it, expect } from "vitest"
import { calculateCRC32, createZipFile, readZipFile } from "@/components/ferramentas/utils/zipUtils"
import {
  diferencaDias,
  somarDias,
  penaParaDias,
  diasParaPena,
  calcularFracaoPenal,
  getEquipeDoDia,
} from "@/components/ferramentas/utils/penalCalculations"

describe("Ferramentas - Utilitários ZIP nativos", () => {
  it("deve calcular CRC32 corretamente para uma sequência de bytes", () => {
    const encoder = new TextEncoder()
    const data = encoder.encode("DEEPDATA-TEST-STRING")
    const crc = calculateCRC32(data)
    expect(crc).toBeTypeOf("number")
    expect(crc).toBeGreaterThan(0)
  })

  it("deve criar um arquivo ZIP válido e permitir ler seus metadados", async () => {
    const encoder = new TextEncoder()
    const files = [
      { name: "teste1.txt", data: encoder.encode("Conteudo do teste 1") },
      { name: "relatorio.csv", data: encoder.encode("ala,internos\nA,20\nB,35") },
    ]

    const zipBytes = await createZipFile(files)
    expect(zipBytes.length).toBeGreaterThan(60)

    // Assinatura PK\x03\x04
    expect(zipBytes[0]).toBe(0x50) // 'P'
    expect(zipBytes[1]).toBe(0x4b) // 'K'
    expect(zipBytes[2]).toBe(0x03)
    expect(zipBytes[3]).toBe(0x04)

    // Ler ZIP
    const items = await readZipFile(zipBytes.buffer as ArrayBuffer)
    expect(items.length).toBe(2)
    expect(items[0].name).toBe("teste1.txt")
    expect(items[1].name).toBe("relatorio.csv")
  })
})

describe("Ferramentas - Cálculos Penais e Operacionais", () => {
  it("deve converter anos, meses e dias para total de dias penais", () => {
    // 1 ano (365) + 2 meses (60) + 5 dias = 430 dias
    const total = penaParaDias(1, 2, 5)
    expect(total).toBe(430)
    const convertido = diasParaPena(total)
    expect(convertido.anos).toBe(1)
    expect(convertido.meses).toBe(2)
    expect(convertido.dias).toBe(5)
  })

  it("deve calcular frações penais da LEP corretamente", () => {
    // Pena de 6 anos = 2190 dias. Fração de 1/6 = 365 dias (1 ano).
    const resultado = calcularFracaoPenal(6, 0, 0, 1, 6, "2026-01-01")
    expect(resultado.totalDiasPena).toBe(2190)
    expect(resultado.diasFracao).toBe(365)
    expect(resultado.penaCumprir.anos).toBe(1)
    expect(resultado.dataProjecao).toBeDefined()
  })

  it("deve calcular diferença em dias e somar prazos", () => {
    const diff = diferencaDias("2026-01-01", "2026-01-11")
    expect(diff).toBe(10)

    const soma = somarDias("2026-01-01", 10)
    expect(soma).toContain("11/01/2026")
  })

  it("deve determinar a equipe do ciclo 24x72 (Alfa, Bravo, Charlie, Delta)", () => {
    // Hoje: 02/10/2026 -> ALFA
    const hoje = new Date(2026, 9, 2)
    const eqHoje = getEquipeDoDia(hoje)
    expect(eqHoje.id).toBe("ALFA")
    expect(eqHoje.nome).toBe("Alfa")

    // Amanhã: 03/10/2026 -> BRAVO
    const amanha = new Date(2026, 9, 3)
    const eqAmanha = getEquipeDoDia(amanha)
    expect(eqAmanha.id).toBe("BRAVO")
    expect(eqAmanha.nome).toBe("Bravo")

    // Depois: 04/10/2026 -> CHARLIE
    const depois = new Date(2026, 9, 4)
    const eqDepois = getEquipeDoDia(depois)
    expect(eqDepois.id).toBe("CHARLIE")
    expect(eqDepois.nome).toBe("Charlie")

    // Depois: 05/10/2026 -> DELTA
    const quartoDia = new Date(2026, 9, 5)
    const eqQuarto = getEquipeDoDia(quartoDia)
    expect(eqQuarto.id).toBe("DELTA")
    expect(eqQuarto.nome).toBe("Delta")

    // Reinicia o ciclo: 06/10/2026 -> ALFA
    const quintoDia = new Date(2026, 9, 6)
    const eqQuinto = getEquipeDoDia(quintoDia)
    expect(eqQuinto.id).toBe("ALFA")
  })
})
