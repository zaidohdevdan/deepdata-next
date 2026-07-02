import { describe, it, expect } from "vitest"
import { minutes, toHHMM, calcularFaixas } from "@/components/escalas/types"

describe("Teste de Lógica Matemática de Escalas", () => {
  it("deve converter string HH:MM para minutos corretamente", () => {
    expect(minutes("00:00")).toBe(0)
    expect(minutes("06:00")).toBe(360)
    expect(minutes("12:00")).toBe(720)
    expect(minutes("18:00")).toBe(1080)
    expect(minutes("23:59")).toBe(1439)
  })

  it("deve converter minutos inteiros de volta para HH:MM corretamente", () => {
    expect(toHHMM(0)).toBe("00:00")
    expect(toHHMM(360)).toBe("06:00")
    expect(toHHMM(720)).toBe("12:00")
    expect(toHHMM(1080)).toBe("18:00")
    expect(toHHMM(1439)).toBe("23:59")
  })

  it("deve calcular faixas diurnas corretamente (divisão simples)", () => {
    const faixas = calcularFaixas("06:00", "18:00", 2)
    expect(faixas).toHaveLength(2)
    expect(faixas[0]).toEqual({ inicio: "06:00", fim: "12:00" })
    expect(faixas[1]).toEqual({ inicio: "12:00", fim: "18:00" })
  })

  it("deve calcular faixas noturnas que cruzam a meia-noite corretamente", () => {
    const faixas = calcularFaixas("18:00", "06:00", 4)
    expect(faixas).toHaveLength(4)
    expect(faixas[0]).toEqual({ inicio: "18:00", fim: "21:00" })
    expect(faixas[1]).toEqual({ inicio: "21:00", fim: "00:00" })
    expect(faixas[2]).toEqual({ inicio: "00:00", fim: "03:00" })
    expect(faixas[3]).toEqual({ inicio: "03:00", fim: "06:00" })
  })

  it("deve retornar vazio se algum parâmetro do cálculo de faixas for inválido", () => {
    expect(calcularFaixas("", "18:00", 2)).toEqual([])
    expect(calcularFaixas("06:00", "", 2)).toEqual([])
    expect(calcularFaixas("06:00", "18:00", 0)).toEqual([])
  })
})
