import { toast } from "sonner"
import * as XLSX from "xlsx"
import { AlaDistribData } from "@/app/actions/alimentacao"

interface UseAlimentacaoExcelArgs {
  setData: React.Dispatch<React.SetStateAction<AlaDistribData[]>>
}

export function useAlimentacaoExcel({ setData }: UseAlimentacaoExcelArgs) {
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

        const normalizeKey = (key: string) => {
          return key
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]/g, "")
        }

        const hasRawLocation = rawJson.some((row) => {
          return Object.keys(row).some(key => {
            const norm = normalizeKey(key)
            return norm.includes("localiza")
          })
        })

        if (hasRawLocation) {
          const counts: Record<string, number> = {}
          rawJson.forEach((row) => {
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
                dietas: Math.min(item.dietas, sum),
              }
            })
          })

          toast.success("Importação concluída!", {
            description: `Dados consolidados do Confere (${rawJson.length} internos). Não esqueça de Salvar.`,
          })
          if (e.target) e.target.value = ""
          return
        }

        let updatedCount = 0
        setData((prev) => {
          const updatedData = prev.map((item) => {
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

  return { handleImportExcel }
}
