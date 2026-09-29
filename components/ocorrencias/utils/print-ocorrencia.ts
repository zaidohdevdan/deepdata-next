import { toast } from "sonner"

interface OcorrenciaData {
  titulo: string
  categoria: string
  texto: string
  servidor: string
  createdAt?: string | Date
}

export function handlePrintOcorrencia(oc: OcorrenciaData, nomeUnidade = "UPI-4", localidade = "Itaitinga") {
  const dataFormatada = oc.createdAt
    ? new Date(oc.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleDateString("pt-BR", {
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
  <title>Ocorrência - ${oc.titulo}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 12mm 10mm 12mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 11px;
      color: #0f172a;
      margin: 0;
      padding: 0;
      line-height: 1.5;
    }
    .inst-header {
      border-bottom: 2px solid #000000;
      padding-bottom: 6px;
      margin-bottom: 12px;
      text-align: center;
    }
    .inst-header h2 {
      font-size: 11.5px;
      font-weight: 800;
      margin: 0 0 2px 0;
      text-transform: uppercase;
      color: #1e293b;
    }
    .inst-header h1 {
      font-size: 16px;
      font-weight: 900;
      margin: 0;
      text-transform: uppercase;
      color: #000000;
      letter-spacing: 0.5px;
    }
    .meta-box {
      border: 1.5px solid #000000;
      background-color: #f8fafc;
      padding: 8px 12px;
      margin-bottom: 14px;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 6px;
      font-size: 10.5px;
    }
    .meta-item strong {
      text-transform: uppercase;
      color: #334155;
    }
    .section-title {
      font-size: 11.5px;
      font-weight: 800;
      text-transform: uppercase;
      border-left: 3px solid #000000;
      padding-left: 6px;
      margin: 14px 0 8px 0;
      color: #000000;
    }
    .content-box {
      border: 1px solid #94a3b8;
      padding: 14px 16px;
      background-color: #ffffff;
      min-height: 280px;
      font-size: 11.5px;
      white-space: pre-wrap;
      text-align: justify;
      color: #0f172a;
      line-height: 1.6;
    }
    .signatures {
      margin-top: 40px;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 30px;
      page-break-inside: avoid;
    }
    .signature-card {
      text-align: center;
    }
    .signature-line {
      border-top: 1.5px solid #000000;
      margin-top: 35px;
      padding-top: 4px;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      color: #000000;
    }
    .signature-sub {
      font-size: 9px;
      color: #475569;
    }
  </style>
</head>
<body>
  <div class="inst-header">
    <h2>Governo do Estado do Ceará • Secretaria da Administração Penitenciária</h2>
    <h1>Relatório Oficial de Ocorrência Prisional</h1>
    <div style="font-size: 10px; color: #475569; margin-top: 3px; font-weight: 600;">
      ${nomeUnidade} (${localidade}) — Livro de Registro Operacional
    </div>
  </div>

  <div class="meta-box">
    <div class="meta-item"><strong>Título:</strong> ${oc.titulo}</div>
    <div class="meta-item"><strong>Categoria:</strong> ${oc.categoria}</div>
    <div class="meta-item"><strong>Servidor Relator:</strong> ${oc.servidor}</div>
    <div class="meta-item"><strong>Data / Horário do Registro:</strong> ${dataFormatada}</div>
  </div>

  <div class="section-title">Histórico / Relato Circunstanciado dos Fatos</div>
  <div class="content-box">${oc.texto}</div>

  <div class="signatures">
    <div class="signature-card">
      <div class="signature-line">${oc.servidor || "Servidor Responsável"}</div>
      <div class="signature-sub">Policial Penal Relator</div>
    </div>
    <div class="signature-card">
      <div class="signature-line">Chefe de Equipe de Plantão</div>
      <div class="signature-sub">Visto e Encaminhamento Operacional</div>
    </div>
  </div>
</body>
</html>`

  const win = window.open("", "_blank")
  if (!win) {
    toast.error("Pop-up bloqueado pelo navegador. Permita pop-ups para imprimir a ocorrência.")
    return
  }
  win.document.write(html)
  win.document.close()
  win.focus()
  setTimeout(() => win.print(), 350)
}
