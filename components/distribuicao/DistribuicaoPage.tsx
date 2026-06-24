"use client"

import { useState, useTransition, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import * as XLSX from "xlsx"
import { ConfigValues, alimentacaoConfig, cafeConfig, biscoitoConfig } from "@/lib/calculation"
import { AlaDistribData, saveDistribuicaoData, clearDistribuicaoData, addAlaAction, deleteAlaAction } from "@/app/actions/distribuicao"
import { RefreshCw } from "lucide-react"

import { DistribuicaoHeader } from "./DistribuicaoHeader"
import { DistribuicaoTable } from "./DistribuicaoTable"
import { DistribuicaoSummary } from "./DistribuicaoSummary"
import { AddAlaModal, ClearDataModal } from "./Modals"

const configMap = {
  ALIMENTACAO: alimentacaoConfig,
  CAFE: cafeConfig,
  BISCOITO: biscoitoConfig,
}

interface DistribuicaoPageProps {
  modulo: "ALIMENTACAO" | "CAFE" | "BISCOITO"
  initialData: AlaDistribData[]
  globalConfig: ConfigValues
}

export function DistribuicaoPage({ modulo, initialData, globalConfig }: DistribuicaoPageProps) {
  const config = configMap[modulo]
  const router = useRouter()
  const [data, setData] = useState<AlaDistribData[]>(initialData)
  const [isPending, startTransition] = useTransition()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showClearModal, setShowClearModal] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Track the previous initialData to detect server-side changes
  const lastInitialDataRef = useRef<AlaDistribData[]>(initialData)

  // Sync state if initialData changes on the server (e.g. on revalidation/save)
  useEffect(() => {
    const lastInitialData = lastInitialDataRef.current
    const initialDataChanged = initialData.length !== lastInitialData.length || !initialData.every((p, i) =>
      p.id === lastInitialData[i].id && p.internos === lastInitialData[i].internos && p.dietas === lastInitialData[i].dietas
    )

    if (initialDataChanged) {
      setData(initialData)
      lastInitialDataRef.current = initialData
    }
  }, [initialData])

  // Carregar dados salvos no localStorage ao montar a página
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`distrib_data_${modulo}`)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setData(parsed)
          }
        } catch (e) {
          console.error("Erro ao carregar dados salvos da distribuição", e)
        }
      }
      setIsLoaded(true)
    }
  }, [modulo])

  // Sincronizar dados com o localStorage ao alterar
  useEffect(() => {
    if (typeof window !== "undefined" && isLoaded) {
      if (data.length > 0) {
        localStorage.setItem(`distrib_data_${modulo}`, JSON.stringify(data))
      } else {
        localStorage.removeItem(`distrib_data_${modulo}`)
      }
    }
  }, [data, isLoaded, modulo])

  // Handle cell change
  const handleCellChange = (id: string, field: "internos" | "dietas", value: string) => {
    const numericValue = value === "" ? 0 : Math.max(0, parseInt(value, 10) || 0)
    setData((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        const updated = { ...item, [field]: numericValue }
        
        // Prevent dietas from exceeding total internos
        if (field === "internos" && updated.dietas > numericValue) {
          updated.dietas = numericValue
        } else if (field === "dietas" && numericValue > updated.internos) {
          updated.dietas = updated.internos
        }
        return updated
      })
    )
  }

  // Save to DB
  const handleSave = () => {
    startTransition(async () => {
      const res = await saveDistribuicaoData(config.modulo, data)
      if (res.success) {
        toast.success("Dados salvos com sucesso!", {
          description: "Os dados foram armazenados no banco de dados SQLite.",
        })
        router.refresh()
      } else {
        toast.error("Erro ao salvar", {
          description: res.error || "Ocorreu um erro ao salvar.",
        })
      }
    })
  }

  // Clear data
  const handleClear = () => {
    startTransition(async () => {
      const res = await clearDistribuicaoData(config.modulo)
      if (res.success) {
        setData((prev) => prev.map((item) => ({ ...item, internos: 0, dietas: 0 })))
        toast.success("Dados resetados para zero.")
        setShowClearModal(false)
        router.refresh()
      } else {
        toast.error("Erro ao limpar dados.")
      }
    })
  }

  // Add new Ala
  const handleAddAla = (name: string) => {
    startTransition(async () => {
      const res = await addAlaAction(name)
      if (res.success) {
        toast.success(`Ala "${name.toUpperCase()}" criada com sucesso!`)
        setShowAddModal(false)
        router.refresh()
      } else {
        toast.error("Erro ao criar ala", {
          description: res.error || "Verifique se o nome é único.",
        })
      }
    })
  }

  // Delete/Deactivate Ala
  const handleDeleteAla = (id: string, name: string) => {
    if (!confirm(`Deseja realmente remover a ala ${name}?`)) return

    startTransition(async () => {
      const res = await deleteAlaAction(id)
      if (res.success) {
        toast.success(`Ala "${name}" remetida com sucesso.`)
        setData((prev) => prev.filter((item) => item.id !== id))
        router.refresh()
      } else {
        toast.error("Erro ao remover ala.")
      }
    })
  }

  // Export to Excel
  const handleExportExcel = () => {
    const preparedData = data.map((item) => {
      const computed = config.calcularAla(
        { id: item.id, nome: item.nome, internos: item.internos, dietas: item.dietas },
        globalConfig
      )
      
      const row: Record<string, string | number> = {
        "Ala": item.nome,
        "Qtd. Internos": item.internos,
      }

      if (config.modulo === "ALIMENTACAO") {
        row[`Caixas (${globalConfig.alimentacaoCaixaCapacidade}un)`] = computed.caixas
        row["Alimentação Normal"] = computed.normal
        row["Dietas"] = item.dietas
      } else if (config.modulo === "CAFE") {
        row[`Pacotes (${globalConfig.cafeCapacitePacote}un)`] = computed.pacotes
        row["Unidades Pães"] = computed.unidades
        row[`Garrafas (${globalConfig.cafeLitrosPorGarrafa}L)`] = computed.garrafas
      } else if (config.modulo === "BISCOITO") {
        row[`Pacotes (${globalConfig.biscoitoCapacidadePacote}un)`] = computed.pacotes
        row["Unidades Biscoitos"] = computed.unidades
        row["Garrafas Leite (40L)"] = computed.garrafas
      }

      return row
    })

    // Summary Row
    const summary = config.calcularResumo(
      data.map((i) => ({ id: i.id, nome: i.nome, internos: i.internos, dietas: i.dietas })),
      globalConfig
    )

    const summaryRow: Record<string, string | number> = {
      "Ala / Galpão": "TOTAL GERAL",
      "Qtd. Internos": summary["Total de Internos"] || 0,
    }

    if (config.modulo === "ALIMENTACAO") {
      summaryRow[`Caixas (${globalConfig.alimentacaoCaixaCapacidade}un)`] = summary["Caixas"] || ""
      summaryRow["Alimentação Normal"] = ""
      summaryRow["Dietas"] = data.reduce((acc, curr) => acc + curr.dietas, 0)
    } else if (config.modulo === "CAFE") {
      summaryRow[`Pacotes (${globalConfig.cafeCapacitePacote}un)`] = summary["Total de Pacotes"] || 0
      summaryRow["Unidades Pães"] = summary["Total de Pães"] || 0
      summaryRow[`Garrafas (${globalConfig.cafeLitrosPorGarrafa}L)`] = summary["Total de Garrafas"] || 0
    } else if (config.modulo === "BISCOITO") {
      summaryRow[`Pacotes (${globalConfig.biscoitoCapacidadePacote}un)`] = summary["Total de Pacotes"] || 0
      summaryRow["Unidades Biscoitos"] = summary["Total de Biscoitos"] || 0
      summaryRow["Garrafas Leite (40L)"] = summary["Total de Garrafas"] || 0
    }

    preparedData.push(summaryRow)

    const ws = XLSX.utils.json_to_sheet(preparedData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Distribuição")

    const dateStr = new Date().toLocaleDateString("pt-BR").replace(/\//g, "-")
    XLSX.writeFile(wb, `DeepData_Distrib_${config.modulo}_${dateStr}.xlsx`)
    toast.success("Planilha exportada com sucesso!")
  }

  // Import from Excel
  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const result = event.target?.result
        if (!result) return
        const arrayData = new Uint8Array(result as ArrayBuffer)
        const workbook = XLSX.read(arrayData, { type: "array" })
        const wsName = workbook.SheetNames[0]
        const ws = workbook.Sheets[wsName]
        const rawJson = XLSX.utils.sheet_to_json<Record<string, string | number | undefined>>(ws)

        if (!rawJson || rawJson.length === 0) {
          toast.error("Planilha vazia ou em formato inválido.")
          return
        }

        // Helper to normalize keys for robust case-and-accent-insensitive matching
        const normalizeKey = (key: string) => {
          return key
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]/g, "")
        }

        // Detectar se é uma listagem bruta de internos (como o confere.xls)
        const hasRawLocation = rawJson.some((row) => {
          return Object.keys(row).some(key => {
            const norm = normalizeKey(key)
            return norm.includes("localiza")
          })
        })

        if (hasRawLocation) {
          const counts: Record<string, number> = {}
          rawJson.forEach((row) => {
            // Encontrar a coluna de localização de forma robusta
            const locKey = Object.keys(row).find(key => normalizeKey(key).includes("localiza"))
            const loc = String(locKey ? row[locKey] : "").trim()
            
            const match = loc.match(/Ala[:\s]+(.+?)(?:\s*-\s*Cela|$)/i)
            const alaName = match ? match[1].trim().toUpperCase() : ""
            if (alaName) {
              counts[alaName] = (counts[alaName] || 0) + 1
            }
          })

          setData((prev) => {
            return prev.map((item) => {
              let sum = 0
              Object.keys(counts).forEach((alaKey) => {
                const isMatch = (() => {
                  const normKey = alaKey.trim().toUpperCase()
                  const normDb = item.nome.trim().toUpperCase()
                  if (normKey === normDb) return true
                  if (normDb === "ENFERMARIA" && normKey.startsWith("ENFERMARIA")) return true
                  if (normDb.replace("ALA", "").trim() === normKey.replace("ALA", "").trim()) return true
                  return false
                })()

                if (isMatch) {
                  sum += counts[alaKey]
                }
              })

              return {
                ...item,
                internos: sum,
                dietas: Math.min(item.dietas, sum), // manter dietas limitado ao novo total de internos
              }
            })
          })

          toast.success("Importação concluída!", {
            description: `Dados consolidados do Confere (${rawJson.length} internos). Não esqueça de Salvar.`,
          })
          if (e.target) e.target.value = ""
          return
        }

        // Formato resumo padrão (Ala e Qtd. Internos)
        let updatedCount = 0
        setData((prev) => {
          const updatedData = prev.map((item) => {
            // Find a row where ala/galpão matches item.nome (case-insensitive)
            const excelRow = rawJson.find((row) => {
              const alaKey = Object.keys(row).find(k => {
                const norm = normalizeKey(k)
                return norm === "ala" || norm === "alagalpao"
              })
              const rowName = String(alaKey ? row[alaKey] : "").trim().toUpperCase()
              return rowName === item.nome.toUpperCase()
            })

            if (excelRow) {
              updatedCount++
              // Find internos and dietas values robustly
              const internosKey = Object.keys(excelRow).find(k => {
                const norm = normalizeKey(k)
                return norm === "qtdinternos" || norm === "internos" || norm === "quantidade"
              })
              const dietasKey = Object.keys(excelRow).find(k => {
                const norm = normalizeKey(k)
                return norm === "dietas" || norm === "dieta"
              })

              const excelInternos = parseInt(String(internosKey ? excelRow[internosKey] : "0"), 10) || 0
              const excelDietas = parseInt(String(dietasKey ? excelRow[dietasKey] : "0"), 10) || 0

              return {
                ...item,
                internos: Math.max(0, excelInternos),
                dietas: Math.min(Math.max(0, excelInternos), Math.max(0, excelDietas)),
              }
            }
            return item
          })

          // Show toast with correct count after update
          setTimeout(() => {
            toast.success(`Importação concluída!`, {
              description: `Atualizadas ${updatedCount} alas com os dados da planilha. Não esqueça de Salvar.`,
            })
          }, 0)

          return updatedData
        })

        if (e.target) e.target.value = ""
      } catch (err) {
        console.error("Error reading spreadsheet:", err)
        toast.error("Erro ao ler a planilha. Verifique a formatação.")
      }
    }
    reader.readAsArrayBuffer(file)
  }

  // Calculation of summary card metrics
  const summaryMetrics = config.calcularResumo(
    data.map((i) => ({ id: i.id, nome: i.nome, internos: i.internos, dietas: i.dietas })),
    globalConfig
  )

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-slate-50/50 rounded-2xl border border-slate-100 p-8 shadow-sm">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="animate-spin text-slate-400" size={32} />
          <span className="text-sm font-semibold text-slate-500 tracking-wide animate-pulse">
            Carregando dados de {config.titulo.toLowerCase()}...
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DistribuicaoHeader
        config={config}
        globalConfig={globalConfig}
        onImport={handleImportExcel}
        onExport={handleExportExcel}
        onClearClick={() => setShowClearModal(true)}
      />

      {/* Main Container */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 print:flex print:flex-col print:gap-4">
        {/* Table Column */}
        <div className="xl:col-span-3 flex flex-col print:w-full">
          <DistribuicaoTable
            data={data}
            config={config}
            globalConfig={globalConfig}
            isPending={isPending}
            onCellChange={handleCellChange}
            onDeleteAla={handleDeleteAla}
            onAddAlaClick={() => setShowAddModal(true)}
            onResetLocal={() => {
              setData(initialData)
              toast.success("Alterações descartadas. Dados restaurados do banco.")
            }}
            onSave={handleSave}
          />
        </div>

        {/* Summary sidebar Column */}
        <div className="xl:col-span-1 space-y-6 print:w-full print:block">
          <DistribuicaoSummary
            summaryMetrics={summaryMetrics}
            config={config}
            globalConfig={globalConfig}
          />
        </div>
      </div>

      <AddAlaModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onConfirm={handleAddAla}
        isPending={isPending}
      />

      <ClearDataModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleClear}
        isPending={isPending}
      />
    </div>
  )
}
