import React from "react"
import { AlimentacaoConfig, ConfigValues, getDynamicHeader } from "@/lib/calculation"
import { AlaDistribData } from "@/app/actions/alimentacao"

interface AlimentacaoPrintLayoutProps {
  modulo: "ALIMENTACAO" | "CAFE" | "BISCOITO"
  config: AlimentacaoConfig
  globalConfig: ConfigValues
  data: AlaDistribData[]
  summaryMetrics: Record<string, string | number>
}

export function AlimentacaoPrintLayout({
  modulo,
  config,
  globalConfig,
  data,
  summaryMetrics,
}: AlimentacaoPrintLayoutProps) {
  // Calcular totais das colunas
  const totaisCalculados = data.reduce(
    (acc, item) => {
      const computed = config.calcularAla(
        { id: item.id, nome: item.nome, internos: item.internos, dietas: item.dietas },
        globalConfig
      )
      acc.internos += item.internos || 0
      acc.dietas += item.dietas || 0
      acc.caixas += computed.caixas || 0
      acc.normal += computed.normal || 0
      acc.pacotes += computed.pacotes || 0
      acc.unidades += computed.unidades || 0
      acc.garrafas += computed.garrafas || 0
      return acc
    },
    { internos: 0, dietas: 0, caixas: 0, normal: 0, pacotes: 0, unidades: 0, garrafas: 0 }
  )

  const dataAtual = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  return (
    <div className="print-alimentacao-container">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .print-alimentacao-container { display: none; }
            @media print {
              * { box-sizing: border-box !important; }
              @page {
                size: A4 landscape;
                margin: 6mm 8mm 6mm 8mm;
              }
              body {
                background-color: #ffffff !important;
                color: #000000 !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              .print-alimentacao-container {
                display: flex !important;
                flex-direction: column !important;
                width: 100% !important;
                max-width: 281mm !important;
                margin: 0 auto !important;
              }
              .print-header-inst {
                border-bottom: 2px solid #000000;
                padding-bottom: 4px;
                margin-bottom: 6px;
                text-align: center;
              }
              .print-header-inst h2 {
                font-size: 11px;
                font-weight: 800;
                margin: 0 0 2px 0;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: #1f2937;
              }
              .print-header-inst h1 {
                font-size: 15px;
                font-weight: 900;
                margin: 0;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: #000000;
              }
              .print-meta-grid {
                display: grid;
                grid-template-columns: repeat(3, minmax(0, 1fr));
                background-color: #f3f4f6;
                border: 1.5px solid #000000;
                padding: 4px 10px;
                margin-top: 5px;
                font-size: 10.5px;
                font-weight: 700;
              }
              .print-table {
                width: 100%;
                border-collapse: collapse;
                border: 1.5px solid #000000;
                margin-top: 6px;
                font-size: 10.5px;
              }
              .print-table thead {
                display: table-header-group;
              }
              .print-table tr {
                page-break-inside: avoid;
              }
              .print-table th {
                background-color: #e5e7eb !important;
                color: #000000 !important;
                font-weight: 800;
                border: 1.5px solid #000000;
                padding: 4px 8px;
                text-transform: uppercase;
                font-size: 10px;
                text-align: center;
              }
              .print-table td {
                border: 1px solid #4b5563;
                padding: 3.5px 8px;
                vertical-align: middle;
                color: #000000;
              }
              .print-table tr:nth-child(even) td {
                background-color: #f9fafb !important;
              }
              .print-table tfoot td {
                border-top: 2px solid #000000 !important;
                border-bottom: 2px solid #000000 !important;
                background-color: #e5e7eb !important;
                font-weight: 900 !important;
                font-size: 11px !important;
              }
              .print-summary-box {
                margin-top: 8px;
                border: 1.5px solid #000000;
                padding: 6px 10px;
                background-color: #f8fafc;
                page-break-inside: avoid;
              }
              .print-summary-title {
                font-size: 10.5px;
                font-weight: 800;
                text-transform: uppercase;
                border-bottom: 1px solid #94a3b8;
                padding-bottom: 3px;
                margin-bottom: 6px;
                color: #0f172a;
              }
              .print-summary-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
                gap: 8px;
              }
              .print-summary-item {
                background-color: #ffffff;
                border: 1px solid #cbd5e1;
                padding: 5px 8px;
                border-radius: 4px;
                text-align: center;
              }
              .print-summary-label {
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                color: #475569;
                display: block;
              }
              .print-summary-value {
                font-size: 13px;
                font-weight: 900;
                font-family: monospace;
                color: #000000;
                display: block;
              }
            }
          `,
        }}
      />

      {/* Cabeçalho Oficial */}
      <div className="print-header-inst">
        <h2>Governo do Estado do Ceará • Secretaria da Administração Penitenciária</h2>
        <h1>Mapa Operacional de Distribuição • {config.titulo}</h1>
        <div className="print-meta-grid">
          <div>Unidade: <strong>{globalConfig.nomeUnidade || "UPI-4"}</strong></div>
          <div>Localidade: <strong>{globalConfig.localidade || "Itaitinga"}</strong></div>
          <div>Data de Emissão: <strong>{dataAtual}</strong></div>
        </div>
      </div>

      {/* Tabela de Alas */}
      <table className="print-table">
        <thead>
          <tr>
            <th style={{ width: "28%", textAlign: "left" }}>Ala / Pavilhão</th>
            {config.colunas.slice(1).map((col) => (
              <th key={col.key}>
                {getDynamicHeader(col.key, col.header, globalConfig, config.modulo)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={config.colunas.length} style={{ textAlign: "center", padding: "12px" }}>
                Nenhuma ala cadastrada no sistema.
              </td>
            </tr>
          ) : (
            data.map((item) => {
              const computed = config.calcularAla(
                { id: item.id, nome: item.nome, internos: item.internos, dietas: item.dietas },
                globalConfig
              )

              return (
                <tr key={item.id}>
                  <td style={{ fontWeight: "bold", textAlign: "left" }}>{item.nome}</td>
                  <td style={{ textAlign: "center", fontWeight: "bold", fontFamily: "monospace" }}>
                    {item.internos || 0}
                  </td>

                  {modulo === "ALIMENTACAO" && (
                    <>
                      <td style={{ textAlign: "center", fontWeight: "bold", fontFamily: "monospace" }}>
                        {computed.caixas || 0} cx
                      </td>
                      <td style={{ textAlign: "center", fontWeight: "bold", fontFamily: "monospace" }}>
                        {computed.normal || 0} un
                      </td>
                      <td style={{ textAlign: "center", fontWeight: "bold", fontFamily: "monospace" }}>
                        {item.dietas || 0}
                      </td>
                    </>
                  )}

                  {modulo === "CAFE" && (
                    <>
                      <td style={{ textAlign: "center", fontWeight: "bold", fontFamily: "monospace" }}>
                        {computed.pacotes || 0} cx
                      </td>
                      <td style={{ textAlign: "center", fontWeight: "bold", fontFamily: "monospace" }}>
                        {computed.unidades || 0} un
                      </td>
                      <td style={{ textAlign: "center", fontWeight: "bold", fontFamily: "monospace" }}>
                        {computed.garrafas || 0} gf
                      </td>
                    </>
                  )}

                  {modulo === "BISCOITO" && (
                    <>
                      <td style={{ textAlign: "center", fontWeight: "bold", fontFamily: "monospace" }}>
                        {computed.pacotes || 0} cx
                      </td>
                      <td style={{ textAlign: "center", fontWeight: "bold", fontFamily: "monospace" }}>
                        {computed.unidades || 0} un
                      </td>
                      <td style={{ textAlign: "center", fontWeight: "bold", fontFamily: "monospace" }}>
                        {computed.garrafas || 0} gf
                      </td>
                    </>
                  )}
                </tr>
              )
            })
          )}
        </tbody>
        <tfoot>
          <tr>
            <td style={{ textAlign: "left" }}>TOTAIS GERAIS:</td>
            <td style={{ textAlign: "center", fontFamily: "monospace" }}>
              {totaisCalculados.internos}
            </td>
            {modulo === "ALIMENTACAO" && (
              <>
                <td style={{ textAlign: "center", fontFamily: "monospace" }}>
                  {totaisCalculados.caixas} cx
                </td>
                <td style={{ textAlign: "center", fontFamily: "monospace" }}>
                  {totaisCalculados.normal} un
                </td>
                <td style={{ textAlign: "center", fontFamily: "monospace" }}>
                  {totaisCalculados.dietas}
                </td>
              </>
            )}
            {modulo === "CAFE" && (
              <>
                <td style={{ textAlign: "center", fontFamily: "monospace" }}>
                  {totaisCalculados.pacotes} cx
                </td>
                <td style={{ textAlign: "center", fontFamily: "monospace" }}>
                  {totaisCalculados.unidades} un
                </td>
                <td style={{ textAlign: "center", fontFamily: "monospace" }}>
                  {totaisCalculados.garrafas} gf
                </td>
              </>
            )}
            {modulo === "BISCOITO" && (
              <>
                <td style={{ textAlign: "center", fontFamily: "monospace" }}>
                  {totaisCalculados.pacotes} cx
                </td>
                <td style={{ textAlign: "center", fontFamily: "monospace" }}>
                  {totaisCalculados.unidades} un
                </td>
                <td style={{ textAlign: "center", fontFamily: "monospace" }}>
                  {totaisCalculados.garrafas} gf
                </td>
              </>
            )}
          </tr>
        </tfoot>
      </table>

      {/* Resumo Consolidado de Entrega */}
      <div className="print-summary-box">
        <div className="print-summary-title">Resumo Operacional de Entrega e Conferência</div>
        <div className="print-summary-grid">
          {Object.entries(summaryMetrics).map(([key, val]) => (
            <div key={key} className="print-summary-item">
              <span className="print-summary-label">{key}</span>
              <span className="print-summary-value">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
