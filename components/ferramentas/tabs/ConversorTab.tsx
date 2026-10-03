"use client"

import { useState, useRef } from "react"
import {
  RefreshCw,
  Image as ImageIcon,
  FileSpreadsheet,
  FileText,
  Download,
  Trash2,
  FileCode,
  FileDown,
  Printer,
  Layers,
} from "lucide-react"
import { toast } from "sonner"
import * as XLSX from "xlsx"
import { createDocxFromText, extractTextFromDocx } from "../utils/docxUtils"
import { extractTextFromPdf, printHtmlAsPdf } from "../utils/pdfHelper"

type ConversionCategory = "PDF_WORD" | "EXCEL_PDF" | "IMAGEM_PDF" | "TEXTO"

interface ImageFileItem {
  id: string
  file: File
  name: string
  originalSize: number
  previewUrl: string
  targetFormat: "image/jpeg" | "image/png" | "image/webp"
  quality: number
  convertedBlob: Blob | null
  convertedUrl: string | null
  convertedSize: number | null
}

export function ConversorTab() {
  const [category, setCategory] = useState<ConversionCategory>("PDF_WORD")

  // =========================================================================
  // 1. PDF ⇄ WORD STATE
  // =========================================================================
  const [pdfWordSubMode, setPdfWordSubMode] = useState<"PDF_TO_WORD" | "WORD_TO_PDF">("PDF_TO_WORD")
  const [isProcessingDoc, setIsProcessingDoc] = useState(false)
  const [docTitle, setDocTitle] = useState("Documento_Convertido")
  const [docParagraphs, setDocParagraphs] = useState<string[]>([])
  const [docSourceFileName, setDocSourceFileName] = useState("")
  const pdfInputRef = useRef<HTMLInputElement>(null)
  const docxInputRef = useRef<HTMLInputElement>(null)

  // Handlers PDF -> Word
  const handlePdfUpload = async (file: File) => {
    setIsProcessingDoc(true)
    setDocSourceFileName(file.name)
    setDocTitle(file.name.replace(/\.[^/.]+$/, ""))
    try {
      const buffer = await file.arrayBuffer()
      const { pagesText } = await extractTextFromPdf(buffer)
      const paragraphs = pagesText
        .map((t) => t.trim())
        .filter((t) => t.length > 0)

      setDocParagraphs(paragraphs)
      toast.success("PDF lido com sucesso! O conteúdo foi preparado para conversão.")
    } catch {
      toast.error("Erro ao analisar PDF. Verifique se o arquivo não possui senha ou proteção.")
    } finally {
      setIsProcessingDoc(false)
    }
  }

  const handleDownloadDocx = async () => {
    if (docParagraphs.length === 0) {
      toast.error("Nenhum conteúdo para converter em Word.")
      return
    }
    setIsProcessingDoc(true)
    try {
      const docxBytes = await createDocxFromText(docTitle, docParagraphs, {
        unidade: "SISTEMA PENITENCIÁRIO • UPI-4",
      })
      const blob = new Blob([docxBytes.buffer as ArrayBuffer], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${docTitle || "documento"}.docx`
      a.click()
      toast.success("Arquivo Microsoft Word (.docx) baixado com sucesso!")
    } catch {
      toast.error("Falha ao gerar arquivo .docx.")
    } finally {
      setIsProcessingDoc(false)
    }
  }

  // Handlers Word -> PDF
  const handleWordUpload = async (file: File) => {
    setIsProcessingDoc(true)
    setDocSourceFileName(file.name)
    setDocTitle(file.name.replace(/\.[^/.]+$/, ""))
    try {
      const buffer = await file.arrayBuffer()
      const { paragraphs } = await extractTextFromDocx(buffer)
      setDocParagraphs(paragraphs)
      toast.success("Arquivo Word (.docx) lido com sucesso!")
    } catch {
      toast.error("Erro ao ler documento Word. Verifique se é um arquivo .docx válido.")
    } finally {
      setIsProcessingDoc(false)
    }
  }

  const handleExportWordToPdf = () => {
    if (docParagraphs.length === 0) {
      toast.error("Nenhum conteúdo para exportar em PDF.")
      return
    }

    const htmlContent = `
      <div class="header">
        <div>
          <h1>${docTitle}</h1>
          <p>UNIDADE PRISIONAL DE ITAPEJARA D'OESTE • UPI-4</p>
        </div>
        <div>
          <p style="text-align: right; font-size: 8pt; color: #64748b;">Emitido em: ${new Date().toLocaleDateString("pt-BR")}</p>
        </div>
      </div>
      <div>
        ${docParagraphs.map((p) => `<p style="margin-bottom: 12px; text-align: justify; line-height: 1.6;">${p}</p>`).join("")}
      </div>
      <div class="footer">
        <span>DeepData - Gestão Penitenciária Integrada</span>
        <span>Página 1</span>
      </div>
    `
    printHtmlAsPdf(docTitle, htmlContent)
    toast.success("Janela de impressão/PDF aberta.")
  }

  // =========================================================================
  // 2. EXCEL / CSV -> PDF STATE
  // =========================================================================
  const [spreadsheetFile, setSpreadsheetFile] = useState<File | null>(null)
  const [spreadsheetRows, setSpreadsheetRows] = useState<Record<string, unknown>[]>([])
  const [spreadsheetColumns, setSpreadsheetColumns] = useState<string[]>([])
  const spreadsheetInputRef = useRef<HTMLInputElement>(null)

  const handleSpreadsheetUpload = async (file: File) => {
    setSpreadsheetFile(file)
    try {
      const buffer = await file.arrayBuffer()
      const wb = XLSX.read(buffer, { type: "array" })
      const firstSheetName = wb.SheetNames[0]
      const ws = wb.Sheets[firstSheetName]
      const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws)

      if (jsonData.length > 0) {
        setSpreadsheetRows(jsonData)
        setSpreadsheetColumns(Object.keys(jsonData[0] || {}))
        toast.success(`Planilha carregada: ${jsonData.length} linhas detectadas!`)
      } else {
        toast.error("A planilha parece estar vazia.")
      }
    } catch {
      toast.error("Falha ao analisar planilha. Envie um arquivo .xlsx, .xls ou .csv.")
    }
  }

  const handleExportSpreadsheetToPdf = () => {
    if (spreadsheetRows.length === 0 || !spreadsheetFile) {
      toast.error("Nenhuma planilha carregada.")
      return
    }

    const title = spreadsheetFile.name.replace(/\.[^/.]+$/, "")
    const headerCols = spreadsheetColumns.map((col) => `<th>${col}</th>`).join("")
    const bodyRows = spreadsheetRows
      .slice(0, 100) // Limite de 100 linhas para layout de impressão
      .map(
        (r) =>
          `<tr>${spreadsheetColumns
            .map((col) => `<td>${String(r[col] ?? "")}</td>`)
            .join("")}</tr>`
      )
      .join("")

    const htmlContent = `
      <div class="header">
        <div>
          <h1>${title}</h1>
          <p>RELATÓRIO OPERACIONAL CONSOLIDADO • UPI-4</p>
        </div>
        <div style="text-align: right; font-size: 8pt; color: #64748b;">
          Total: ${spreadsheetRows.length} registros<br>
          Data: ${new Date().toLocaleDateString("pt-BR")}
        </div>
      </div>
      <div class="table-container">
        <table>
          <thead><tr>${headerCols}</tr></thead>
          <tbody>${bodyRows}</tbody>
        </table>
      </div>
      <div class="footer">
        <span>DeepData Penitenciário - Impresso em ${new Date().toLocaleDateString("pt-BR")}</span>
        <span>Exibindo ${Math.min(100, spreadsheetRows.length)} de ${spreadsheetRows.length} linhas</span>
      </div>
    `
    printHtmlAsPdf(title, htmlContent)
  }

  // =========================================================================
  // 3. IMAGENS -> PDF & CONVERSOR DE IMAGENS STATE
  // =========================================================================
  const [imageItems, setImageItems] = useState<ImageFileItem[]>([])
  const imageInputRef = useRef<HTMLInputElement>(null)

  const handleAddImages = (files: FileList | null) => {
    if (!files) return
    const newItems: ImageFileItem[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!file.type.startsWith("image/")) continue
      newItems.push({
        id: Math.random().toString(36).substring(2, 9),
        file,
        name: file.name,
        originalSize: file.size,
        previewUrl: URL.createObjectURL(file),
        targetFormat: "image/jpeg",
        quality: 0.85,
        convertedBlob: null,
        convertedUrl: null,
        convertedSize: null,
      })
    }
    setImageItems((prev) => [...prev, ...newItems])
    if (newItems.length > 0) {
      toast.success(`${newItems.length} foto(s) adicionada(s).`)
    }
  }

  const handleExportImagesToPdf = () => {
    if (imageItems.length === 0) {
      toast.error("Adicione imagens para gerar o PDF.")
      return
    }

    const title = "Relatorio_Fotografico_Operacional"
    const imagesHtml = imageItems
      .map(
        (img, idx) => `
        <div style="margin-bottom: 25px; text-align: center; page-break-inside: avoid;">
          <div style="font-size: 10pt; font-weight: 800; color: #334155; margin-bottom: 8px;">
            Anexo ${idx + 1}: ${img.name}
          </div>
          <img src="${img.previewUrl}" style="max-width: 90%; max-height: 480px; border-radius: 8px; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px rgba(0,0,0,0.05);" />
        </div>
      `
      )
      .join("")

    const htmlContent = `
      <div class="header">
        <div>
          <h1>RELATÓRIO FOTOGRÁFICO DE PLANTÃO</h1>
          <p>UNIDADE PRISIONAL DE ITAPEJARA D'OESTE • UPI-4</p>
        </div>
        <div style="text-align: right; font-size: 8pt; color: #64748b;">
          Total: ${imageItems.length} anexo(s)<br>
          Data: ${new Date().toLocaleDateString("pt-BR")}
        </div>
      </div>
      <div>
        ${imagesHtml}
      </div>
      <div class="footer">
        <span>DeepData - Anexos Fotográficos Oficiais</span>
        <span>Autenticado em ${new Date().toLocaleDateString("pt-BR")}</span>
      </div>
    `
    printHtmlAsPdf(title, htmlContent)
  }

  // =========================================================================
  // 4. TEXTO & BASE64 STATE
  // =========================================================================
  const [textContent, setTextContent] = useState("")
  const [textMode, setTextMode] = useState<"TO_BASE64" | "FROM_BASE64" | "TO_TXT">("TO_BASE64")
  const [textResult, setTextResult] = useState("")

  const handleProcessText = () => {
    if (!textContent.trim()) {
      toast.error("Insira o texto para converter.")
      return
    }
    try {
      if (textMode === "TO_BASE64") {
        setTextResult(btoa(unescape(encodeURIComponent(textContent))))
        toast.success("Codificado em Base64!")
      } else if (textMode === "FROM_BASE64") {
        setTextResult(decodeURIComponent(escape(atob(textContent.trim()))))
        toast.success("Decodificado de Base64!")
      } else if (textMode === "TO_TXT") {
        const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `documento-${new Date().toISOString().slice(0, 10)}.txt`
        a.click()
        toast.success("Arquivo .txt exportado com sucesso!")
      }
    } catch {
      toast.error("Erro na conversão. Verifique o formato do texto.")
    }
  }



  return (
    <div className="space-y-6">
      {/* Seletor de Categoria de Conversão */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/80 w-fit">
        <button
          type="button"
          onClick={() => setCategory("PDF_WORD")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
            category === "PDF_WORD"
              ? "bg-white text-blue-600 shadow-sm shadow-blue-500/10 border border-slate-200/60"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FileText size={15} />
          <span>PDF ⇄ Word (.docx)</span>
        </button>

        <button
          type="button"
          onClick={() => setCategory("EXCEL_PDF")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
            category === "EXCEL_PDF"
              ? "bg-white text-blue-600 shadow-sm shadow-blue-500/10 border border-slate-200/60"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FileSpreadsheet size={15} />
          <span>Excel / CSV → PDF</span>
        </button>

        <button
          type="button"
          onClick={() => setCategory("IMAGEM_PDF")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
            category === "IMAGEM_PDF"
              ? "bg-white text-blue-600 shadow-sm shadow-blue-500/10 border border-slate-200/60"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <ImageIcon size={15} />
          <span>Imagens → PDF & Formatos</span>
        </button>

        <button
          type="button"
          onClick={() => setCategory("TEXTO")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
            category === "TEXTO"
              ? "bg-white text-blue-600 shadow-sm shadow-blue-500/10 border border-slate-200/60"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FileCode size={15} />
          <span>Texto & Base64</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* 1. ABA: PDF ⇄ WORD (.DOCX) */}
      {/* ===================================================================== */}
      {category === "PDF_WORD" && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-800">
                Conversor Profissional: PDF ⇄ Microsoft Word (.docx)
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Converta documentos judiciais e relatórios de PDF para Word editável e vice-versa sem perder o sigilo dos dados.
              </p>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold shrink-0">
              <button
                type="button"
                onClick={() => {
                  setPdfWordSubMode("PDF_TO_WORD")
                  setDocParagraphs([])
                }}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  pdfWordSubMode === "PDF_TO_WORD"
                    ? "bg-white text-blue-600 shadow-2xs font-extrabold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                PDF → Word (.docx)
              </button>
              <button
                type="button"
                onClick={() => {
                  setPdfWordSubMode("WORD_TO_PDF")
                  setDocParagraphs([])
                }}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  pdfWordSubMode === "WORD_TO_PDF"
                    ? "bg-white text-blue-600 shadow-2xs font-extrabold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Word (.docx) → PDF
              </button>
            </div>
          </div>

          {/* Submodo: PDF para Word */}
          {pdfWordSubMode === "PDF_TO_WORD" && (
            <div className="space-y-6">
              <input
                ref={pdfInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handlePdfUpload(f)
                  if (e.target) e.target.value = ""
                }}
              />

              {docParagraphs.length === 0 ? (
                <div
                  onClick={() => pdfInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-3xl p-10 flex flex-col items-center justify-center gap-3 bg-slate-50/50 hover:bg-blue-50/30 transition cursor-pointer text-center"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <FileText size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">
                      {isProcessingDoc ? "Processando arquivo PDF..." : "Clique para selecionar um arquivo PDF"}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Extrai parágrafos, cabeçalhos e termos para gerar um documento .docx oficial
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="min-w-0">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400">
                        Arquivo Origem:
                      </span>
                      <p className="text-xs font-bold text-slate-800 truncate">{docSourceFileName}</p>
                      <p className="text-[11px] text-blue-600 font-bold mt-0.5">
                        {docParagraphs.length} parágrafos identificados
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setDocSourceFileName("")
                          setDocParagraphs([])
                          toast.info("Anexo PDF removido.")
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200/80 rounded-full transition cursor-pointer"
                      >
                        <Trash2 size={13} />
                        <span>Remover PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => pdfInputRef.current?.click()}
                        className="px-3.5 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-full hover:bg-slate-100 transition cursor-pointer"
                      >
                        Trocar PDF
                      </button>

                      <button
                        type="button"
                        onClick={handleDownloadDocx}
                        disabled={isProcessingDoc}
                        className="inline-flex items-center gap-2 px-5 py-2 text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md shadow-blue-600/20 transition cursor-pointer disabled:opacity-60"
                      >
                        <Download size={14} />
                        <span>Baixar Documento Word (.docx)</span>
                      </button>
                    </div>
                  </div>

                  {/* Prévia do Conteúdo Extraído */}
                  <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-3 max-h-96 overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase">
                        Prévia do Conteúdo que irá para o Word:
                      </span>
                    </div>
                    {docParagraphs.map((par, i) => (
                      <p key={i} className="text-xs text-slate-700 leading-relaxed text-justify">
                        {par}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Submodo: Word para PDF */}
          {pdfWordSubMode === "WORD_TO_PDF" && (
            <div className="space-y-6">
              <input
                ref={docxInputRef}
                type="file"
                accept=".docx"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleWordUpload(f)
                  if (e.target) e.target.value = ""
                }}
              />

              {docParagraphs.length === 0 ? (
                <div
                  onClick={() => docxInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-3xl p-10 flex flex-col items-center justify-center gap-3 bg-slate-50/50 hover:bg-blue-50/30 transition cursor-pointer text-center"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <FileDown size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">
                      {isProcessingDoc ? "Lendo arquivo Word..." : "Clique para selecionar um arquivo .docx"}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Interpreta a formatação do Word e abre a janela de exportação oficial em PDF
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="min-w-0">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400">
                        Arquivo Word Carregado:
                      </span>
                      <p className="text-xs font-bold text-slate-800 truncate">{docSourceFileName}</p>
                      <p className="text-[11px] text-emerald-600 font-bold mt-0.5">
                        Pronto para geração em PDF
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setDocSourceFileName("")
                          setDocParagraphs([])
                          toast.info("Anexo Word (.docx) removido.")
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200/80 rounded-full transition cursor-pointer"
                      >
                        <Trash2 size={13} />
                        <span>Remover Word</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => docxInputRef.current?.click()}
                        className="px-3.5 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-full hover:bg-slate-100 transition cursor-pointer"
                      >
                        Trocar Word
                      </button>

                      <button
                        type="button"
                        onClick={handleExportWordToPdf}
                        className="inline-flex items-center gap-2 px-5 py-2 text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md shadow-blue-600/20 transition cursor-pointer"
                      >
                        <Printer size={14} />
                        <span>Exportar / Salvar como PDF</span>
                      </button>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-2xl p-6 bg-white space-y-4 shadow-sm">
                    <div className="text-center pb-3 border-b border-slate-100">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                        Visualização Prévia A4
                      </span>
                      <h3 className="text-base font-black text-slate-900 mt-1">{docTitle}</h3>
                    </div>
                    {docParagraphs.map((par, i) => (
                      <p key={i} className="text-xs text-slate-700 leading-relaxed text-justify">
                        {par}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. ABA: EXCEL / CSV -> PDF */}
      {/* ===================================================================== */}
      {category === "EXCEL_PDF" && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-800">
              Conversor de Planilhas (Excel / CSV) para PDF Institucional
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Transforme planilhas de efetivo, alimentação, escalas ou listas de internos em relatórios PDF prontos para impressão oficial.
            </p>
          </div>

          <input
            ref={spreadsheetInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleSpreadsheetUpload(file)
              if (e.target) e.target.value = ""
            }}
          />

          {!spreadsheetFile ? (
            <div
              onClick={() => spreadsheetInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-3xl p-10 flex flex-col items-center justify-center gap-3 bg-slate-50/50 hover:bg-blue-50/30 transition cursor-pointer text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <FileSpreadsheet size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">
                  Clique para selecionar uma planilha .XLSX ou .CSV
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Gera cabeçalho institucional UPI-4 e diagramação automática de colunas
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Planilha:</span>
                  <p className="text-xs font-bold text-slate-800 truncate">{spreadsheetFile.name}</p>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {spreadsheetRows.length} linhas • {spreadsheetColumns.length} colunas
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSpreadsheetFile(null)
                      setSpreadsheetRows([])
                      setSpreadsheetColumns([])
                      toast.info("Planilha removida.")
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200/80 rounded-full transition cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Remover Planilha</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => spreadsheetInputRef.current?.click()}
                    className="px-3.5 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-full hover:bg-slate-100 transition cursor-pointer"
                  >
                    Trocar Planilha
                  </button>

                  <button
                    type="button"
                    onClick={handleExportSpreadsheetToPdf}
                    className="inline-flex items-center gap-2 px-5 py-2 text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md shadow-blue-600/20 transition cursor-pointer"
                  >
                    <Printer size={14} />
                    <span>Gerar PDF / Imprimir Tabela</span>
                  </button>
                </div>
              </div>

              {/* Tabela de Visualização */}
              <div className="border border-slate-200 rounded-2xl overflow-x-auto max-h-80">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0">
                    <tr>
                      {spreadsheetColumns.map((col, idx) => (
                        <th key={idx} className="p-2.5 border-b border-slate-200 truncate">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {spreadsheetRows.slice(0, 50).map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/80 transition">
                        {spreadsheetColumns.map((col, cIdx) => (
                          <td key={cIdx} className="p-2.5 truncate max-w-xs">
                            {String(row[col] ?? "")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. ABA: IMAGENS -> PDF */}
      {/* ===================================================================== */}
      {category === "IMAGEM_PDF" && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-800">
                Gerador de PDF a partir de Imagens & Otimizador
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Junte múltiplas fotos em um único arquivo PDF oficial (scanner de relatórios e ocorrências).
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <input
                ref={imageInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  handleAddImages(e.target.files)
                  if (e.target) e.target.value = ""
                }}
              />
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-extrabold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-full transition cursor-pointer"
              >
                <ImageIcon size={14} />
                <span>Adicionar Fotos</span>
              </button>

              {imageItems.length > 0 && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setImageItems([])
                      toast.info("Todas as fotos foram removidas.")
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200/80 rounded-full transition cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Limpar Todas ({imageItems.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportImagesToPdf}
                    className="inline-flex items-center gap-2 px-5 py-2 text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md shadow-blue-600/20 transition cursor-pointer"
                  >
                    <Printer size={14} />
                    <span>Gerar PDF com {imageItems.length} Foto(s)</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {imageItems.length === 0 ? (
            <div
              onClick={() => imageInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-3xl p-10 flex flex-col items-center justify-center gap-3 bg-slate-50/50 hover:bg-blue-50/30 transition cursor-pointer text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Layers size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">
                  Arraste fotos de documentos ou clique para selecionar
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Combina fotos em folha de relatório A4 numerada com identificação da UPI-4
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {imageItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl border border-slate-200 bg-slate-50/40 relative group space-y-2"
                >
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.previewUrl}
                      alt={item.name}
                      className="w-full h-32 object-cover rounded-xl border border-slate-200 bg-white"
                    />
                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-mono font-bold">
                      #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => setImageItems((prev) => prev.filter((i) => i.id !== item.id))}
                      className="absolute top-1.5 right-1.5 p-1 rounded-md bg-white/90 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <p className="text-[11px] font-bold text-slate-700 truncate" title={item.name}>
                    {item.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. ABA: TEXTO & BASE64 */}
      {/* ===================================================================== */}
      {category === "TEXTO" && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-800">
              Conversor de Texto, Base64 e Exportador .TXT
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Codifique e decodifique informações confidenciais em Base64 ou gere arquivos de texto puro formatados para prontuários e certidões.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setTextMode("TO_BASE64")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                textMode === "TO_BASE64"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Texto → Base64
            </button>
            <button
              type="button"
              onClick={() => setTextMode("FROM_BASE64")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                textMode === "FROM_BASE64"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Base64 → Texto
            </button>
            <button
              type="button"
              onClick={() => setTextMode("TO_TXT")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                textMode === "TO_TXT"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Exportar como Arquivo .TXT
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold text-slate-500 uppercase">
                  Texto de Entrada
                </label>
                {textContent.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setTextContent("")
                      setTextResult("")
                      toast.info("Texto limpo.")
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                  >
                    <Trash2 size={12} />
                    <span>Limpar</span>
                  </button>
                )}
              </div>
              <textarea
                rows={8}
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Cole ou digite seu texto aqui..."
                className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none"
              />
              <button
                type="button"
                onClick={handleProcessText}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-600/20 transition cursor-pointer"
              >
                <RefreshCw size={13} />
                <span>Processar Conversão</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold text-slate-500 uppercase">
                  Resultado
                </label>
                {textResult && (
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(textResult)
                      toast.success("Copiado para a área de transferência!")
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                  >
                    Copiar Resultado
                  </button>
                )}
              </div>
              <textarea
                readOnly
                rows={8}
                value={textResult}
                placeholder="O resultado convertido aparecerá aqui..."
                className="w-full text-xs font-mono p-3 bg-slate-100/70 border border-slate-200 rounded-2xl outline-none text-slate-800 resize-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
