"use client"

import { useState, useRef } from "react"
import {
  FolderArchive,
  Upload,
  Download,
  Trash2,
  FileText,
  Percent,
  FileSearch,
  RefreshCw,
  FileDown,
} from "lucide-react"
import { toast } from "sonner"
import { createZipFile, readZipFile, ZipFileInput, ExtractedZipItem } from "../utils/zipUtils"
import { renderPdfPagesToCanvases, printHtmlAsPdf } from "../utils/pdfHelper"

interface FileToZip {
  id: string
  file: File
  name: string
  size: number
}

export function CompactadorTab() {
  const [subMode, setSubMode] = useState<"COMPACTAR_PDF" | "COMPACTAR_FOTOS" | "CRIAR_ZIP" | "LER_ZIP">(
    "COMPACTAR_PDF"
  )

  // =========================================================================
  // 1. COMPACTADOR DE PDF STATE
  // =========================================================================
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [isCompressingPdf, setIsCompressingPdf] = useState(false)
  const [pdfCompressionLevel, setPdfCompressionLevel] = useState<"ALTA" | "MEDIA" | "LEVE">("MEDIA")
  const [compressedPdfCanvases, setCompressedPdfCanvases] = useState<HTMLCanvasElement[]>([])
  const pdfCompressInputRef = useRef<HTMLInputElement>(null)

  const handleSelectPdfToCompress = async (file: File) => {
    setPdfFile(file)
    setIsCompressingPdf(true)
    try {
      const buffer = await file.arrayBuffer()
      const scale = pdfCompressionLevel === "ALTA" ? 1.0 : pdfCompressionLevel === "MEDIA" ? 1.3 : 1.6
      const canvases = await renderPdfPagesToCanvases(buffer, scale)
      setCompressedPdfCanvases(canvases)
      toast.success(`PDF "${file.name}" carregado (${canvases.length} páginas renderizadas para otimização)!`)
    } catch {
      toast.error("Falha ao analisar o PDF. Verifique se o arquivo está protegido ou corrompido.")
    } finally {
      setIsCompressingPdf(false)
    }
  }

  const handleExportCompressedPdf = () => {
    if (compressedPdfCanvases.length === 0 || !pdfFile) {
      toast.error("Nenhum PDF processado para baixar.")
      return
    }

    const quality = pdfCompressionLevel === "ALTA" ? 0.5 : pdfCompressionLevel === "MEDIA" ? 0.7 : 0.85
    const imagesHtml = compressedPdfCanvases
      .map((canvas, idx) => {
        const dataUrl = canvas.toDataURL("image/jpeg", quality)
        return `
        <div style="page-break-after: ${idx < compressedPdfCanvases.length - 1 ? "always" : "auto"}; text-align: center; margin: 0; padding: 0;">
          <img src="${dataUrl}" style="max-width: 100%; height: auto; display: block; margin: 0 auto;" />
        </div>
      `
      })
      .join("")

    const title = `otimizado-${pdfFile.name.replace(/\.[^/.]+$/, "")}`
    printHtmlAsPdf(title, imagesHtml)
    toast.success("PDF otimizado pronto para salvar com peso reduzido!")
  }

  // =========================================================================
  // 2. COMPACTADOR DE FOTOS STATE
  // =========================================================================
  const [origImageFile, setOrigImageFile] = useState<File | null>(null)
  const [origImagePreview, setOrigImagePreview] = useState<string | null>(null)
  const [compressedImageBlob, setCompressedImageBlob] = useState<Blob | null>(null)
  const [compressedImagePreview, setCompressedImagePreview] = useState<string | null>(null)
  const [compressionQuality, setCompressionQuality] = useState<number>(0.6)
  const [isCompressingImage, setIsCompressingImage] = useState(false)
  const photoInputRef = useRef<HTMLInputElement>(null)

  const handleSelectPhotoForCompress = (file: File) => {
    setOrigImageFile(file)
    setOrigImagePreview(URL.createObjectURL(file))
    setCompressedImageBlob(null)
    setCompressedImagePreview(null)
    compressPhoto(file, compressionQuality)
  }

  const compressPhoto = (file: File, quality: number) => {
    setIsCompressingImage(true)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      let width = img.naturalWidth
      let height = img.naturalHeight

      const maxDim = 2400
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width)
          width = maxDim
        } else {
          width = Math.round((width * maxDim) / height)
          height = maxDim
        }
      }

      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        setIsCompressingImage(false)
        return
      }
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, width, height)
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          setIsCompressingImage(false)
          if (!blob) return
          setCompressedImageBlob(blob)
          setCompressedImagePreview(URL.createObjectURL(blob))
        },
        "image/jpeg",
        quality
      )
    }
    img.onerror = () => setIsCompressingImage(false)
    img.src = URL.createObjectURL(file)
  }

  // =========================================================================
  // 3. CRIAR ZIP STATE
  // =========================================================================
  const [zipFiles, setZipFiles] = useState<FileToZip[]>([])
  const [zipFileName, setZipFileName] = useState("documentos_operacionais.zip")
  const [isZipping, setIsZipping] = useState(false)
  const zipInputRef = useRef<HTMLInputElement>(null)

  const handleAddFilesToZip = (files: FileList | null) => {
    if (!files) return
    const newItems: FileToZip[] = []
    for (let i = 0; i < files.length; i++) {
      const f = files[i]
      newItems.push({
        id: Math.random().toString(36).substring(2, 9),
        file: f,
        name: f.name,
        size: f.size,
      })
    }
    setZipFiles((prev) => [...prev, ...newItems])
    if (newItems.length > 0) {
      toast.success(`${newItems.length} arquivo(s) adicionado(s) para empacotamento.`)
    }
  }

  const handleGenerateZip = async () => {
    if (zipFiles.length === 0) {
      toast.error("Adicione arquivos para criar o pacote ZIP.")
      return
    }

    setIsZipping(true)
    try {
      const inputs: ZipFileInput[] = []
      for (const item of zipFiles) {
        const buffer = await item.file.arrayBuffer()
        inputs.push({
          name: item.name,
          data: new Uint8Array(buffer),
          lastModified: new Date(item.file.lastModified),
        })
      }

      const zipBytes = await createZipFile(inputs)
      const blob = new Blob([zipBytes.buffer as ArrayBuffer], { type: "application/zip" })
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      const finalName = zipFileName.endsWith(".zip") ? zipFileName : `${zipFileName}.zip`
      a.download = finalName
      a.click()

      toast.success(`Pacote "${finalName}" criado com sucesso!`)
    } catch (err) {
      toast.error("Falha ao gerar o arquivo ZIP: " + (err instanceof Error ? err.message : ""))
    } finally {
      setIsZipping(false)
    }
  }

  // =========================================================================
  // 4. LER E EXTRAIR ZIP STATE
  // =========================================================================
  const [extractedItems, setExtractedItems] = useState<ExtractedZipItem[]>([])
  const [loadedZipName, setLoadedZipName] = useState<string>("")
  const [isLoadingZip, setIsLoadingZip] = useState(false)
  const readZipInputRef = useRef<HTMLInputElement>(null)

  const handleUploadZipToRead = async (file: File) => {
    setIsLoadingZip(true)
    setLoadedZipName(file.name)
    try {
      const buffer = await file.arrayBuffer()
      const items = await readZipFile(buffer)
      setExtractedItems(items)
      toast.success(`${items.length} arquivo(s) localizados dentro do ZIP!`)
    } catch {
      toast.error("Erro ao ler arquivo ZIP. Verifique se o arquivo está corrompido.")
      setExtractedItems([])
    } finally {
      setIsLoadingZip(false)
    }
  }

  const handleDownloadExtractedItem = (item: ExtractedZipItem) => {
    if (!item.data) {
      toast.error("Não foi possível extrair este arquivo.")
      return
    }
    const blob = new Blob([item.data.buffer as ArrayBuffer])
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = item.name.split("/").pop() || item.name
    a.click()
  }

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  }

  const totalZipBytes = zipFiles.reduce((acc, f) => acc + f.size, 0)

  return (
    <div className="space-y-6">
      {/* Submenu de Compactação */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/80 w-fit">
        <button
          type="button"
          onClick={() => setSubMode("COMPACTAR_PDF")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
            subMode === "COMPACTAR_PDF"
              ? "bg-white text-blue-600 shadow-sm shadow-blue-500/10 border border-slate-200/60"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FileDown size={15} />
          <span>Compactador de PDF</span>
        </button>

        <button
          type="button"
          onClick={() => setSubMode("COMPACTAR_FOTOS")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
            subMode === "COMPACTAR_FOTOS"
              ? "bg-white text-blue-600 shadow-sm shadow-blue-500/10 border border-slate-200/60"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Percent size={15} />
          <span>Redutor de Imagens</span>
        </button>

        <button
          type="button"
          onClick={() => setSubMode("CRIAR_ZIP")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
            subMode === "CRIAR_ZIP"
              ? "bg-white text-blue-600 shadow-sm shadow-blue-500/10 border border-slate-200/60"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FolderArchive size={15} />
          <span>Criar Arquivo ZIP</span>
        </button>

        <button
          type="button"
          onClick={() => setSubMode("LER_ZIP")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
            subMode === "LER_ZIP"
              ? "bg-white text-blue-600 shadow-sm shadow-blue-500/10 border border-slate-200/60"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FileSearch size={15} />
          <span>Inspecionar / Extrair ZIP</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* 1. MODO: COMPACTADOR DE PDF */}
      {/* ===================================================================== */}
      {subMode === "COMPACTAR_PDF" && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-800">
              Otimizador e Compactador de Arquivos PDF
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Diminua o tamanho de relatórios, sindicâncias e autos em PDF para viabilizar o upload em sistemas do judiciário (SEEU, Projudi, PJe).
            </p>
          </div>

          <input
            ref={pdfCompressInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) handleSelectPdfToCompress(f)
              if (e.target) e.target.value = ""
            }}
          />

          {!pdfFile ? (
            <div
              onClick={() => pdfCompressInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-3xl p-10 flex flex-col items-center justify-center gap-3 bg-slate-50/50 hover:bg-blue-50/30 transition cursor-pointer text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <FileDown size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">
                  {isCompressingPdf ? "Lendo páginas do PDF..." : "Clique para selecionar um PDF volumoso"}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Compacta e otimiza a resolução mantendo a legibilidade de despachos e assinaturas
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">PDF Original:</span>
                  <p className="text-xs font-bold text-slate-800 truncate">{pdfFile.name}</p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Tamanho atual: <strong className="text-rose-600">{formatBytes(pdfFile.size)}</strong> • {compressedPdfCanvases.length} página(s) processada(s)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 text-xs">
                    {(["ALTA", "MEDIA", "LEVE"] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => {
                          setPdfCompressionLevel(lvl)
                          if (pdfFile) handleSelectPdfToCompress(pdfFile)
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          pdfCompressionLevel === lvl
                            ? "bg-blue-600 text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {lvl === "ALTA" ? "Máx Compactação" : lvl === "MEDIA" ? "Equilibrado" : "Alta Resolução"}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setPdfFile(null)
                      setCompressedPdfCanvases([])
                      toast.info("Anexo PDF removido.")
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200/80 rounded-full transition cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Remover PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportCompressedPdf}
                    disabled={isCompressingPdf}
                    className="inline-flex items-center gap-2 px-5 py-2 text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md shadow-blue-600/20 transition cursor-pointer disabled:opacity-60"
                  >
                    <Download size={14} />
                    <span>Salvar PDF Compactado</span>
                  </button>
                </div>
              </div>

              {/* Pré-visualização das Páginas Compactadas */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {compressedPdfCanvases.map((canvas, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Página {idx + 1}</div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={canvas.toDataURL("image/jpeg", 0.6)}
                      alt={`Página ${idx + 1}`}
                      className="w-full h-40 object-contain rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. MODO: REDUTOR DE FOTOS */}
      {/* ===================================================================== */}
      {subMode === "COMPACTAR_FOTOS" && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-800">
              Redutor de Tamanho para Fotos e Documentos Digitalizados
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Diminua o peso de arquivos pesados (ex: fotos de livro de ocorrências, laudos e mandados) para cumprir limites de envio em sistemas judiciais e penitenciários.
            </p>
          </div>

          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleSelectPhotoForCompress(file)
              if (e.target) e.target.value = ""
            }}
          />

          {!origImageFile ? (
            <div
              onClick={() => photoInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-3xl p-10 flex flex-col items-center justify-center gap-3 bg-slate-50/50 hover:bg-blue-50/30 transition cursor-pointer text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Percent size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">
                  Selecione uma imagem para reduzir o tamanho
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Otimização visual preservando a legibilidade de textos e identificações
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between max-w-sm">
                    <label className="text-[11px] font-bold text-slate-600 uppercase">
                      Nível de Qualidade: {Math.round(compressionQuality * 100)}%
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">
                      (Menor % = Menor tamanho do arquivo)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.95"
                    step="0.05"
                    value={compressionQuality}
                    onChange={(e) => {
                      const q = parseFloat(e.target.value)
                      setCompressionQuality(q)
                      if (origImageFile) compressPhoto(origImageFile, q)
                    }}
                    className="w-full max-w-sm accent-blue-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setOrigImageFile(null)
                      setOrigImagePreview(null)
                      setCompressedImageBlob(null)
                      setCompressedImagePreview(null)
                      toast.info("Foto removida.")
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200/80 rounded-full transition cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Remover Foto</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="px-3.5 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-full hover:bg-slate-100 transition cursor-pointer"
                  >
                    Trocar Imagem
                  </button>

                  {compressedImageBlob && (
                    <button
                      type="button"
                      disabled={isCompressingImage}
                      onClick={() => {
                        const a = document.createElement("a")
                        a.href = compressedImagePreview!
                        a.download = `otimizada-${origImageFile.name.replace(/\.[^/.]+$/, "")}.jpg`
                        a.click()
                        toast.success("Foto compactada baixada com sucesso!")
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2 text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-md shadow-emerald-600/20 transition cursor-pointer disabled:opacity-60"
                    >
                      {isCompressingImage ? (
                        <RefreshCw size={14} className="animate-spin" />
                      ) : (
                        <Download size={14} />
                      )}
                      <span>{isCompressingImage ? "Otimizando..." : "Baixar Foto Otimizada"}</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-2xl border border-slate-200 space-y-3 bg-slate-50/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-700">Arquivo Original</span>
                    <span className="font-mono font-bold text-rose-600">
                      {formatBytes(origImageFile.size)}
                    </span>
                  </div>
                  {origImagePreview && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={origImagePreview}
                      alt="Original"
                      className="w-full h-64 object-contain rounded-xl bg-white border border-slate-200"
                    />
                  )}
                </div>

                <div className="p-4 rounded-2xl border border-emerald-200 space-y-3 bg-emerald-50/30">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-emerald-800">Resultado Compactado</span>
                    {compressedImageBlob && (
                      <div className="flex items-center gap-2 font-mono font-bold">
                        <span className="text-emerald-700">{formatBytes(compressedImageBlob.size)}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800">
                          -
                          {Math.round(
                            ((origImageFile.size - compressedImageBlob.size) /
                              origImageFile.size) *
                              100
                          )}
                          %
                        </span>
                      </div>
                    )}
                  </div>
                  {compressedImagePreview && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={compressedImagePreview}
                      alt="Otimizada"
                      className="w-full h-64 object-contain rounded-xl bg-white border border-emerald-200"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. MODO: CRIAR ZIP */}
      {/* ===================================================================== */}
      {subMode === "CRIAR_ZIP" && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-800">
                Gerador de Pacotes Compactados (.ZIP)
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Junte múltiplos documentos, fotos e relatórios em um único arquivo compactado protegido e pronto para envio.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <input
                ref={zipInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  handleAddFilesToZip(e.target.files)
                  if (e.target) e.target.value = ""
                }}
              />
              <button
                type="button"
                onClick={() => zipInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-extrabold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-full transition cursor-pointer"
              >
                <Upload size={14} />
                <span>Adicionar Arquivos</span>
              </button>

              {zipFiles.length > 0 && (
                <button
                  type="button"
                  onClick={() => setZipFiles([])}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-full transition cursor-pointer"
                >
                  <Trash2 size={13} />
                  <span>Limpar Todos</span>
                </button>
              )}
            </div>
          </div>

          {zipFiles.length === 0 ? (
            <div
              onClick={() => zipInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-3xl p-10 flex flex-col items-center justify-center gap-3 bg-slate-50/50 hover:bg-blue-50/30 transition cursor-pointer text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-xs">
                <FolderArchive size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">
                  Arraste arquivos ou clique para empacotar em ZIP
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Compacta qualquer formato (PDF, DOCX, XLSX, JPG, TXT) de forma rápida e segura
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">
                    Nome do Arquivo ZIP
                  </label>
                  <input
                    type="text"
                    value={zipFileName}
                    onChange={(e) => setZipFileName(e.target.value)}
                    className="w-full max-w-md px-3 py-1.5 text-xs font-bold bg-white text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="block text-xs font-black text-slate-700">
                      {zipFiles.length} item(ns)
                    </span>
                    <span className="text-[11px] text-slate-400 font-bold">
                      {formatBytes(totalZipBytes)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateZip}
                    disabled={isZipping}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md shadow-blue-600/20 transition cursor-pointer disabled:opacity-60"
                  >
                    {isZipping ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <Download size={14} />
                    )}
                    <span>{isZipping ? "Empacotando..." : "Baixar Arquivo .ZIP"}</span>
                  </button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {zipFiles.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3.5 flex items-center justify-between hover:bg-slate-50/80 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {formatBytes(item.size)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setZipFiles((prev) => prev.filter((i) => i.id !== item.id))}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                      title="Remover"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. MODO: INSPECIONAR / EXTRAIR ZIP */}
      {/* ===================================================================== */}
      {subMode === "LER_ZIP" && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-800">
              Visualizador e Extrator de Arquivos ZIP
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Abra qualquer pacote .zip recebido para examinar a lista de documentos e extrair arquivos avulsos sem precisar instalar softwares externos.
            </p>
          </div>

          <input
            ref={readZipInputRef}
            type="file"
            accept=".zip"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleUploadZipToRead(file)
              if (e.target) e.target.value = ""
            }}
          />

          {extractedItems.length === 0 ? (
            <div
              onClick={() => readZipInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-3xl p-10 flex flex-col items-center justify-center gap-3 bg-slate-50/50 hover:bg-blue-50/30 transition cursor-pointer text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <FileSearch size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">
                  {isLoadingZip ? "Lendo arquivo ZIP..." : "Clique para abrir um arquivo .ZIP"}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Visualização rápida da estrutura interna de diretórios e arquivos
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-700">Arquivo aberto: </span>
                  <span className="text-xs font-black text-blue-600">{loadedZipName}</span>
                  <span className="text-[11px] text-slate-400 ml-2">
                    ({extractedItems.length} arquivos contidos)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setExtractedItems([])
                      setLoadedZipName("")
                      toast.info("Arquivo ZIP descarregado.")
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200/80 rounded-full transition cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Fechar / Limpar ZIP</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => readZipInputRef.current?.click()}
                    className="px-3.5 py-1.5 text-xs font-bold bg-white border border-slate-200 rounded-full hover:bg-slate-100 transition cursor-pointer"
                  >
                    Abrir Outro ZIP
                  </button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 max-h-96 overflow-y-auto">
                {extractedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 flex items-center justify-between hover:bg-slate-50/80 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText size={16} className="text-slate-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                        <p className="text-[10px] text-slate-400">
                          Tamanho: {formatBytes(item.size)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDownloadExtractedItem(item)}
                      disabled={!item.data}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer disabled:opacity-40"
                    >
                      <Download size={13} />
                      <span>Extrair</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
