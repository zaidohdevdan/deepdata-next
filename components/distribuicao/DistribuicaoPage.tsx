"use client"

import { useState, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import * as XLSX from "xlsx"
import { ConfigValues, alimentacaoConfig, cafeConfig, biscoitoConfig } from "@/lib/calculation"
import { AlaDistribData, saveDistribuicaoData, clearDistribuicaoData, addAlaAction, deleteAlaAction } from "@/app/actions/distribuicao"

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

  // Sync state if initialData changes (e.g. on revalidation)
  useEffect(() => {
    // Only update local state if incoming initialData differs from current state
    const shouldUpdate = data.length !== initialData.length || !data.every((p, i) =>
      p.id === initialData[i].id && p.internos === initialData[i].internos && p.dietas === initialData[i].dietas
    )

    if (!shouldUpdate) return

    let mounted = true
    Promise.resolve().then(() => {
      if (mounted) {
        setData(initialData)
      }
    })

    return () => {
      mounted = false
    }
  }, [initialData, data])

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
        row["Caixas (42un)"] = computed.caixas
        row["Alimentação Normal"] = computed.normal
        row["Dietas"] = item.dietas
      } else if (config.modulo === "CAFE") {
        row["Pacotes (80un)"] = computed.pacotes
        row["Unidades Pães"] = computed.unidades
        row["Garrafas (40L)"] = computed.garrafas
      } else if (config.modulo === "BISCOITO") {
        row["Pacotes (68un)"] = computed.pacotes
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
      summaryRow["Caixas (42un)"] = summary["Caixas"] || ""
      summaryRow["Alimentação Normal"] = ""
      summaryRow["Dietas"] = data.reduce((acc, curr) => acc + curr.dietas, 0)
    } else if (config.modulo === "CAFE") {
      summaryRow["Pacotes (80un)"] = summary["Total de Pacotes"] || 0
      summaryRow["Unidades Pães"] = summary["Total de Pães"] || 0
      summaryRow["Garrafas (40L)"] = summary["Total de Garrafas"] || 0
    } else if (config.modulo === "BISCOITO") {
      summaryRow["Pacotes (68un)"] = summary["Total de Pacotes"] || 0
      summaryRow["Unidades Biscoitos"] = summary["Total de Biscoitos"] || 0
      summaryRow["Garrafas Leite (40L)"] = summary["Total de Garrafas"] || 0
    }

    preparedData.push(summaryRow)

    const ws = XLSX.utils.json_to_sheet(preparedData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Distribuição")

    const dateStr = new Date().toLocaleDateString("pt-BR").replace(/\//g, "-")
    XLSX.writeFile(wb, `DeepData_Distrib_${config.modulo}_${dateStr}.xlsx`)
    toast.success("Planilha Excel exportada com sucesso!")
  }

  // Import from Excel
  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const bstr = event.target?.result
        const workbook = XLSX.read(bstr, { type: "binary" })
        const wsName = workbook.SheetNames[0]
        const ws = workbook.Sheets[wsName]
        const rawJson = XLSX.utils.sheet_to_json<Record<string, string | number | undefined>>(ws)

        if (!rawJson || rawJson.length === 0) {
          toast.error("Planilha vazia ou em formato inválido.")
          return
        }

        let updatedCount = 0
        setData((prev) => {
          return prev.map((item) => {
            // Find a row where ala/galpão matches item.nome (case-insensitive)
            const excelRow = rawJson.find((row) => {
              const rowName = String(row["Ala / Galpão"] || row["Ala"] || "").trim().toUpperCase()
              return rowName === item.nome.toUpperCase()
            })

            if (excelRow) {
              updatedCount++
              const excelInternos = parseInt(String(excelRow["Qtd. Internos"] || excelRow["Internos"] || excelRow["Quantidade"] || "0"), 10) || 0
              const excelDietas = parseInt(String(excelRow["Dietas"] || excelRow["Dieta"] || "0"), 10) || 0

              return {
                ...item,
                internos: Math.max(0, excelInternos),
                dietas: Math.min(Math.max(0, excelInternos), Math.max(0, excelDietas)),
              }
            }
            return item
          })
        })

        toast.success(`Importação concluída!`, {
          description: `Atualizadas ${updatedCount} alas com os dados da planilha. Não esqueça de Salvar.`,
        })
      } catch (err) {
        console.error("Error reading Excel:", err)
        toast.error("Erro ao ler o arquivo Excel. Verifique a formatação.")
      }
    }
    reader.readAsBinaryString(file)
  }

  // Calculation of summary card metrics
  const summaryMetrics = config.calcularResumo(
    data.map((i) => ({ id: i.id, nome: i.nome, internos: i.internos, dietas: i.dietas })),
    globalConfig
  )

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
            onResetLocal={() => setData(initialData)}
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
