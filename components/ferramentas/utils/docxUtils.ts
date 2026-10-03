import { createZipFile, readZipFile, ZipFileInput } from "./zipUtils"

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

/**
 * Cria um arquivo Word (.docx) real nativamente sem bibliotecas externas.
 */
export async function createDocxFromText(
  title: string,
  paragraphs: string[],
  meta?: { autor?: string; unidade?: string; data?: string }
): Promise<Uint8Array> {
  const encoder = new TextEncoder()

  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`

  const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`

  const docRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`

  const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>
        <w:sz w:val="24"/>
        <w:szCs w:val="24"/>
        <w:lang w:val="pt-BR"/>
      </w:rPr>
    </w:rPrDefault>
  </w:docDefaults>
</w:styles>`

  const bodyParagraphs = paragraphs
    .map(
      (p) => `<w:p>
      <w:pPr>
        <w:spacing w:after="160" w:line="276" w:lineRule="auto"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:sz w:val="23"/>
        </w:rPr>
        <w:t xml:space="preserve">${escapeXml(p)}</w:t>
      </w:r>
    </w:p>`
    )
    .join("")

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <!-- Cabeçalho Institucional -->
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:after="60"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="20"/>
          <w:color w:val="4B5563"/>
        </w:rPr>
        <w:t>${escapeXml(meta?.unidade || "SISTEMA PENITENCIÁRIO • UPI-4")}</w:t>
      </w:r>
    </w:p>

    <!-- Título Principal -->
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:after="240"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="32"/>
          <w:color w:val="1E3A8A"/>
        </w:rPr>
        <w:t>${escapeXml(title)}</w:t>
      </w:r>
    </w:p>

    <!-- Parágrafos de Conteúdo -->
    ${bodyParagraphs}

    <!-- Rodapé / Data -->
    <w:p>
      <w:pPr>
        <w:spacing w:before="360"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:i/>
          <w:sz w:val="20"/>
          <w:color w:val="6B7280"/>
        </w:rPr>
        <w:t>Documento gerado em ${escapeXml(meta?.data || new Date().toLocaleDateString("pt-BR"))}.</w:t>
      </w:r>
    </w:p>
  </w:body>
</w:document>`

  const files: ZipFileInput[] = [
    { name: "[Content_Types].xml", data: encoder.encode(contentTypesXml) },
    { name: "_rels/.rels", data: encoder.encode(relsXml) },
    { name: "word/_rels/document.xml.rels", data: encoder.encode(docRelsXml) },
    { name: "word/styles.xml", data: encoder.encode(stylesXml) },
    { name: "word/document.xml", data: encoder.encode(documentXml) },
  ]

  return createZipFile(files)
}

/**
 * Extrai texto e estrutura de parágrafos de um arquivo Word (.docx).
 */
export async function extractTextFromDocx(buffer: ArrayBuffer): Promise<{
  paragraphs: string[]
  fullText: string
}> {
  const items = await readZipFile(buffer)
  const docXmlItem = items.find((i) => i.name === "word/document.xml")

  if (!docXmlItem || !docXmlItem.data) {
    throw new Error("Arquivo .docx inválido ou sem conteúdo legível.")
  }

  const decoder = new TextDecoder("utf-8")
  const xmlString = decoder.decode(docXmlItem.data)

  const paragraphs: string[] = []
  // Regex para localizar blocos <w:p>...</w:p> e extrair <w:t>
  const pRegex = /<w:p(?:\s[^>]*)?>([\s\S]*?)<\/w:p>/gi
  let pMatch: RegExpExecArray | null

  while ((pMatch = pRegex.exec(xmlString)) !== null) {
    const pContent = pMatch[1]
    const tRegex = /<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/gi
    let tMatch: RegExpExecArray | null
    let pText = ""
    while ((tMatch = tRegex.exec(pContent)) !== null) {
      pText += tMatch[1]
    }
    const clean = pText.trim()
    if (clean) paragraphs.push(clean)
  }

  return {
    paragraphs,
    fullText: paragraphs.join("\n\n"),
  }
}
