import * as XLSX from "xlsx"
import { toast } from "sonner"

export interface VisitaRow {
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

export const handleExportExcel = (rows: VisitaRow[], viewMode: "visitas" | "internos") => {
  if (!rows || rows.length === 0) {
    toast.error("Nenhum registro para exportar.")
    return
  }

  const exportData = rows.map((r, idx) => {
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
  toast.success(`Planilha com ${rows.length} registros gerada com sucesso!`)
}

export const handleGeneratePDF = (rows: VisitaRow[], viewMode: "visitas" | "internos") => {
  if (!rows || rows.length === 0) {
    toast.error("Nenhum registro para imprimir.")
    return
  }

  let headers = ""
  let rowsHtml = ""

  if (viewMode === "visitas") {
    headers = `
      <th style="width: 32px; text-align: center;">Nº</th>
      <th style="width: 55px; text-align: center;">Senha</th>
      <th>Visitante</th>
      <th style="width: 90px; text-align: center;">Parentesco</th>
      <th style="width: 80px; text-align: center;">Situação</th>
      <th>Custodiado Vinculado / Prontuário</th>
      <th style="width: 75px; text-align: center;">Ala / Cela</th>
      <th style="width: 55px; text-align: center;">Prioritário</th>`

    rowsHtml = rows
      .map(
        (r, idx) => `
        <tr>
          <td style="text-align: center; font-weight: bold; color: #4b5563;">${idx + 1}</td>
          <td style="text-align: center; font-weight: 800; font-family: monospace;">${r.senhaDisplay || "—"}</td>
          <td>
            <div style="font-weight: 700; text-transform: uppercase;">${r.nomeVisitante || "—"}</div>
          </td>
          <td style="text-align: center; font-size: 10px;">${r.relacao || "—"}</td>
          <td style="text-align: center; font-size: 9.5px; font-weight: 600;">${r.situacao || "—"}</td>
          <td>
            <div style="font-weight: 700; color: #111827; text-transform: uppercase;">${r.custodiado || "—"}</div>
            ${(r.prontuario ?? 0) > 0 ? `<div style="font-size: 9px; color: #4b5563; font-family: monospace;">Pront: #${r.prontuario}</div>` : ""}
          </td>
          <td style="text-align: center; font-weight: bold; font-size: 10px;">${r.cela || r.ala || "—"}</td>
          <td style="text-align: center; font-weight: bold;">
            ${r.prioridade === "sim"
              ? `<span style="color: #b91c1c; font-weight: 800;">SIM</span>`
              : `<span style="color: #6b7280;">NÃO</span>`
            }
          </td>
        </tr>`
      )
      .join("")
  } else {
    headers = `
      <th style="width: 45px; text-align: center;">QTD</th>
      <th style="width: 100px; text-align: center;">Prontuário</th>
      <th>Nome do Interno</th>
      <th style="width: 130px; text-align: center;">Ala / Cela</th>`

    rowsHtml = rows
      .map(
        (r, idx) => `
        <tr>
          <td style="text-align: center; font-weight: bold; color: #4b5563;">${idx + 1}</td>
          <td style="text-align: center; font-family: monospace; font-weight: bold; font-size: 11px;">${(r.prontuario ?? 0) > 0 ? r.prontuario : "—"}</td>
          <td style="font-weight: 700; text-transform: uppercase;">${r.custodiado || "—"}</td>
          <td style="text-align: center; font-weight: bold; font-size: 10.5px;">${r.cela || r.ala || "—"}</td>
        </tr>`
      )
      .join("")
  }

  const dataAtual = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>${viewMode === "visitas" ? "Relatório de Visitas" : "Lista de Internos"} - UPI-4</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm 10mm 10mm 10mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      font-size: 10.5px;
      color: #111827;
      margin: 0;
      padding: 0;
    }
    .header-box {
      border-bottom: 2px solid #111827;
      padding-bottom: 6px;
      margin-bottom: 8px;
    }
    .inst-title {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #374151;
      margin: 0 0 2px 0;
    }
    .report-title {
      font-size: 15px;
      font-weight: 900;
      text-transform: uppercase;
      color: #111827;
      margin: 0 0 4px 0;
    }
    .meta-bar {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: #4b5563;
      font-weight: 600;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #111827;
    }
    thead {
      display: table-header-group;
    }
    tfoot {
      display: table-footer-group;
    }
    tr {
      page-break-inside: avoid;
    }
    th {
      background-color: #1e293b !important;
      color: #ffffff !important;
      padding: 5px 6px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      border: 1px solid #0f172a;
      letter-spacing: 0.3px;
    }
    td {
      padding: 4px 6px;
      border: 1px solid #cbd5e1;
      vertical-align: middle;
      font-size: 10px;
    }
    tr:nth-child(even) td {
      background-color: #f8fafc;
    }
    .footer-sign {
      margin-top: 18px;
      display: flex;
      justify-content: space-between;
      page-break-inside: avoid;
      padding-top: 10px;
    }
    .sign-line {
      width: 45%;
      border-top: 1px solid #111827;
      text-align: center;
      font-size: 9.5px;
      padding-top: 4px;
      font-weight: 600;
      color: #374151;
    }
  </style>
</head>
<body>
  <div class="header-box">
    <div class="inst-title">Secretaria da Administração Penitenciária • Unidade Prisional UPI-4</div>
    <div class="report-title">${viewMode === "visitas" ? "Relatório Oficial de Visitas" : "Relação Oficial de Custodiados"}</div>
    <div class="meta-bar">
      <span><strong>Emissão:</strong> ${dataAtual}</span>
      <span><strong>Total de Registros:</strong> ${rows.length}</span>
      <span><strong>Documento Operacional Oficial</strong></span>
    </div>
  </div>

  <table>
    <thead>
      <tr>${headers}</tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>

  <div class="footer-sign">
    <div class="sign-line">Responsável pela Emissão / Conferência</div>
    <div class="sign-line">Chefe de Equipe / Plantão Operacional</div>
  </div>
</body>
</html>`

  const win = window.open("", "_blank")
  if (!win) {
    toast.error("Pop-up bloqueado pelo navegador. Por favor, autorize os pop-ups para imprimir o relatório completo.")
    return
  }
  win.document.write(html)
  win.document.close()
  win.focus()
  setTimeout(() => {
    win.print()
  }, 400)
}
