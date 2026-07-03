import * as XLSX from "xlsx"
import { toast } from "sonner"
import { AlaDistribData } from "@/app/actions/alimentacao"
import { ConfigValues } from "@/lib/calculation"

export const handleExportExcel = (data: AlaDistribData[], config: any, globalConfig: ConfigValues) => {
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
