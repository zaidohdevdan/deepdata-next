"use client"

import { useState, useEffect, useRef } from "react"
import {
  Calculator,
  History,
  Copy,
  Scale,
} from "lucide-react"
import { toast } from "sonner"
import {
  FRACOES_LEP,
  calcularFracaoPenal,
  diferencaDias,
  somarDias,
} from "../utils/penalCalculations"

export function CalculadoraTab() {
  const [calcMode, setCalcMode] = useState<"PADRAO" | "PENAL_PRAZOS">("PADRAO")

  // =========================================================================
  // CALCULADORA PADRÃO STATE & LOGIC
  // =========================================================================
  const [display, setDisplay] = useState("0")
  const [prevValue, setPrevValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [historyList, setHistoryList] = useState<string[]>([])

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? digit : display + digit)
    }
  }

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay("0.")
      setWaitingForOperand(false)
    } else if (!display.includes(".")) {
      setDisplay(display + ".")
    }
  }

  const clearAll = () => {
    setDisplay("0")
    setPrevValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const clearEntry = () => {
    setDisplay("0")
  }

  const performOperation = (nextOp: string) => {
    const inputValue = parseFloat(display)

    if (prevValue === null) {
      setPrevValue(inputValue)
    } else if (operation) {
      const currentValue = prevValue || 0
      let result = 0

      switch (operation) {
        case "+":
          result = currentValue + inputValue
          break
        case "-":
          result = currentValue - inputValue
          break
        case "×":
        case "*":
          result = currentValue * inputValue
          break
        case "÷":
        case "/":
          result = inputValue === 0 ? 0 : currentValue / inputValue
          break
        case "%":
          result = (currentValue * inputValue) / 100
          break
      }

      const formatted = String(Number(result.toFixed(8)))
      setHistoryList((prev) => [`${currentValue} ${operation} ${inputValue} = ${formatted}`, ...prev.slice(0, 19)])
      setDisplay(formatted)
      setPrevValue(result)
    }

    setWaitingForOperand(true)
    setOperation(nextOp === "=" ? null : nextOp)
  }

  const handleSqrt = () => {
    const val = parseFloat(display)
    if (val < 0) {
      toast.error("Não existe raiz de número negativo.")
      return
    }
    const res = Math.sqrt(val)
    const formatted = String(Number(res.toFixed(8)))
    setHistoryList((prev) => [`√(${val}) = ${formatted}`, ...prev.slice(0, 19)])
    setDisplay(formatted)
    setWaitingForOperand(true)
  }

  const handleToggleSign = () => {
    const val = parseFloat(display)
    setDisplay(String(-val))
  }

  const handlerRef = useRef({
    inputDigit,
    inputDot,
    performOperation,
    clearAll,
    waitingForOperand,
  })

  useEffect(() => {
    handlerRef.current = {
      inputDigit,
      inputDot,
      performOperation,
      clearAll,
      waitingForOperand,
    }
  })

  // Keyboard support for standard calculator
  useEffect(() => {
    if (calcMode !== "PADRAO") return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      const h = handlerRef.current
      if (e.key >= "0" && e.key <= "9") h.inputDigit(e.key)
      else if (e.key === "." || e.key === ",") h.inputDot()
      else if (e.key === "+") h.performOperation("+")
      else if (e.key === "-") h.performOperation("-")
      else if (e.key === "*") h.performOperation("×")
      else if (e.key === "/") h.performOperation("÷")
      else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault()
        h.performOperation("=")
      } else if (e.key === "Backspace") {
        if (!h.waitingForOperand) {
          setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"))
        }
      } else if (e.key === "Escape") {
        h.clearAll()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [calcMode])

  // =========================================================================
  // CALCULADORA DE PRAZOS & FRAÇÕES PENAIS STATE
  // =========================================================================
  // Sub-aba Penal
  const [penalAnos, setPenalAnos] = useState<number>(4)
  const [penalMeses, setPenalMeses] = useState<number>(0)
  const [penalDias, setPenalDias] = useState<number>(0)
  const [selectedFracaoIndex, setSelectedFracaoIndex] = useState<number>(0)
  const [dataInicioPena, setDataInicioPena] = useState(() => new Date().toISOString().slice(0, 10))

  // Sub-aba Prazos entre datas
  const [dataDe, setDataDe] = useState(() => new Date().toISOString().slice(0, 10))
  const [dataAte, setDataAte] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 30)
    return d.toISOString().slice(0, 10)
  })
  const [diasAdicionar, setDiasAdicionar] = useState<number>(30)
  const [dataBaseSoma, setDataBaseSoma] = useState(() => new Date().toISOString().slice(0, 10))

  const selectedFracao = FRACOES_LEP[selectedFracaoIndex]
  const resultadoPenal = calcularFracaoPenal(
    penalAnos,
    penalMeses,
    penalDias,
    selectedFracao.numerador,
    selectedFracao.denominador,
    dataInicioPena
  )

  const diffEmDias = diferencaDias(dataDe, dataAte)
  const projecaoSoma = somarDias(dataBaseSoma, diasAdicionar)

  // =========================================================================
  // PERSISTÊNCIA EM LOCALSTORAGE
  // =========================================================================
  const STORAGE_KEY = "deepdata_calculadora_data"
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const d = JSON.parse(saved)
          if (d.calcMode !== undefined) setCalcMode(d.calcMode)
          if (Array.isArray(d.historyList)) setHistoryList(d.historyList)
          if (typeof d.penalAnos === "number") setPenalAnos(d.penalAnos)
          if (typeof d.penalMeses === "number") setPenalMeses(d.penalMeses)
          if (typeof d.penalDias === "number") setPenalDias(d.penalDias)
          if (typeof d.selectedFracaoIndex === "number") setSelectedFracaoIndex(d.selectedFracaoIndex)
          if (d.dataInicioPena) setDataInicioPena(d.dataInicioPena)
          if (d.dataDe) setDataDe(d.dataDe)
          if (d.dataAte) setDataAte(d.dataAte)
          if (typeof d.diasAdicionar === "number") setDiasAdicionar(d.diasAdicionar)
          if (d.dataBaseSoma) setDataBaseSoma(d.dataBaseSoma)
        }
      } catch {}
      setIsLoaded(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          calcMode,
          historyList,
          penalAnos,
          penalMeses,
          penalDias,
          selectedFracaoIndex,
          dataInicioPena,
          dataDe,
          dataAte,
          diasAdicionar,
          dataBaseSoma,
        })
      )
    } catch {}
  }, [
    isLoaded,
    calcMode,
    historyList,
    penalAnos,
    penalMeses,
    penalDias,
    selectedFracaoIndex,
    dataInicioPena,
    dataDe,
    dataAte,
    diasAdicionar,
    dataBaseSoma,
  ])

  return (
    <div className="space-y-6">
      {/* Seletor de Modo da Calculadora */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/80 w-fit">
        <button
          type="button"
          onClick={() => setCalcMode("PADRAO")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
            calcMode === "PADRAO"
              ? "bg-white text-blue-600 shadow-sm shadow-blue-500/10 border border-slate-200/60"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Calculator size={15} />
          <span>Calculadora Geral & Histórico</span>
        </button>

        <button
          type="button"
          onClick={() => setCalcMode("PENAL_PRAZOS")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
            calcMode === "PENAL_PRAZOS"
              ? "bg-white text-blue-600 shadow-sm shadow-blue-500/10 border border-slate-200/60"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Scale size={15} />
          <span>Frações da LEP & Contagem de Prazos</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* 1. MODO: CALCULADORA PADRÃO COM HISTÓRICO */}
      {/* ===================================================================== */}
      {calcMode === "PADRAO" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Teclado e Display */}
          <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-800">
                  Calculadora Operacional
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  Suporta teclado físico (números, +, -, *, /, Enter, Backspace, Esc).
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(display)
                  toast.success("Valor copiado!")
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition cursor-pointer"
              >
                <Copy size={13} />
                <span>Copiar Display</span>
              </button>
            </div>

            {/* Display Numérico */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 text-right font-mono shadow-inner border border-slate-800">
              <div className="h-5 text-xs text-slate-400 font-sans tracking-wide">
                {prevValue !== null && operation ? `${prevValue} ${operation}` : ""}
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight truncate select-all">
                {display}
              </div>
            </div>

            {/* Teclas */}
            <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={clearAll}
                className="py-3 sm:py-3.5 rounded-2xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-extrabold text-sm transition cursor-pointer"
              >
                AC
              </button>
              <button
                type="button"
                onClick={clearEntry}
                className="py-3 sm:py-3.5 rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-sm transition cursor-pointer"
              >
                CE
              </button>
              <button
                type="button"
                onClick={handleSqrt}
                className="py-3 sm:py-3.5 rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-sm transition cursor-pointer"
              >
                √
              </button>
              <button
                type="button"
                onClick={() => performOperation("÷")}
                className="py-3 sm:py-3.5 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-extrabold text-base transition cursor-pointer"
              >
                ÷
              </button>

              <button
                type="button"
                onClick={() => inputDigit("7")}
                className="py-3 sm:py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 font-black text-lg transition cursor-pointer shadow-2xs"
              >
                7
              </button>
              <button
                type="button"
                onClick={() => inputDigit("8")}
                className="py-3 sm:py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 font-black text-lg transition cursor-pointer shadow-2xs"
              >
                8
              </button>
              <button
                type="button"
                onClick={() => inputDigit("9")}
                className="py-3 sm:py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 font-black text-lg transition cursor-pointer shadow-2xs"
              >
                9
              </button>
              <button
                type="button"
                onClick={() => performOperation("×")}
                className="py-3 sm:py-3.5 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-extrabold text-base transition cursor-pointer"
              >
                ×
              </button>

              <button
                type="button"
                onClick={() => inputDigit("4")}
                className="py-3 sm:py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 font-black text-lg transition cursor-pointer shadow-2xs"
              >
                4
              </button>
              <button
                type="button"
                onClick={() => inputDigit("5")}
                className="py-3 sm:py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 font-black text-lg transition cursor-pointer shadow-2xs"
              >
                5
              </button>
              <button
                type="button"
                onClick={() => inputDigit("6")}
                className="py-3 sm:py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 font-black text-lg transition cursor-pointer shadow-2xs"
              >
                6
              </button>
              <button
                type="button"
                onClick={() => performOperation("-")}
                className="py-3 sm:py-3.5 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-extrabold text-base transition cursor-pointer"
              >
                -
              </button>

              <button
                type="button"
                onClick={() => inputDigit("1")}
                className="py-3 sm:py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 font-black text-lg transition cursor-pointer shadow-2xs"
              >
                1
              </button>
              <button
                type="button"
                onClick={() => inputDigit("2")}
                className="py-3 sm:py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 font-black text-lg transition cursor-pointer shadow-2xs"
              >
                2
              </button>
              <button
                type="button"
                onClick={() => inputDigit("3")}
                className="py-3 sm:py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 font-black text-lg transition cursor-pointer shadow-2xs"
              >
                3
              </button>
              <button
                type="button"
                onClick={() => performOperation("+")}
                className="py-3 sm:py-3.5 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-extrabold text-base transition cursor-pointer"
              >
                +
              </button>

              <button
                type="button"
                onClick={handleToggleSign}
                className="py-3 sm:py-3.5 rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-sm transition cursor-pointer"
              >
                ±
              </button>
              <button
                type="button"
                onClick={() => inputDigit("0")}
                className="py-3 sm:py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 font-black text-lg transition cursor-pointer shadow-2xs"
              >
                0
              </button>
              <button
                type="button"
                onClick={inputDot}
                className="py-3 sm:py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 font-black text-lg transition cursor-pointer shadow-2xs"
              >
                ,
              </button>
              <button
                type="button"
                onClick={() => performOperation("=")}
                className="py-3 sm:py-3.5 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 font-black text-xl transition cursor-pointer shadow-md shadow-blue-600/20"
              >
                =
              </button>
            </div>
          </div>

          {/* Histórico Lateral */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <History size={16} className="text-slate-400" />
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wide">
                    Histórico de Cálculos
                  </span>
                </div>
                {historyList.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setHistoryList([])}
                    className="text-[11px] text-rose-600 font-bold hover:underline cursor-pointer"
                  >
                    Limpar
                  </button>
                )}
              </div>

              {historyList.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-10">
                  Os cálculos efetuados aparecerão aqui automaticamente.
                </p>
              ) : (
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {historyList.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        const parts = item.split(" = ")
                        if (parts[1]) setDisplay(parts[1])
                      }}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 text-xs font-mono text-slate-700 flex items-center justify-between cursor-pointer transition"
                      title="Clique para carregar o resultado no visor"
                    >
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 leading-relaxed">
              Dica: Clique em qualquer item do histórico para reinserir o resultado diretamente no visor.
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. MODO: FRAÇÕES DA LEP & CONTAGEM DE PRAZOS */}
      {/* ===================================================================== */}
      {calcMode === "PENAL_PRAZOS" && (
        <div className="space-y-6">
          {/* Card 1: Calculador de Frações da LEP */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/80 mb-2">
                <Scale size={13} />
                <span>LEI DE EXECUÇÃO PENAL (LEP / PACOTE ANTICRIME)</span>
              </div>
              <h2 className="text-base font-extrabold text-slate-800">
                Calculador de Frações de Pena e Progressão de Regime
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Calcule instantaneamente o tempo a cumprir para progressão ou livramento e obtenha a projeção da data do benefício.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Entradas */}
              <div className="space-y-4 lg:col-span-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
                    Fração / Percentual Legal
                  </label>
                  <select
                    value={selectedFracaoIndex}
                    onChange={(e) => setSelectedFracaoIndex(parseInt(e.target.value))}
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-500 text-slate-800"
                  >
                    {FRACOES_LEP.map((f, idx) => (
                      <option key={idx} value={idx}>
                        {f.label} — {f.descricao}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Pena (Anos)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={penalAnos}
                      onChange={(e) => setPenalAnos(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Pena (Meses)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={11}
                      value={penalMeses}
                      onChange={(e) => setPenalMeses(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Pena (Dias)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={29}
                      value={penalDias}
                      onChange={(e) => setPenalDias(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Data de Início do Cumprimento / Prisão
                  </label>
                  <input
                    type="date"
                    value={dataInicioPena}
                    onChange={(e) => setDataInicioPena(e.target.value)}
                    className="w-full max-w-xs text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>
              </div>

              {/* Resultado Consolidado */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-200/80 space-y-4">
                <div className="text-xs font-black text-blue-900 uppercase tracking-wide">
                  Resultado do Cálculo
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between pb-1.5 border-b border-blue-100">
                    <span className="text-slate-500">Pena Total:</span>
                    <span className="font-bold text-slate-800">
                      {penalAnos}a, {penalMeses}m, {penalDias}d ({resultadoPenal.totalDiasPena} dias)
                    </span>
                  </div>

                  <div className="flex justify-between pb-1.5 border-b border-blue-100">
                    <span className="text-slate-500">Fração ({selectedFracao.label}):</span>
                    <span className="font-bold text-blue-700">
                      {resultadoPenal.penaCumprir.anos}a, {resultadoPenal.penaCumprir.meses}m, {resultadoPenal.penaCumprir.dias}d
                    </span>
                  </div>

                  <div className="flex justify-between pb-1.5 border-b border-blue-100">
                    <span className="text-slate-500">Total em Dias da Fração:</span>
                    <span className="font-mono font-black text-blue-600">
                      {resultadoPenal.diasFracao} dias
                    </span>
                  </div>

                  <div className="flex justify-between pb-1.5 border-b border-blue-100">
                    <span className="text-slate-500">Saldo Restante da Pena:</span>
                    <span className="font-bold text-slate-700">
                      {resultadoPenal.penaRestante.anos}a, {resultadoPenal.penaRestante.meses}m, {resultadoPenal.penaRestante.dias}d
                    </span>
                  </div>

                  {resultadoPenal.dataProjecao && (
                    <div className="pt-2">
                      <span className="block text-[10px] font-bold text-blue-900 uppercase">
                        Data Projetada do Benefício:
                      </span>
                      <span className="text-base font-black text-blue-700 font-mono">
                        {resultadoPenal.dataProjecao}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Contagem de Dias e Projeção de Prazos */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-extrabold text-slate-800">
                Contagem e Projeção de Prazos Operacionais
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Controle de prazos de prisão preventiva, sindicâncias administrativas (PAD) e prazos de resposta.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Diferença entre Datas */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="text-xs font-black text-slate-700 uppercase">
                  Diferença Exata entre Datas
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Data Inicial
                    </label>
                    <input
                      type="date"
                      value={dataDe}
                      onChange={(e) => setDataDe(e.target.value)}
                      className="w-full text-xs font-bold bg-white text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Data Final
                    </label>
                    <input
                      type="date"
                      value={dataAte}
                      onChange={(e) => setDataAte(e.target.value)}
                      className="w-full text-xs font-bold bg-white text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5"
                    />
                  </div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Dias Corridos:</span>
                  <span className="text-lg font-black text-blue-600 font-mono">
                    {diffEmDias} dias
                  </span>
                </div>
              </div>

              {/* Soma de Prazos */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="text-xs font-black text-slate-700 uppercase">
                  Projetar Data Futura (+ Dias)
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Data Base
                    </label>
                    <input
                      type="date"
                      value={dataBaseSoma}
                      onChange={(e) => setDataBaseSoma(e.target.value)}
                      className="w-full text-xs font-bold bg-white text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Somar Dias
                    </label>
                    <input
                      type="number"
                      value={diasAdicionar}
                      onChange={(e) => setDiasAdicionar(parseInt(e.target.value) || 0)}
                      className="w-full text-xs font-bold bg-white text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5"
                    />
                  </div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Vencimento Projetado:</span>
                  <span className="text-lg font-black text-emerald-600 font-mono">
                    {projecaoSoma}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
