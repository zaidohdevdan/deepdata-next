/**
 * Utilitário puro em TypeScript para manipulação e geração de arquivos ZIP (PKZIP standard).
 * Não depende de bibliotecas externas, operando 100% no navegador de forma ultrarrápida.
 */

// Tabela CRC32 pré-calculada para máxima performance
const CRC_TABLE = new Uint32Array(256)
for (let i = 0; i < 256; i++) {
  let c = i
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  }
  CRC_TABLE[i] = c
}

export function calculateCRC32(bytes: Uint8Array): number {
  let crc = 0xffffffff
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

export interface ZipFileInput {
  name: string
  data: Uint8Array
  lastModified?: Date
}

/**
 * Cria um arquivo ZIP binário a partir de uma lista de arquivos.
 */
export async function createZipFile(files: ZipFileInput[]): Promise<Uint8Array> {
  const fileRecords: Array<{
    nameBytes: Uint8Array
    data: Uint8Array
    crc: number
    compressedSize: number
    uncompressedSize: number
    offset: number
    dosTime: number
    dosDate: number
  }> = []

  let currentOffset = 0
  const localHeaderChunks: Uint8Array[] = []

  const encoder = new TextEncoder()

  for (const file of files) {
    const nameBytes = encoder.encode(file.name)
    const crc = calculateCRC32(file.data)
    const uncompressedSize = file.data.length

    // Tentar compressão deflate se disponível no navegador via CompressionStream
    let compressedData = file.data
    let compressionMethod = 0 // 0 = Store (sem compressão)

    if (typeof CompressionStream !== "undefined" && file.data.length > 64) {
      try {
        const stream = new Blob([file.data.buffer as ArrayBuffer]).stream().pipeThrough(new CompressionStream("deflate-raw"))
        const compBuffer = await new Response(stream).arrayBuffer()
        const compBytes = new Uint8Array(compBuffer)
        if (compBytes.length < uncompressedSize) {
          compressedData = compBytes
          compressionMethod = 8 // Deflate
        }
      } catch {
        // Fallback para Store
        compressedData = file.data
        compressionMethod = 0
      }
    }

    const compressedSize = compressedData.length

    const modDate = file.lastModified || new Date()
    const dosTime =
      ((modDate.getHours() & 0x1f) << 11) |
      ((modDate.getMinutes() & 0x3f) << 5) |
      ((modDate.getSeconds() >> 1) & 0x1f)
    const dosDate =
      (((modDate.getFullYear() - 1980) & 0x7f) << 9) |
      (((modDate.getMonth() + 1) & 0x0f) << 5) |
      (modDate.getDate() & 0x1f)

    // Local Header (30 bytes fixos + nome + dados)
    const localHeader = new Uint8Array(30 + nameBytes.length)
    const lv = new DataView(localHeader.buffer)
    lv.setUint32(0, 0x04034b50, true) // Signature PK\x03\x04
    lv.setUint16(4, 20, true) // Version needed (2.0)
    lv.setUint16(6, 0x0800, true) // General purpose bit flag (UTF-8)
    lv.setUint16(8, compressionMethod, true) // Compression method
    lv.setUint16(10, dosTime, true)
    lv.setUint16(12, dosDate, true)
    lv.setUint32(14, crc, true)
    lv.setUint32(18, compressedSize, true)
    lv.setUint32(22, uncompressedSize, true)
    lv.setUint16(26, nameBytes.length, true)
    lv.setUint16(28, 0, true) // Extra field length
    localHeader.set(nameBytes, 30)

    fileRecords.push({
      nameBytes,
      data: compressedData,
      crc,
      compressedSize,
      uncompressedSize,
      offset: currentOffset,
      dosTime,
      dosDate,
    })

    localHeaderChunks.push(localHeader)
    localHeaderChunks.push(compressedData)

    currentOffset += localHeader.length + compressedData.length
  }

  // Central Directory
  const centralDirOffset = currentOffset
  const centralDirChunks: Uint8Array[] = []
  let centralDirSize = 0

  for (const rec of fileRecords) {
    const cdHeader = new Uint8Array(46 + rec.nameBytes.length)
    const cv = new DataView(cdHeader.buffer)
    cv.setUint32(0, 0x02014b50, true) // Signature PK\x01\x02
    cv.setUint16(4, 20, true) // Made by
    cv.setUint16(6, 20, true) // Version needed
    cv.setUint16(8, 0x0800, true) // UTF-8
    cv.setUint16(10, rec.data === rec.data ? (rec.compressedSize === rec.uncompressedSize ? 0 : 8) : 0, true)
    cv.setUint16(12, rec.dosTime, true)
    cv.setUint16(14, rec.dosDate, true)
    cv.setUint32(16, rec.crc, true)
    cv.setUint32(20, rec.compressedSize, true)
    cv.setUint32(24, rec.uncompressedSize, true)
    cv.setUint16(28, rec.nameBytes.length, true)
    cv.setUint16(30, 0, true) // Extra field length
    cv.setUint16(32, 0, true) // Comment length
    cv.setUint16(34, 0, true) // Disk start
    cv.setUint16(36, 0, true) // Internal attrs
    cv.setUint32(38, 0, true) // External attrs
    cv.setUint32(42, rec.offset, true) // Offset of local header
    cdHeader.set(rec.nameBytes, 46)

    centralDirChunks.push(cdHeader)
    centralDirSize += cdHeader.length
  }

  // End of Central Directory (22 bytes)
  const eocd = new Uint8Array(22)
  const ev = new DataView(eocd.buffer)
  ev.setUint32(0, 0x06054b50, true) // Signature PK\x05\x06
  ev.setUint16(4, 0, true) // Disk number
  ev.setUint16(6, 0, true) // Disk where central directory starts
  ev.setUint16(8, fileRecords.length, true) // Total entries on this disk
  ev.setUint16(10, fileRecords.length, true) // Total entries
  ev.setUint32(12, centralDirSize, true)
  ev.setUint32(16, centralDirOffset, true)
  ev.setUint16(20, 0, true) // Comment length

  // Montar array final
  const totalLength = centralDirOffset + centralDirSize + 22
  const finalZip = new Uint8Array(totalLength)
  let pos = 0

  for (const chunk of localHeaderChunks) {
    finalZip.set(chunk, pos)
    pos += chunk.length
  }
  for (const chunk of centralDirChunks) {
    finalZip.set(chunk, pos)
    pos += chunk.length
  }
  finalZip.set(eocd, pos)

  return finalZip
}

export interface ExtractedZipItem {
  name: string
  size: number
  compressedSize: number
  compressionMethod: number
  data?: Uint8Array
}

/**
 * Lê o diretório central de um arquivo ZIP para inspecionar e extrair conteúdos.
 */
export async function readZipFile(buffer: ArrayBuffer): Promise<ExtractedZipItem[]> {
  const bytes = new Uint8Array(buffer)
  const view = new DataView(buffer)
  const items: ExtractedZipItem[] = []
  const decoder = new TextDecoder("utf-8")

  // Localizar End of Central Directory Record (procurando de trás para frente)
  let eocdOffset = -1
  for (let i = bytes.length - 22; i >= 0; i--) {
    if (view.getUint32(i, true) === 0x06054b50) {
      eocdOffset = i
      break
    }
  }

  if (eocdOffset === -1) {
    throw new Error("Arquivo ZIP inválido ou corrompido.")
  }

  const totalEntries = view.getUint16(eocdOffset + 10, true)
  const centralDirOffset = view.getUint32(eocdOffset + 16, true)

  let pos = centralDirOffset
  for (let i = 0; i < totalEntries && pos < eocdOffset; i++) {
    if (view.getUint32(pos, true) !== 0x02014b50) break

    const compressionMethod = view.getUint16(pos + 10, true)
    const compressedSize = view.getUint32(pos + 20, true)
    const uncompressedSize = view.getUint32(pos + 24, true)
    const fileNameLength = view.getUint16(pos + 28, true)
    const extraLength = view.getUint16(pos + 30, true)
    const commentLength = view.getUint16(pos + 32, true)
    const localHeaderOffset = view.getUint32(pos + 42, true)

    const nameBytes = bytes.subarray(pos + 46, pos + 46 + fileNameLength)
    const name = decoder.decode(nameBytes)

    // Extrair dados se possível
    let data: Uint8Array | undefined
    try {
      const localFileNameLength = view.getUint16(localHeaderOffset + 26, true)
      const localExtraLength = view.getUint16(localHeaderOffset + 28, true)
      const dataStart = localHeaderOffset + 30 + localFileNameLength + localExtraLength
      const rawData = bytes.subarray(dataStart, dataStart + compressedSize)

      if (compressionMethod === 0) {
        data = rawData
      } else if (compressionMethod === 8 && typeof DecompressionStream !== "undefined") {
        const stream = new Blob([rawData.buffer as ArrayBuffer]).stream().pipeThrough(new DecompressionStream("deflate-raw"))
        const decompBuf = await new Response(stream).arrayBuffer()
        data = new Uint8Array(decompBuf)
      }
    } catch {
      // Deixar data indefinido se não for possível descompactar
    }

    items.push({
      name,
      size: uncompressedSize,
      compressedSize,
      compressionMethod,
      data,
    })

    pos += 46 + fileNameLength + extraLength + commentLength
  }

  return items
}
