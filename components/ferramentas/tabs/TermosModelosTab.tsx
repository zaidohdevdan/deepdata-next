"use client"

import { useState, useRef, useEffect } from "react"
import {
  FileText,
  Download,
  Copy,
  Printer,
  QrCode,
  Building2,
  Shield,
  Upload,
  X,
  ImageIcon,
  Hash,
  RotateCcw,
} from "lucide-react"
import { toast } from "sonner"
import { createDocxFromText } from "../utils/docxUtils"
import { printHtmlAsPdf } from "../utils/pdfHelper"

import { CEARA_BRASAO_BASE64 } from "../utils/cearaLogo"

type ModelType = "APREENSAO" | "CFD" | "DECLARACAO" | "ESCOLTA"

// ---------------------------------------------------------------------------
// Brasão e Logo Oficial do Governo do Estado do Ceará
// ---------------------------------------------------------------------------
const CEARA_LOGO_DEFAULT = CEARA_BRASAO_BASE64


export interface SignatureItem {
  name: string
  role: string
  detail?: string
  extraDetail?: string
}

// ---------------------------------------------------------------------------
// Gera o HTML completo do documento com timbrado aprimorado
// ---------------------------------------------------------------------------
function buildTimbrardoPdfHtml({
  title,
  paragraphs,
  signatureRows = [],
  logoSrc,
  estadoUnidade,
  orgaoSuperior,
  nomeUnidade,
  siglaUnidade,
  enderecoUnidade,
  dataFmt,
  numeroDoc,
}: {
  title: string
  paragraphs: string[]
  signatureRows?: SignatureItem[][]
  logoSrc: string
  estadoUnidade: string
  orgaoSuperior: string
  nomeUnidade: string
  siglaUnidade: string
  enderecoUnidade: string
  dataFmt: string
  numeroDoc: string
}) {
  let rowsToRender = signatureRows
  let bodyLines = paragraphs

  // Fallback se signatureRows não for fornecido mas parágrafos contiverem "_____"
  if (!rowsToRender.length) {
    const rawSigLines = paragraphs.filter((p) => p.startsWith("_____"))
    bodyLines = paragraphs.filter((p) => !p.startsWith("_____"))
    if (rawSigLines.length) {
      rowsToRender = [
        rawSigLines.map((s) => {
          const clean = s.replace(/^_+[\r\n]*/, "").trim()
          const parts = clean.split("\n")
          return {
            name: (parts[0] || "ASSINATURA").toUpperCase(),
            role: parts[1] || "",
            detail: parts.slice(2).join(" • "),
          }
        }),
      ]
    }
  }

  const signaturesHtml = rowsToRender.length
    ? `
      <div class="sig-container">
        ${rowsToRender
          .map(
            (row) => `
          <div class="sig-row ${row.length === 1 ? "sig-row-single" : "sig-row-multi"}">
            ${row
              .map(
                (sig) => `
              <div class="sig-box">
                <div class="sig-space"></div>
                <div class="sig-line"></div>
                <div class="sig-name">${sig.name}</div>
                <div class="sig-role">${sig.role}</div>
                ${sig.detail ? `<div class="sig-detail">${sig.detail}</div>` : ""}
                ${sig.extraDetail ? `<div class="sig-extra">${sig.extraDetail}</div>` : ""}
              </div>`
              )
              .join("")}
          </div>`
          )
          .join("")}
      </div>
    `
    : ""

  const protocolo = numeroDoc
    ? `<div class="protocolo">N° ${numeroDoc}</div>`
    : ""

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;
      color: #1e293b;
      background: white;
      font-size: 10.5pt;
      line-height: 1.6;
      padding: 14mm 18mm 26mm 18mm;
      min-height: 297mm;
    }

    /* ---- CABEÇALHO TIMBRADO ---- */
    .timbrado-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 10px;
      gap: 10px;
    }
    .timbrado-logo {
      height: 72px;
      width: auto;
      object-fit: contain;
      flex-shrink: 0;
    }
    .timbrado-info {
      flex: 1;
      text-align: center;
      line-height: 1.3;
    }
    .timbrado-estado {
      font-size: 19pt;
      font-weight: 900;
      color: #007A5E;
      letter-spacing: 4px;
      text-transform: uppercase;
    }
    .timbrado-orgao {
      font-size: 8pt;
      color: #374151;
      font-weight: 700;
      letter-spacing: 1.5px;
      margin-top: 2px;
    }
    .timbrado-unidade {
      font-size: 7.5pt;
      color: #007A5E;
      font-weight: 600;
      margin-top: 3px;
    }
    .timbrado-meta {
      text-align: right;
      font-size: 7.5pt;
      color: #64748b;
      line-height: 1.6;
      flex-shrink: 0;
    }
    .timbrado-line {
      border: none;
      border-top: 2.5px solid #007A5E;
      margin: 8px 0 16px 0;
    }

    /* ---- TÍTULO DO DOCUMENTO ---- */
    .protocolo {
      text-align: right;
      font-size: 7.5pt;
      color: #64748b;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .doc-title {
      font-size: 12.5pt;
      font-weight: 800;
      color: #1e3a8a;
      text-transform: uppercase;
      text-align: center;
      letter-spacing: 1.2px;
      margin-bottom: 18px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e2e8f0;
    }

    /* ---- CORPO ---- */
    .doc-body p {
      margin-bottom: 12px;
      text-align: justify;
      line-height: 1.75;
      white-space: pre-line;
    }

    /* ---- ASSINATURAS PADRÃO OFICIAL ---- */
    .sig-container {
      margin-top: 36px;
      margin-bottom: 20px;
      page-break-inside: avoid;
      break-inside: avoid;
      display: flex;
      flex-direction: column;
      gap: 26px;
    }
    .sig-row {
      display: flex;
      width: 100%;
      align-items: flex-start;
    }
    .sig-row-single {
      justify-content: center;
    }
    .sig-row-multi {
      justify-content: space-around;
      gap: 28px;
    }
    .sig-box {
      width: 270px;
      max-width: 290px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .sig-space {
      height: 36px;
    }
    .sig-line {
      width: 240px;
      border-top: 1.2px solid #0f172a;
      margin-bottom: 6px;
    }
    .sig-name {
      font-size: 8.5pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: 0.5px;
      line-height: 1.35;
      text-transform: uppercase;
    }
    .sig-role {
      font-size: 8pt;
      font-weight: 600;
      color: #334155;
      margin-top: 2px;
      line-height: 1.3;
    }
    .sig-detail {
      font-size: 7.5pt;
      color: #64748b;
      margin-top: 2px;
      line-height: 1.3;
    }
    .sig-extra {
      font-size: 7.5pt;
      color: #64748b;
      margin-top: 2px;
      line-height: 1.3;
    }

    /* ---- RODAPÉ ---- */
    .timbrado-footer {
      position: fixed;
      bottom: 12mm;
      left: 18mm;
      right: 18mm;
    }
    .timbrado-footer-text {
      display: flex;
      justify-content: space-between;
      font-size: 7pt;
      color: #9ca3af;
      padding-bottom: 5px;
      border-bottom: 1px solid #e5e7eb;
      margin-bottom: 4px;
    }
    .timbrado-color-bar {
      display: flex;
      height: 6px;
      width: 100%;
      border-radius: 2px;
      overflow: hidden;
    }
    .bar-seg { flex: 1; }
    .seg-green  { background: #007A5E; }
    .seg-yellow { background: #F5A623; }
    .seg-orange { background: #F4511E; }
    .seg-red    { background: #E53935; }
    .seg-teal   { background: #0097A7; }

    /* ---- BARRA FIXA NO FIM DA PÁGINA ---- */
    .page-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 8px;
      display: flex;
    }
    .page-bar .bar-seg { flex: 1; }

    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <!-- CABEÇALHO TIMBRADO -->
  <div class="timbrado-header">
    <img src="${logoSrc}" alt="Logo Governo" class="timbrado-logo" />
    <div class="timbrado-info">
      <div class="timbrado-estado">${estadoUnidade.replace(/^Estado d[oa] /i, "Estado do ")}</div>
      <div class="timbrado-orgao">${orgaoSuperior}</div>
      <div class="timbrado-unidade">${nomeUnidade} — ${siglaUnidade}</div>
    </div>
    <div class="timbrado-meta">
      Data: ${dataFmt}<br>
      ${numeroDoc ? `N° ${numeroDoc}` : ""}
    </div>
  </div>
  <hr class="timbrado-line">

  <!-- TÍTULO -->
  ${protocolo}
  <div class="doc-title">${title}</div>

  <!-- CORPO -->
  <div class="doc-body">
    ${bodyLines
      .map((p) => `<p>${p}</p>`)
      .join("\n    ")}
  </div>

  <!-- ASSINATURAS -->
  ${signaturesHtml}

  <!-- RODAPÉ FIXO -->
  <div class="timbrado-footer">
    <div class="timbrado-footer-text">
      <span>${nomeUnidade} — ${enderecoUnidade}</span>
      <span>${siglaUnidade} • ${estadoUnidade}</span>
    </div>
    <div class="timbrado-color-bar">
      <div class="bar-seg seg-green"></div>
      <div class="bar-seg seg-yellow"></div>
      <div class="bar-seg seg-orange"></div>
      <div class="bar-seg seg-red"></div>
      <div class="bar-seg seg-teal"></div>
    </div>
  </div>

  <!-- BARRA COLORIDA NO FUNDO DA PÁGINA -->
  <div class="page-bar">
    <div class="bar-seg seg-green"></div>
    <div class="bar-seg seg-yellow"></div>
    <div class="bar-seg seg-orange"></div>
    <div class="bar-seg seg-red"></div>
    <div class="bar-seg seg-teal"></div>
  </div>
</body>
</html>`
}

// ---------------------------------------------------------------------------
// Abre o HTML do timbrado em iframe invisível e aciona o print
// ---------------------------------------------------------------------------
function printTimbradoHtml(html: string) {
  const iframe = document.createElement("iframe")
  iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:none;visibility:hidden;"
  document.body.appendChild(iframe)
  const doc = iframe.contentWindow?.document
  if (!doc) return
  doc.open()
  doc.write(html)
  doc.close()
  iframe.contentWindow?.focus()
  setTimeout(() => {
    iframe.contentWindow?.print()
    setTimeout(() => document.body.removeChild(iframe), 1500)
  }, 600)
}

// ===========================================================================
// COMPONENTE
// ===========================================================================
export function TermosModelosTab() {
  const [subTab, setSubTab] = useState<"MODELOS" | "CARIMBO_QR">("MODELOS")

  // =========================================================================
  // 0. IDENTIFICAÇÃO DA UNIDADE
  // =========================================================================
  const [nomeUnidade, setNomeUnidade] = useState("Unidade Prisional de Itapejara d'Oeste")
  const [siglaUnidade, setSiglaUnidade] = useState("UPI-4")
  const [estadoUnidade, setEstadoUnidade] = useState("Estado do Ceará")
  const [orgaoSuperior, setOrgaoSuperior] = useState("SAP - Secretaria da Administração Penitenciária")
  const [localOitiva, setLocalOitiva] = useState("sala da Chefia de Segurança")
  const [enderecoUnidade, setEnderecoUnidade] = useState("Rua Principal, s/n – CEP 00000-000")

  // =========================================================================
  // TIMBRADO
  // =========================================================================
  const [useTimbrado, setUseTimbrado] = useState(true)
  const [logoSrc, setLogoSrc] = useState<string>(CEARA_LOGO_DEFAULT)
  const logoInputRef = useRef<HTMLInputElement>(null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem.")
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setLogoSrc(ev.target.result as string)
        toast.success("Logo atualizada!")
      }
    }
    reader.readAsDataURL(file)
  }

  const handleResetLogo = () => {
    setLogoSrc(CEARA_LOGO_DEFAULT)
    if (logoInputRef.current) logoInputRef.current.value = ""
    toast.info("Logo restaurada para o padrão Ceará.")
  }

  // =========================================================================
  // 1. MODELOS DE TERMOS
  // =========================================================================
  const [selectedModel, setSelectedModel] = useState<ModelType>("APREENSAO")
  const [nomePolicial, setNomePolicial] = useState("POLICIAL RESPONSÁVEL")
  const [matriculaPolicial, setMatriculaPolicial] = useState("123.456-7")
  const [nomeInterno, setNomeInterno] = useState("")
  const [prontuario, setProntuario] = useState("")
  const [alaCela, setAlaCela] = useState("Ala A - Cela 02")
  const [dataTermo, setDataTermo] = useState(() => new Date().toISOString().slice(0, 10))
  const [numeroDoc, setNumeroDoc] = useState("")
  const [itensApreendidos, setItensApreendidos] = useState(
    "01 (um) aparelho celular marca Samsung cor preta;\n01 (um) carregador artesanal com fita isolante."
  )
  const [numeroLacre, setNumeroLacre] = useState("LACRE-009842")
  const [relatoFatos, setRelatoFatos] = useState(
    "Durante procedimento de revista estrutural ordinária, foi localizado no interior da cela o material acima discriminado."
  )
  const [destinoEscolta, setDestinoEscolta] = useState("UPA Municipal / Hospital Regional")

  // Testemunhas opcionais para termos de apreensão
  const [testemunha1Nome, setTestemunha1Nome] = useState("")
  const [testemunha1Matricula, setTestemunha1Matricula] = useState("")
  const [testemunha2Nome, setTestemunha2Nome] = useState("")
  const [testemunha2Matricula, setTestemunha2Matricula] = useState("")

  // =========================================================================
  // 2. CARIMBO & QR CODE
  // =========================================================================
  const [carimboUnidade, setCarimboUnidade] = useState("UNIDADE PRISIONAL DE ITAPEJARA D'OESTE - UPI-4")
  const [carimboServidor, setCarimboServidor] = useState("AGENTE DE SEGURANÇA PENITENCIÁRIA")
  const [carimboMatricula, setCarimboMatricula] = useState("987.654-3")
  const [carimboCargo, setCarimboCargo] = useState("CHEFE DE EQUIPE • PLANTÃO")
  const [codigoAutenticidade, setCodigoAutenticidade] = useState("UPI4-DOC-2026-X89B")

  // =========================================================================
  // PERSISTÊNCIA AUTOMÁTICA EM LOCALSTORAGE
  // =========================================================================
  const STORAGE_KEY = "deepdata_termos_modelos_data"
  const [isLoaded, setIsLoaded] = useState(false)

  // Carrega configurações e campos salvos
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const d = JSON.parse(saved)
          if (d.nomeUnidade !== undefined) setNomeUnidade(d.nomeUnidade)
          if (d.siglaUnidade !== undefined) setSiglaUnidade(d.siglaUnidade)
          if (d.estadoUnidade !== undefined) setEstadoUnidade(d.estadoUnidade)
          if (d.orgaoSuperior !== undefined) setOrgaoSuperior(d.orgaoSuperior)
          if (d.localOitiva !== undefined) setLocalOitiva(d.localOitiva)
          if (d.enderecoUnidade !== undefined) setEnderecoUnidade(d.enderecoUnidade)
          if (d.useTimbrado !== undefined) setUseTimbrado(d.useTimbrado)
          if (d.logoSrc !== undefined) setLogoSrc(d.logoSrc)
          if (d.selectedModel !== undefined) setSelectedModel(d.selectedModel)
          if (d.nomePolicial !== undefined) setNomePolicial(d.nomePolicial)
          if (d.matriculaPolicial !== undefined) setMatriculaPolicial(d.matriculaPolicial)
          if (d.nomeInterno !== undefined) setNomeInterno(d.nomeInterno)
          if (d.prontuario !== undefined) setProntuario(d.prontuario)
          if (d.alaCela !== undefined) setAlaCela(d.alaCela)
          if (d.dataTermo !== undefined) setDataTermo(d.dataTermo)
          if (d.numeroDoc !== undefined) setNumeroDoc(d.numeroDoc)
          if (d.itensApreendidos !== undefined) setItensApreendidos(d.itensApreendidos)
          if (d.numeroLacre !== undefined) setNumeroLacre(d.numeroLacre)
          if (d.relatoFatos !== undefined) setRelatoFatos(d.relatoFatos)
          if (d.destinoEscolta !== undefined) setDestinoEscolta(d.destinoEscolta)
          if (d.testemunha1Nome !== undefined) setTestemunha1Nome(d.testemunha1Nome)
          if (d.testemunha1Matricula !== undefined) setTestemunha1Matricula(d.testemunha1Matricula)
          if (d.testemunha2Nome !== undefined) setTestemunha2Nome(d.testemunha2Nome)
          if (d.testemunha2Matricula !== undefined) setTestemunha2Matricula(d.testemunha2Matricula)
          if (d.carimboUnidade !== undefined) setCarimboUnidade(d.carimboUnidade)
          if (d.carimboServidor !== undefined) setCarimboServidor(d.carimboServidor)
          if (d.carimboMatricula !== undefined) setCarimboMatricula(d.carimboMatricula)
          if (d.carimboCargo !== undefined) setCarimboCargo(d.carimboCargo)
          if (d.codigoAutenticidade !== undefined) setCodigoAutenticidade(d.codigoAutenticidade)
        }
      } catch (err) {
        console.error("Erro ao carregar do localStorage:", err)
      }
      setIsLoaded(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  // Salva no localStorage a cada alteração
  useEffect(() => {
    if (!isLoaded) return
    try {
      const dataToSave = {
        nomeUnidade,
        siglaUnidade,
        estadoUnidade,
        orgaoSuperior,
        localOitiva,
        enderecoUnidade,
        useTimbrado,
        logoSrc,
        selectedModel,
        nomePolicial,
        matriculaPolicial,
        nomeInterno,
        prontuario,
        alaCela,
        dataTermo,
        numeroDoc,
        itensApreendidos,
        numeroLacre,
        relatoFatos,
        destinoEscolta,
        testemunha1Nome,
        testemunha1Matricula,
        testemunha2Nome,
        testemunha2Matricula,
        carimboUnidade,
        carimboServidor,
        carimboMatricula,
        carimboCargo,
        codigoAutenticidade,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
    } catch (err) {
      console.error("Erro ao salvar no localStorage:", err)
    }
  }, [
    isLoaded,
    nomeUnidade,
    siglaUnidade,
    estadoUnidade,
    orgaoSuperior,
    localOitiva,
    enderecoUnidade,
    useTimbrado,
    logoSrc,
    selectedModel,
    nomePolicial,
    matriculaPolicial,
    nomeInterno,
    prontuario,
    alaCela,
    dataTermo,
    numeroDoc,
    itensApreendidos,
    numeroLacre,
    relatoFatos,
    destinoEscolta,
    testemunha1Nome,
    testemunha1Matricula,
    testemunha2Nome,
    testemunha2Matricula,
    carimboUnidade,
    carimboServidor,
    carimboMatricula,
    carimboCargo,
    codigoAutenticidade,
  ])

  const handleResetToDefaults = () => {
    if (confirm("Deseja restaurar todos os campos para os valores padrão?")) {
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch {}
      setNomeUnidade("Unidade Prisional de Itapejara d'Oeste")
      setSiglaUnidade("UPI-4")
      setEstadoUnidade("Estado do Ceará")
      setOrgaoSuperior("SAP - Secretaria da Administração Penitenciária")
      setLocalOitiva("sala da Chefia de Segurança")
      setEnderecoUnidade("Rua Principal, s/n – CEP 00000-000")
      setUseTimbrado(true)
      setLogoSrc(CEARA_LOGO_DEFAULT)
      setNomePolicial("POLICIAL RESPONSÁVEL")
      setMatriculaPolicial("123.456-7")
      setNomeInterno("")
      setProntuario("")
      setAlaCela("Ala A - Cela 02")
      setDataTermo(new Date().toISOString().slice(0, 10))
      setNumeroDoc("")
      setItensApreendidos(
        "01 (um) aparelho celular marca Samsung cor preta;\n01 (um) carregador artesanal com fita isolante."
      )
      setNumeroLacre("LACRE-009842")
      setRelatoFatos(
        "Durante procedimento de revista estrutural ordinária, foi localizado no interior da cela o material acima discriminado."
      )
      setDestinoEscolta("UPA Municipal / Hospital Regional")
      setTestemunha1Nome("")
      setTestemunha1Matricula("")
      setTestemunha2Nome("")
      setTestemunha2Matricula("")
      setCarimboUnidade("UNIDADE PRISIONAL DE ITAPEJARA D'OESTE - UPI-4")
      setCarimboServidor("AGENTE DE SEGURANÇA PENITENCIÁRIA")
      setCarimboMatricula("987.654-3")
      setCarimboCargo("CHEFE DE EQUIPE • PLANTÃO")
      setCodigoAutenticidade("UPI4-DOC-2026-X89B")
      toast.success("Campos restaurados para os padrões!")
    }
  }

  // -------------------------------------------------------------------------
  const getModelData = () => {
    const dataFmt = new Date(dataTermo + "T00:00:00").toLocaleDateString("pt-BR")
    switch (selectedModel) {
      case "APREENSAO":
        return {
          title: "TERMO DE APREENSÃO E DEPÓSITO DE OBJETOS",
          paragraphs: [
            `Aos ${dataFmt}, nas dependências da ${nomeUnidade} (${siglaUnidade}), foi efetuada a apreensão dos seguintes materiais e objetos proibidos:`,
            `OBJETOS APREENDIDOS:\n${itensApreendidos}`,
            `NÚMERO DO LACRE OFICIAL: ${numeroLacre}`,
            `LOCAL DA APREENSÃO: ${alaCela}`,
            `CUSTODIADO(A) VINCULADO(A): ${nomeInterno || "Não identificado / Posse coletiva"} (Prontuário: ${prontuario || "—"})`,
            `CIRCUNSTÂNCIAS: ${relatoFatos}`,
            `O material foi devidamente lacrado na presença das testemunhas abaixo e encaminhado à Direção / Setor de Segurança para providências de custódia e remessa à autoridade policial competente.`,
          ],
          signatureRows: [
            [
              {
                name: (nomePolicial || "POLICIAL RESPONSÁVEL").toUpperCase(),
                role: "Servidor Responsável pela Apreensão",
                detail: `Matrícula: ${matriculaPolicial}`,
              },
            ],
            [
              {
                name: "1ª TESTEMUNHA",
                role: testemunha1Nome ? testemunha1Nome.toUpperCase() : "Testemunha Presencial",
                detail: testemunha1Matricula
                  ? `Matrícula: ${testemunha1Matricula}`
                  : "Nome: _________________________________",
                extraDetail: testemunha1Matricula ? "" : "Matrícula / RG: ________________________",
              },
              {
                name: "2ª TESTEMUNHA",
                role: testemunha2Nome ? testemunha2Nome.toUpperCase() : "Testemunha Presencial",
                detail: testemunha2Matricula
                  ? `Matrícula: ${testemunha2Matricula}`
                  : "Nome: _________________________________",
                extraDetail: testemunha2Matricula ? "" : "Matrícula / RG: ________________________",
              },
            ],
          ] as SignatureItem[][],
        }
      case "CFD":
        return {
          title: "COMUNICAÇÃO DE FALTA DISCIPLINAR (CFD)",
          paragraphs: [
            `ILMO. SR. DIRETOR DA ${nomeUnidade.toUpperCase()} (${siglaUnidade})`,
            `Venho, por meio deste, comunicar que o(a) custodiado(a) ${nomeInterno || "[NOME DO INTERNO]"}, Prontuário nº ${prontuario || "[PRONTUÁRIO]"}, alojado(a) na ${alaCela}, cometeu ato contrário à disciplina prisional na data de ${dataFmt}.`,
            `HISTÓRICO DOS FATOS:\n${relatoFatos}`,
            `TIPIFICAÇÃO PRELIMINAR:\nConduta com previsão no Regimento Disciplinar e na Lei de Execução Penal (LEP). Solicita-se a instauração de Procedimento Administrativo Disciplinar (PAD).`,
            `Nestes termos, submeto o presente comunicado para as providências cabíveis.`,
          ],
          signatureRows: [
            [
              {
                name: (nomePolicial || "POLICIAL RESPONSÁVEL").toUpperCase(),
                role: "Servidor Comunicante • Policial Penal",
                detail: `Matrícula: ${matriculaPolicial}`,
              },
            ],
          ] as SignatureItem[][],
        }
      case "DECLARACAO":
        return {
          title: "TERMO DE DECLARAÇÃO E OITIVA",
          paragraphs: [
            `Aos ${dataFmt}, na ${localOitiva} da ${siglaUnidade}, compareceu perante o servidor ${nomePolicial}, matrícula ${matriculaPolicial}, a pessoa de:`,
            `DECLARANTE: ${nomeInterno || "[NOME COMPLETO]"}, Prontuário: ${prontuario || "—"}, Localização: ${alaCela}.`,
            `Inquirido(a) a respeito dos fatos ocorridos, declarou livremente o que se segue:\n"${relatoFatos}"`,
            `Nada mais havendo a declarar, foi encerrado o presente termo, o qual, lido e achado conforme, vai devidamente assinado.`,
          ],
          signatureRows: [
            [
              {
                name: (nomeInterno || "DECLARANTE").toUpperCase(),
                role: "Declarante",
                detail: prontuario ? `Prontuário: ${prontuario}` : "RG / CPF: ________________________",
              },
              {
                name: (nomePolicial || "POLICIAL RESPONSÁVEL").toUpperCase(),
                role: "Servidor Responsável pela Oitiva",
                detail: `Matrícula: ${matriculaPolicial}`,
              },
            ],
          ] as SignatureItem[][],
        }
      case "ESCOLTA":
        return {
          title: "GUIA DE MOVIMENTAÇÃO E ESCOLTA EXTERNA",
          paragraphs: [
            `AUTORIZAÇÃO DE DESLOCAMENTO EXTERNO • ${siglaUnidade}`,
            `CUSTODIADO(A): ${nomeInterno || "[NOME DO INTERNO]"}, Prontuário: ${prontuario || "—"}, Ala/Cela: ${alaCela}.`,
            `DESTINO DO ENCAMINHAMENTO: ${destinoEscolta}`,
            `MOTIVO: Atendimento de Urgência / Emergência / Especialidade Médica / Consulta Externa.`,
            `DATA DO DESLOCAMENTO: ${dataFmt}`,
            `OBSERVAÇÕES DE SEGURANÇA:\n${relatoFatos}`,
            `EQUIPE DE ESCOLTA DESIGNADA:\n1. ${nomePolicial} (Matrícula: ${matriculaPolicial})\n2. Policial Penal 2 (Matrícula: ____________)\n3. Motorista Operacional (Matrícula: ____________)`,
          ],
          signatureRows: [
            [
              {
                name: "CHEFIA DE PLANTÃO / DIREÇÃO",
                role: `${nomeUnidade} (${siglaUnidade})`,
                detail: "Secretaria da Administração Penitenciária",
              },
            ],
          ] as SignatureItem[][],
        }
    }
  }

  const handleDownloadModelDocx = async () => {
    const { title, paragraphs, signatureRows } = getModelData()
    try {
      const docxParagraphs = [
        ...paragraphs,
        "",
        ...signatureRows.flatMap((row) =>
          row.map(
            (sig) =>
              `_________________________________________\n${sig.name}\n${sig.role}${sig.detail ? `\n${sig.detail}` : ""}${sig.extraDetail ? `\n${sig.extraDetail}` : ""}`
          )
        ),
      ]
      const docxBytes = await createDocxFromText(title, docxParagraphs, {
        unidade: `${orgaoSuperior} • ${siglaUnidade}`,
      })
      const blob = new Blob([docxBytes.buffer as ArrayBuffer], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, "_")}.docx`
      a.click()
      toast.success("Documento Word (.docx) baixado!")
    } catch {
      toast.error("Erro ao gerar arquivo Word.")
    }
  }

  const handlePrintModelPdf = () => {
    const { title, paragraphs, signatureRows } = getModelData()
    const dataFmt = new Date(dataTermo + "T00:00:00").toLocaleDateString("pt-BR")

    if (!useTimbrado) {
      const plainBody = `
        <div class="header">
          <div>
            <h1>${title}</h1>
            <p>${estadoUnidade} • ${orgaoSuperior} • ${siglaUnidade}</p>
          </div>
          <div style="text-align:right;font-size:8pt;color:#64748b;">Data: ${dataFmt}</div>
        </div>
        <div>
          ${paragraphs
            .map((p) => `<p style="margin-bottom:14px;text-align:justify;line-height:1.7;white-space:pre-line;">${p}</p>`)
            .join("")}
        </div>
        <div style="margin-top:35px;display:flex;flex-direction:column;gap:26px;">
          ${signatureRows
            .map(
              (row) => `
            <div style="display:flex;justify-content:${row.length === 1 ? "center" : "space-around"};gap:20px;">
              ${row
                .map(
                  (sig) => `
                <div style="width:260px;text-align:center;">
                  <div style="height:35px;"></div>
                  <div style="border-top:1.2px solid #333;margin-bottom:6px;"></div>
                  <div style="font-weight:bold;font-size:8.5pt;">${sig.name}</div>
                  <div style="font-size:8pt;color:#333;">${sig.role}</div>
                  ${sig.detail ? `<div style="font-size:7.5pt;color:#666;">${sig.detail}</div>` : ""}
                  ${sig.extraDetail ? `<div style="font-size:7.5pt;color:#666;">${sig.extraDetail}</div>` : ""}
                </div>`
                )
                .join("")}
            </div>`
            )
            .join("")}
        </div>
        <div class="footer">
          <span>Sistema de Gestão Penitenciária — ${siglaUnidade}</span>
          <span>Autenticação Oficial ${siglaUnidade}</span>
        </div>`
      printHtmlAsPdf(title, plainBody)
      return
    }

    const html = buildTimbrardoPdfHtml({
      title,
      paragraphs,
      signatureRows,
      logoSrc,
      estadoUnidade,
      orgaoSuperior,
      nomeUnidade,
      siglaUnidade,
      enderecoUnidade,
      dataFmt,
      numeroDoc,
    })
    printTimbradoHtml(html)
  }

  const handleCopyCarimbo = () => {
    const text = `=========================================\n${carimboUnidade}\nRESPONSÁVEL: ${carimboServidor}\nMATRÍCULA: ${carimboMatricula}\nFUNÇÃO: ${carimboCargo}\nDATA/HORA: ${new Date().toLocaleString("pt-BR")}\nCÓD. AUTENTICIDADE: ${codigoAutenticidade}\n=========================================`
    navigator.clipboard.writeText(text)
    toast.success("Carimbo copiado!")
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Submenu */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/80 w-fit">
        <button
          type="button"
          onClick={() => setSubTab("MODELOS")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
            subTab === "MODELOS"
              ? "bg-white text-blue-600 shadow-sm shadow-blue-500/10 border border-slate-200/60"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FileText size={15} />
          <span>Modelos e Termos Prontos</span>
        </button>
        <button
          type="button"
          onClick={() => setSubTab("CARIMBO_QR")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
            subTab === "CARIMBO_QR"
              ? "bg-white text-blue-600 shadow-sm shadow-blue-500/10 border border-slate-200/60"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <QrCode size={15} />
          <span>Carimbo Operacional &amp; Autenticador</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* 1. MODELOS DE TERMOS                                                  */}
      {/* ===================================================================== */}
      {subTab === "MODELOS" && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] space-y-6">
          {/* Header actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-800">
                Gerador de Termos Oficiais e Comunicações de Plantão
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Preencha os dados, ative o papel timbrado e gere em Word (.docx) ou PDF.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Salvo automaticamente</span>
              </div>
              <button
                type="button"
                onClick={handleResetToDefaults}
                title="Restaurar valores padrão originais"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-full transition cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Padrões</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadModelDocx}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-extrabold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-full transition cursor-pointer"
              >
                <Download size={14} />
                <span>Baixar Word (.docx)</span>
              </button>
              <button
                type="button"
                onClick={handlePrintModelPdf}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md shadow-blue-600/20 transition cursor-pointer"
              >
                <Printer size={14} />
                <span>Gerar PDF / Imprimir</span>
              </button>
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* SEÇÃO TIMBRADO                                                    */}
          {/* ----------------------------------------------------------------- */}
          <div
            className={`rounded-2xl border p-4 space-y-4 transition-all ${
              useTimbrado
                ? "border-emerald-300 bg-emerald-50/50"
                : "border-slate-200/80 bg-slate-50/60"
            }`}
          >
            {/* Toggle header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Shield size={15} className={useTimbrado ? "text-emerald-700" : "text-slate-400"} />
                <div>
                  <p className={`text-xs font-extrabold uppercase tracking-wide ${useTimbrado ? "text-emerald-800" : "text-slate-600"}`}>
                    Papel Timbrado Oficial
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Ativa logo + tipografia Montserrat + barra colorida no PDF
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUseTimbrado((v) => !v)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  useTimbrado ? "bg-emerald-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    useTimbrado ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {useTimbrado && (
              <>
                {/* Preview do timbrado aprimorado */}
                <div className="rounded-xl border border-emerald-200 bg-white overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logoSrc} alt="Logo" className="h-12 object-contain flex-shrink-0" />
                    <div className="flex-1 text-center px-3">
                      <div className="text-[11px] font-black text-emerald-800 tracking-[3px] uppercase">
                        {estadoUnidade}
                      </div>
                      <div className="text-[8.5px] font-bold text-slate-500 tracking-wider mt-0.5">
                        {orgaoSuperior}
                      </div>
                      <div className="text-[8px] text-emerald-700 font-semibold mt-0.5">
                        {nomeUnidade} — {siglaUnidade}
                      </div>
                    </div>
                    <div className="text-[7.5px] text-slate-400 whitespace-nowrap text-right">
                      Data: {new Date(dataTermo + "T00:00:00").toLocaleDateString("pt-BR")}
                      {numeroDoc && <><br />N° {numeroDoc}</>}
                    </div>
                  </div>
                  <div className="h-0.5 bg-emerald-700" />
                  {/* Placeholder de conteúdo */}
                  <div className="px-5 py-3 space-y-2">
                    <div className="h-1.5 rounded-full bg-blue-100 w-4/5 mx-auto" />
                    {[90, 70, 85, 60, 78].map((w, i) => (
                      <div key={i} className="h-1 rounded-full bg-slate-100" style={{ width: `${w}%` }} />
                    ))}
                    {/* Signature preview */}
                    <div className="mt-3 flex gap-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="flex-1">
                          <div className="h-px bg-slate-300 mb-1" />
                          <div className="h-1 bg-slate-100 rounded w-3/4" />
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Rodapé colorido */}
                  <div className="px-4 py-1.5 flex justify-between border-t border-slate-100">
                    <div className="h-1 bg-slate-100 rounded w-2/5" />
                    <div className="h-1 bg-slate-100 rounded w-1/5" />
                  </div>
                  <div className="flex h-2">
                    <div className="flex-1 bg-emerald-700" />
                    <div className="flex-1 bg-amber-400" />
                    <div className="flex-1 bg-orange-500" />
                    <div className="flex-1 bg-red-600" />
                    <div className="flex-1 bg-cyan-600" />
                  </div>
                </div>

                {/* Nota sobre timestamp do browser */}
                <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="text-amber-500 mt-0.5 flex-shrink-0">⚠</span>
                  <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
                    <strong>Dica:</strong> Para remover a data/hora que o browser adiciona automaticamente no topo do PDF,
                    no diálogo de impressão clique em <strong>&ldquo;Mais configurações&rdquo;</strong> e desative{" "}
                    <strong>&ldquo;Cabeçalhos e rodapés&rdquo;</strong>.
                  </p>
                </div>

                {/* Upload de logo */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
                    Logo da Unidade / Governo do Estado
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-extrabold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl transition cursor-pointer"
                    >
                      <Upload size={13} />
                      <span>Enviar Logo (PNG / SVG / JPG)</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResetLogo}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-white hover:bg-red-50 text-red-500 border border-red-200 rounded-xl transition cursor-pointer"
                    >
                      <X size={12} />
                      <span>Restaurar padrão</span>
                    </button>
                    <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                      <ImageIcon size={12} className="text-slate-400" />
                      <span className="text-[10px] text-slate-400 font-medium">
                        {logoSrc === CEARA_LOGO_DEFAULT ? "Padrão: Brasão do Estado do Ceará" : "Logo personalizada"}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* SEÇÃO: IDENTIFICAÇÃO DA UNIDADE                                   */}
          {/* ----------------------------------------------------------------- */}
          <div className="rounded-2xl border border-blue-200/80 bg-blue-50/40 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold text-blue-700 uppercase tracking-wide">
              <Building2 size={14} />
              <span>Identificação da Unidade — Cabeçalho do Documento</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Nome da Unidade Prisional
                </label>
                <input
                  type="text"
                  value={nomeUnidade}
                  onChange={(e) => setNomeUnidade(e.target.value)}
                  className="w-full text-xs font-bold bg-white text-slate-900 dark:text-slate-100 border border-blue-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Sigla / Código
                </label>
                <input
                  type="text"
                  value={siglaUnidade}
                  onChange={(e) => setSiglaUnidade(e.target.value)}
                  className="w-full text-xs font-bold bg-white text-slate-900 dark:text-slate-100 border border-blue-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Estado / UF
                </label>
                <input
                  type="text"
                  value={estadoUnidade}
                  onChange={(e) => setEstadoUnidade(e.target.value)}
                  className="w-full text-xs font-bold bg-white text-slate-900 dark:text-slate-100 border border-blue-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Órgão Superior / Secretaria
                </label>
                <input
                  type="text"
                  value={orgaoSuperior}
                  onChange={(e) => setOrgaoSuperior(e.target.value)}
                  className="w-full text-xs font-bold bg-white text-slate-900 dark:text-slate-100 border border-blue-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Local das Oitivas / Declarações
                </label>
                <input
                  type="text"
                  value={localOitiva}
                  onChange={(e) => setLocalOitiva(e.target.value)}
                  className="w-full text-xs font-bold bg-white text-slate-900 dark:text-slate-100 border border-blue-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Endereço (rodapé do timbrado)
                </label>
                <input
                  type="text"
                  value={enderecoUnidade}
                  onChange={(e) => setEnderecoUnidade(e.target.value)}
                  className="w-full text-xs font-bold bg-white text-slate-900 dark:text-slate-100 border border-blue-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          {/* Seleção do Tipo de Termo */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: "APREENSAO", label: "Termo de Apreensão", desc: "Objetos e ilícitos" },
              { id: "CFD", label: "Falta Disciplinar (CFD)", desc: "Comunicação para PAD" },
              { id: "DECLARACAO", label: "Termo de Oitiva", desc: "Depoimentos e declarações" },
              { id: "ESCOLTA", label: "Guia de Escolta", desc: "Movimentação hospitalar" },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedModel(m.id as ModelType)}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                  selectedModel === m.id
                    ? "bg-blue-50 border-blue-300 text-blue-900 font-bold"
                    : "bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100/80"
                }`}
              >
                <div className="text-xs font-black truncate">{m.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">{m.desc}</div>
              </button>
            ))}
          </div>

          {/* Formulário Guiado */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Nº do Documento */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Nº do Documento / Protocolo
              </label>
              <div className="relative">
                <Hash size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Ex: 2026/001423"
                  value={numeroDoc}
                  onChange={(e) => setNumeroDoc(e.target.value)}
                  className="w-full text-xs font-bold bg-slate-50 text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl pl-7 pr-3 py-2 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Servidor Responsável
              </label>
              <input
                type="text"
                value={nomePolicial}
                onChange={(e) => setNomePolicial(e.target.value)}
                className="w-full text-xs font-bold bg-slate-50 text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Matrícula
              </label>
              <input
                type="text"
                value={matriculaPolicial}
                onChange={(e) => setMatriculaPolicial(e.target.value)}
                className="w-full text-xs font-bold bg-slate-50 text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Data do Fato
              </label>
              <input
                type="date"
                value={dataTermo}
                onChange={(e) => setDataTermo(e.target.value)}
                className="w-full text-xs font-bold bg-slate-50 text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Nome do Custodiado (se houver)
              </label>
              <input
                type="text"
                placeholder="Ex: FULANO DE TAL"
                value={nomeInterno}
                onChange={(e) => setNomeInterno(e.target.value)}
                className="w-full text-xs font-bold bg-slate-50 text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Prontuário
              </label>
              <input
                type="text"
                placeholder="Ex: 10452"
                value={prontuario}
                onChange={(e) => setProntuario(e.target.value)}
                className="w-full text-xs font-bold bg-slate-50 text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Ala / Cela / Posto
              </label>
              <input
                type="text"
                value={alaCela}
                onChange={(e) => setAlaCela(e.target.value)}
                className="w-full text-xs font-bold bg-slate-50 text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>

            {selectedModel === "APREENSAO" && (
              <>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Relação de Objetos Apreendidos
                  </label>
                  <textarea
                    rows={3}
                    value={itensApreendidos}
                    onChange={(e) => setItensApreendidos(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Número do Lacre
                  </label>
                  <input
                    type="text"
                    value={numeroLacre}
                    onChange={(e) => setNumeroLacre(e.target.value)}
                    className="w-full text-xs font-bold bg-slate-50 text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500"
                  />
                </div>

                {/* Testemunhas Opcionais */}
                <div className="md:col-span-3 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 space-y-2">
                  <div className="text-[11px] font-bold text-slate-600 uppercase flex items-center justify-between">
                    <span>Testemunhas da Apreensão (Opcional)</span>
                    <span className="text-[10px] text-slate-400 font-normal normal-case">
                      Deixe em branco para assinar à mão na folha impressa
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-bold text-slate-500 uppercase">1ª Testemunha</div>
                      <input
                        type="text"
                        placeholder="Nome do Policial / Servidor"
                        value={testemunha1Nome}
                        onChange={(e) => setTestemunha1Nome(e.target.value)}
                        className="w-full text-xs font-bold bg-white text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 outline-none focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Matrícula / Cargo"
                        value={testemunha1Matricula}
                        onChange={(e) => setTestemunha1Matricula(e.target.value)}
                        className="w-full text-xs font-bold bg-white text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-bold text-slate-500 uppercase">2ª Testemunha</div>
                      <input
                        type="text"
                        placeholder="Nome do Policial / Servidor"
                        value={testemunha2Nome}
                        onChange={(e) => setTestemunha2Nome(e.target.value)}
                        className="w-full text-xs font-bold bg-white text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 outline-none focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Matrícula / Cargo"
                        value={testemunha2Matricula}
                        onChange={(e) => setTestemunha2Matricula(e.target.value)}
                        className="w-full text-xs font-bold bg-white text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {selectedModel === "ESCOLTA" && (
              <div className="md:col-span-3">
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Destino da Escolta Externa
                </label>
                <input
                  type="text"
                  value={destinoEscolta}
                  onChange={(e) => setDestinoEscolta(e.target.value)}
                  className="w-full text-xs font-bold bg-slate-50 text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>
            )}

            <div className="md:col-span-3">
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Relato Sucinto das Circunstâncias
              </label>
              <textarea
                rows={3}
                value={relatoFatos}
                onChange={(e) => setRelatoFatos(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. CARIMBO OPERACIONAL & QR CODE                                      */}
      {/* ===================================================================== */}
      {subTab === "CARIMBO_QR" && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-800">
                Autenticador Digital &amp; Carimbo Oficial com QR Code
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Gere carimbos operacionais com identificação da unidade e código de autenticidade.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyCarimbo}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md shadow-blue-600/20 transition cursor-pointer"
            >
              <Copy size={14} />
              <span>Copiar Texto do Carimbo</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Unidade Prisional (cabeçalho do carimbo)
                </label>
                <input
                  type="text"
                  value={carimboUnidade}
                  onChange={(e) => setCarimboUnidade(e.target.value)}
                  className="w-full text-xs font-bold bg-slate-50 text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Nome / Cargo</label>
                  <input type="text" value={carimboServidor} onChange={(e) => setCarimboServidor(e.target.value)} className="w-full text-xs font-bold bg-slate-50 text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl px-3 py-2" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Matrícula</label>
                  <input type="text" value={carimboMatricula} onChange={(e) => setCarimboMatricula(e.target.value)} className="w-full text-xs font-bold bg-slate-50 text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl px-3 py-2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Função no Plantão</label>
                  <input type="text" value={carimboCargo} onChange={(e) => setCarimboCargo(e.target.value)} className="w-full text-xs font-bold bg-slate-50 text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl px-3 py-2" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Código de Autenticidade</label>
                  <input type="text" value={codigoAutenticidade} onChange={(e) => setCodigoAutenticidade(e.target.value)} className="w-full text-xs font-mono font-bold bg-slate-50 text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl px-3 py-2" />
                </div>
              </div>
            </div>

            {/* Preview do Carimbo */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/40 text-center space-y-3">
              <div className="border-2 border-blue-800 rounded-xl overflow-hidden bg-white shadow-sm max-w-sm w-full">
                {/* Barra colorida topo */}
                <div className="flex h-1.5">
                  <div className="flex-1 bg-emerald-700" />
                  <div className="flex-1 bg-amber-400" />
                  <div className="flex-1 bg-orange-500" />
                  <div className="flex-1 bg-red-600" />
                  <div className="flex-1 bg-cyan-600" />
                </div>
                <div className="p-5 space-y-2">
                  <div className="border-b border-blue-200 pb-2">
                    <div className="text-[10px] font-black text-blue-900 uppercase tracking-widest">{carimboUnidade}</div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase">AUTENTICAÇÃO E VALIDAÇÃO DE PLANTÃO</div>
                  </div>
                  <div className="py-1 space-y-0.5 text-xs text-slate-800">
                    <div className="font-black text-slate-900">{carimboServidor}</div>
                    <div className="font-bold text-[11px] text-blue-700">Matrícula: {carimboMatricula}</div>
                    <div className="text-[10px] text-slate-500">{carimboCargo}</div>
                  </div>
                  <div className="pt-2 border-t border-blue-200 flex items-center justify-between text-[9px] font-mono text-slate-400">
                    <span suppressHydrationWarning>{new Date().toLocaleDateString("pt-BR")}</span>
                    <span className="font-bold text-blue-900">{codigoAutenticidade}</span>
                  </div>
                </div>
                {/* Barra colorida rodapé */}
                <div className="flex h-1.5">
                  <div className="flex-1 bg-emerald-700" />
                  <div className="flex-1 bg-amber-400" />
                  <div className="flex-1 bg-orange-500" />
                  <div className="flex-1 bg-red-600" />
                  <div className="flex-1 bg-cyan-600" />
                </div>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                Copie para colar no rodapé de livros, relatórios ou ofícios expedidos.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
