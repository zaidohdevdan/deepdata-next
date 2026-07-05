import * as XLSX from "xlsx"
import { toast } from "sonner"

interface VisitaRow {
  [key: string]: string | number | undefined
  senhaDisplay?: string
  nomeVisitante?: string
  cpfVisitante?: string
  relacao?: string
  situacao?: string
  prontuario?: number
  custodiado?: string
  ala?: string
  cela?: string
  prioridade?: string
}

export const handleExportExcel = (displayRows: VisitaRow[], viewMode: "visitas" | "internos") => {
  if (displayRows.length === 0) return
  const exportData = displayRows.map((r, idx) => {
    if (viewMode === "visitas") {
      return {
        Ordem: idx + 1,
        Senha: r.senhaDisplay,
        "Nome Visitante": r.nomeVisitante,
        "CPF Visitante": r.cpfVisitante,
        Relação: r.relacao,
        Situação: r.situacao,
        Prontuário: r.prontuario,
        Custodiado: r.custodiado,
        Ala: r.ala,
        Cela: r.cela,
        Prioridade: r.prioridade,
      }
    } else {
      return {
        Ordem: idx + 1,
        Prontuário: r.prontuario,
        Custodiado: r.custodiado,
        Ala: r.ala,
        Cela: r.cela,
      }
    }
  })
  const ws = XLSX.utils.json_to_sheet(exportData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, viewMode === "visitas" ? "Visitas" : "Internos")
  XLSX.writeFile(wb, viewMode === "visitas" ? "Visitas_UPI4.xlsx" : "Internos_UPI4.xlsx")
  toast.success("Planilha gerada com sucesso!")
}

export const handleGeneratePDF = (displayRows: VisitaRow[], viewMode: "visitas" | "internos") => {
  if (displayRows.length === 0) return

  let headers = ""
  let rows = ""

  if (viewMode === "visitas") {
    headers = `
      <th>Nº</th>
      <th>Senha</th>
      <th>Visitante</th>
      <th>Relação</th>
      <th>Interno</th>
      <th>Ala/Cela</th>
      <th>Prior.</th>`
    rows = displayRows
      .map(
        (r, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td>${r.senhaDisplay}</td>
          <td>${r.nomeVisitante || "—"}</td>
          <td>${r.relacao || "—"}</td>
          <td>${r.custodiado}<br/><small>#${r.prontuario}</small></td>
          <td>${r.cela || r.ala}</td>
          <td>${r.prioridade === "sim" ? "✓ SIM" : "NÃO"}</td>
        </tr>`
      )
      .join("")
  } else {
    headers = `
      <th>Nº</th>
      <th>Prontuário</th>
      <th>Interno</th>
      <th>Ala/Cela</th>`
    rows = displayRows
      .map(
        (r, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td>${(r.prontuario ?? 0) > 0 ? r.prontuario : "—"}</td>
          <td>${r.custodiado}</td>
          <td>${r.cela || r.ala}</td>
        </tr>`
      )
      .join("")
  }

  const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<title>${viewMode === "visitas" ? "Visitas" : "Internos"} UPI-4</title>
<style>
body { font-family: Arial, sans-serif; font-size: 12px; margin: 20px; color: #111827; }
h1 { font-size: 18px; margin-bottom: 4px; color: #111827; }
p { font-size: 11px; color: #4b5563; margin-bottom: 12px; font-weight: bold; }
table { width: 100%; border-collapse: collapse; border: 1.5px solid #1f2937; }
th { background: #5b21b6; color: white; padding: 6px 8px; text-align: left; font-size: 11.5px; text-transform: uppercase; border: 1px solid #1f2937; }
td { padding: 6px 8px; border: 1px solid #1f2937; vertical-align: middle; font-size: 11px; }
tr:nth-child(even) td { background: #f9fafb; }
small { color: #4b5563; font-size: 9.5px; font-weight: bold; }
@page { margin: 15mm; }
</style></head><body>
<h1>Sistema de ${viewMode === "visitas" ? "Visitas" : "Internos"} UPI-4</h1>
<p>Gerado em ${new Date().toLocaleDateString("pt-BR")} — Total: ${displayRows.length} ${viewMode === "visitas" ? "visitas" : "internos"} exibidos</p>
<table>
<thead><tr>${headers}</tr></thead>
<tbody>${rows}</tbody>
</table>
</body></html>`

  const win = window.open("", "_blank")
  if (!win) { toast.error("Pop-up bloqueado. Permita pop-ups e tente novamente."); return }
  win.document.write(html)
  win.document.close()
  win.focus()
  setTimeout(() => win.print(), 400)
}
