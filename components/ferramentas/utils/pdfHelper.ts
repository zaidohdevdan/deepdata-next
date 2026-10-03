/**
 * Utilitários para processamento, extração e exportação de PDF no navegador.
 */

interface PDFTextItem {
  str: string
}

interface PDFPageProxy {
  getTextContent: () => Promise<{ items: PDFTextItem[] }>
  getViewport: (options: { scale: number }) => { width: number; height: number }
  render: (options: { canvasContext: CanvasRenderingContext2D; viewport: unknown }) => {
    promise: Promise<void>
  }
}

interface PDFDocumentProxy {
  numPages: number
  getPage: (pageNumber: number) => Promise<PDFPageProxy>
}

interface FerramentasPDFJSStatic {
  getDocument: (src: Uint8Array | { data: Uint8Array }) => {
    promise: Promise<PDFDocumentProxy>
  }
  GlobalWorkerOptions: {
    workerSrc: string
  }
}

interface PdfjsWindowContext {
  pdfjsLib?: FerramentasPDFJSStatic
}

/**
 * Garante o carregamento do PDF.js via CDN com worker configurado.
 */
export async function ensurePdfjs(): Promise<FerramentasPDFJSStatic> {
  if (typeof window === "undefined") {
    throw new Error("PDF.js só pode ser executado no navegador.")
  }

  const win = window as unknown as PdfjsWindowContext
  if (win.pdfjsLib) {
    return win.pdfjsLib
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"
    script.async = true
    script.onload = () => {
      const loadedWin = window as unknown as PdfjsWindowContext
      if (loadedWin.pdfjsLib) {
        loadedWin.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js"
        resolve(loadedWin.pdfjsLib)
      } else {
        reject(new Error("Falha ao inicializar objeto global pdfjsLib."))
      }
    }
    script.onerror = () => reject(new Error("Falha ao carregar script do PDF.js da CDN."))
    document.body.appendChild(script)
  })
}

/**
 * Extrai todo o texto estruturado por páginas de um PDF.
 */
export async function extractTextFromPdf(
  buffer: ArrayBuffer
): Promise<{ pagesText: string[]; fullText: string; numPages: number }> {
  const pdfjs = await ensurePdfjs()
  const typedArray = new Uint8Array(buffer)
  const pdf = await pdfjs.getDocument(typedArray).promise

  const pagesText: string[] = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageStr = content.items.map((item) => item.str).join(" ")
    pagesText.push(pageStr.trim())
  }

  return {
    pagesText,
    fullText: pagesText.join("\n\n"),
    numPages: pdf.numPages,
  }
}

/**
 * Renderiza páginas do PDF em elementos canvas (para visualização e compactação).
 */
export async function renderPdfPagesToCanvases(
  buffer: ArrayBuffer,
  scale = 1.5,
  maxPages = 20
): Promise<HTMLCanvasElement[]> {
  const pdfjs = await ensurePdfjs()
  const typedArray = new Uint8Array(buffer)
  const pdf = await pdfjs.getDocument(typedArray).promise

  const canvases: HTMLCanvasElement[] = []
  const pagesToRender = Math.min(pdf.numPages, maxPages)

  for (let i = 1; i <= pagesToRender; i++) {
    const page = await pdf.getPage(i)
    const viewport = page.getViewport({ scale })
    const canvas = document.createElement("canvas")
    canvas.width = viewport.width
    canvas.height = viewport.height
    const ctx = canvas.getContext("2d")
    if (ctx) {
      await page.render({ canvasContext: ctx, viewport }).promise
      canvases.push(canvas)
    }
  }

  return canvases
}

/**
 * Imprime ou salva conteúdo HTML formatado como PDF institucional via iframe invisível.
 */
export function printHtmlAsPdf(title: string, htmlBody: string) {
  const iframe = document.createElement("iframe")
  iframe.style.position = "fixed"
  iframe.style.right = "0"
  iframe.style.bottom = "0"
  iframe.style.width = "0"
  iframe.style.height = "0"
  iframe.style.border = "none"
  document.body.appendChild(iframe)

  const doc = iframe.contentWindow?.document
  if (!doc) return

  doc.open()
  doc.write(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        @page {
          size: A4 portrait;
          margin: 15mm 15mm 15mm 15mm;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #1e293b;
          margin: 0;
          padding: 0;
          font-size: 11pt;
          line-height: 1.5;
        }
        .header {
          border-bottom: 2px solid #2563eb;
          padding-bottom: 12px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .header h1 {
          margin: 0;
          font-size: 15pt;
          color: #1e3a8a;
          text-transform: uppercase;
          font-weight: 800;
        }
        .header p {
          margin: 2px 0 0 0;
          font-size: 8pt;
          color: #64748b;
          font-weight: 600;
        }
        .table-container {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 9pt;
        }
        th, td {
          border: 1px solid #cbd5e1;
          padding: 6px 8px;
          text-align: left;
        }
        th {
          background-color: #f1f5f9;
          font-weight: 800;
          color: #334155;
          text-transform: uppercase;
          font-size: 8pt;
        }
        tr:nth-child(even) {
          background-color: #f8fafc;
        }
        .footer {
          margin-top: 30px;
          border-top: 1px solid #e2e8f0;
          padding-top: 8px;
          font-size: 8pt;
          color: #94a3b8;
          display: flex;
          justify-content: space-between;
        }
        .page-break {
          page-break-after: always;
        }
      </style>
    </head>
    <body>
      ${htmlBody}
    </body>
    </html>
  `)
  doc.close()

  iframe.contentWindow?.focus()
  setTimeout(() => {
    iframe.contentWindow?.print()
    setTimeout(() => {
      document.body.removeChild(iframe)
    }, 1000)
  }, 400)
}
