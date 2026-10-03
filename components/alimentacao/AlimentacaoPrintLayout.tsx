import React from "react"
import { AlimentacaoConfig, ConfigValues } from "@/lib/calculation"
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

  const horaAtual = new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="print-alimentacao-container">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .print-alimentacao-container { display: none; }
            @media print {
              * {
                box-sizing: border-box !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              [data-sonner-toaster], [data-sonner-toast], section[aria-label*="Notification" i], section[aria-label*="Notificação" i], [role="alert"], [role="status"] {
                display: none !important;
              }
              @page {
                size: A4 landscape;
                margin: 7mm 9mm 7mm 9mm;
              }
              body {
                background-color: #ffffff !important;
                color: #0f172a !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              .print-alimentacao-container {
                display: flex !important;
                flex-direction: column !important;
                width: 100% !important;
                max-width: 279mm !important;
                margin: 0 auto !important;
              }

              /* Cabeçalho Limpo & Institucional */
              .print-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 2px solid #0f172a;
                padding-bottom: 6px;
                margin-bottom: 8px;
              }
              .print-header-left {
                display: flex;
                align-items: center;
                gap: 10px;
              }
              .print-badge-unit {
                padding: 5px 10px;
                background: #0f172a !important;
                color: #ffffff !important;
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 900;
                font-size: 12px;
                letter-spacing: 0.5px;
                white-space: nowrap;
              }
              .print-title {
                font-size: 13.5px;
                font-weight: 900;
                color: #0f172a;
                margin: 0;
                text-transform: uppercase;
                letter-spacing: 0.3px;
              }
              .print-sub {
                font-size: 8.5px;
                font-weight: 700;
                color: #64748b;
                margin: 0;
                text-transform: uppercase;
              }
              .print-meta-chips {
                display: flex;
                align-items: center;
                gap: 6px;
              }
              .print-chip {
                background: #f1f5f9 !important;
                border: 1px solid #cbd5e1;
                border-radius: 6px;
                padding: 3px 8px;
                font-size: 9px;
                font-weight: 700;
                color: #334155;
              }
              .print-chip strong {
                color: #0f172a;
              }

              /* 4 Cards Superiores com Hierarquia Visual Refinada */
              .print-cards-row {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 8px;
                margin-bottom: 8px;
              }
              .print-kpi-card {
                border: 1px solid #cbd5e1;
                border-radius: 8px;
                padding: 6px 12px;
                background: #ffffff;
                display: flex;
                flex-direction: column;
                justify-content: center;
              }
              .print-kpi-card.hero {
                border-left: 5px solid #0f172a;
                background: #f8fafc !important;
              }
              .print-kpi-card.filled {
                background: #f1f5f9 !important;
                border-color: #94a3b8;
              }
              .print-kpi-value {
                font-size: 18px;
                font-weight: 900;
                font-family: monospace;
                color: #0f172a;
                line-height: 1.1;
              }
              .print-kpi-label {
                font-size: 8.5px;
                font-weight: 800;
                text-transform: uppercase;
                color: #475569;
                letter-spacing: 0.4px;
              }

              /* Tabela Limpa, sem poluição de pílulas */
              .print-table-box {
                border: 1px solid #cbd5e1;
                border-radius: 8px;
                overflow: hidden;
                background: #ffffff;
              }
              .print-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 10px;
              }
              .print-table thead {
                background: #f1f5f9 !important;
                border-bottom: 1.5px solid #0f172a;
              }
              .print-table th {
                padding: 6px 8px;
                font-size: 9px;
                font-weight: 900;
                text-transform: uppercase;
                letter-spacing: 0.3px;
                color: #334155;
                border-right: 1px solid #e2e8f0;
              }
              .print-table th:last-child {
                border-right: none;
              }
              .print-table td {
                padding: 6.5px 8px;
                border-bottom: 1px solid #e2e8f0;
                border-right: 1px solid #e2e8f0;
                vertical-align: middle;
                color: #0f172a;
              }
              .print-table td:last-child {
                border-right: none;
              }
              .print-table tr:nth-child(even) td {
                background-color: #f8fafc !important;
              }
              .print-table tr {
                page-break-inside: avoid;
              }

              /* Estilização da Coluna Ala */
              .ala-col {
                display: flex;
                align-items: center;
                gap: 8px;
              }
              .ala-badge {
                width: 22px;
                height: 22px;
                border-radius: 5px;
                background: #0f172a !important;
                color: #ffffff !important;
                font-weight: 900;
                font-size: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                shrink-0;
              }
              .ala-text-title {
                font-weight: 900;
                font-size: 11px;
                color: #0f172a;
                letter-spacing: 0.2px;
              }

              /* Números Limpos com Tipografia Clara (Sem bolhas pesadas) */
              .cell-mono {
                font-family: monospace;
                font-size: 11px;
                font-weight: 800;
                color: #0f172a;
              }
              .cell-unit {
                font-size: 8.5px;
                font-weight: 700;
                color: #64748b;
                margin-left: 2px;
                text-transform: lowercase;
              }

              /* Caixa de Visto Discreta e Elegante */
              .visto-box {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 5px;
                font-size: 8.5px;
                font-weight: 700;
                color: #475569;
              }
              .visto-square {
                width: 13px;
                height: 13px;
                border: 1px solid #475569;
                border-radius: 3px;
                background: #ffffff;
              }

              /* Rodapé da Tabela */
              .print-table tfoot td {
                background: #e2e8f0 !important;
                font-weight: 900 !important;
                font-size: 10.5px !important;
                border-top: 2px solid #0f172a !important;
                border-bottom: none !important;
                padding: 6px 8px !important;
                color: #0f172a !important;
              }

              /* Rodapé: Resumo + Horários com Linhas Finas Executivas */
              .print-bottom-grid {
                display: grid;
                grid-template-columns: 1.8fr 1.2fr;
                gap: 8px;
                margin-top: 8px;
                page-break-inside: avoid;
              }
              .print-summary-panel {
                border: 1px solid #cbd5e1;
                border-radius: 8px;
                padding: 7px 12px;
                background: #ffffff;
              }
              .print-panel-title {
                font-size: 9px;
                font-weight: 900;
                text-transform: uppercase;
                color: #0f172a;
                border-bottom: 1px solid #e2e8f0;
                padding-bottom: 3px;
                margin-bottom: 6px;
                letter-spacing: 0.3px;
              }
              .print-summary-boxes {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 6px;
              }
              .print-sum-card {
                background: #f8fafc !important;
                border: 1px solid #cbd5e1;
                border-radius: 6px;
                padding: 5px 8px;
                text-align: center;
              }
              .print-sum-label {
                display: block;
                font-size: 7.5px;
                font-weight: 800;
                color: #64748b;
                text-transform: uppercase;
              }
              .print-sum-val {
                display: block;
                font-size: 13px;
                font-weight: 900;
                font-family: monospace;
                color: #0f172a;
              }

              /* Painel de Horários com Formato de Linha Fina Executiva */
              .print-timing-panel {
                border: 1px solid #cbd5e1;
                border-radius: 8px;
                padding: 7px 12px;
                background: #ffffff;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
              }
              .print-timing-list {
                display: flex;
                flex-direction: column;
                gap: 5px;
              }
              .print-timing-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 2px 0;
              }
              .print-timing-label {
                font-size: 9px;
                font-weight: 800;
                color: #334155;
                text-transform: uppercase;
              }
              .print-timing-line {
                font-family: monospace;
                font-size: 11px;
                font-weight: 800;
                letter-spacing: 2px;
                color: #64748b;
                border-bottom: 1px dashed #475569;
                padding: 0 12px;
                min-width: 90px;
                text-align: center;
              }
            }
          `,
        }}
      />

      {/* Cabeçalho */}
      <div className="print-header">
        <div className="print-header-left">
          <div className="print-badge-unit">{globalConfig.nomeUnidade || "UPI-4"}</div>
          <div>
            <h1 className="print-title">Mapa de Distribuição • {config.titulo}</h1>
            <p className="print-sub">Secretaria da Administração Penitenciária • SAP Ceará</p>
          </div>
        </div>

        <div className="print-meta-chips">
          <div className="print-chip">
            Local: <strong>{globalConfig.localidade || "Itaitinga"}</strong>
          </div>
          <div className="print-chip">
            Emissão: <strong>{dataAtual} às {horaAtual}</strong>
          </div>
        </div>
      </div>

      {/* 4 Cards de Métricas Superiores */}
      <div className="print-cards-row">
        <div className="print-kpi-card hero">
          <div className="print-kpi-value">
            {data.length.toString().padStart(2, "0")}
          </div>
          <div className="print-kpi-label">Alas Ativas</div>
        </div>

        <div className="print-kpi-card filled">
          <div className="print-kpi-value">{totaisCalculados.internos}</div>
          <div className="print-kpi-label">Total Internos</div>
        </div>

        <div className="print-kpi-card filled">
          <div className="print-kpi-value">
            {modulo === "ALIMENTACAO" && `${totaisCalculados.caixas} cx`}
            {modulo === "CAFE" && `${totaisCalculados.pacotes} pct`}
            {modulo === "BISCOITO" && `${totaisCalculados.pacotes} pct`}
          </div>
          <div className="print-kpi-label">
            {modulo === "ALIMENTACAO" && "Caixas Fechadas"}
            {modulo === "CAFE" && "Pacotes de Pães"}
            {modulo === "BISCOITO" && "Pacotes Biscoito"}
          </div>
        </div>

        <div className="print-kpi-card filled">
          <div className="print-kpi-value">
            {modulo === "ALIMENTACAO"
              ? `${totaisCalculados.dietas} un`
              : `${totaisCalculados.garrafas} gf`}
          </div>
          <div className="print-kpi-label">
            {modulo === "ALIMENTACAO" ? "Dietas Especiais" : "Garrafas Térmicas"}
          </div>
        </div>
      </div>

      {/* Tabela de Distribuição Clean */}
      <div className="print-table-box">
        <table className="print-table">
          <thead>
            <tr>
              <th style={{ width: "4%", textAlign: "center" }}>#</th>
              <th style={{ width: "28%", textAlign: "left" }}>Ala / Pavilhão</th>
              <th style={{ width: "12%", textAlign: "center" }}>Internos</th>
              
              {modulo === "ALIMENTACAO" && (
                <>
                  <th style={{ width: "16%", textAlign: "center" }}>
                    Caixas ({globalConfig.alimentacaoCaixaCapacidade}un)
                  </th>
                  <th style={{ width: "14%", textAlign: "center" }}>
                    Quentinhas Avulsas
                  </th>
                  <th style={{ width: "12%", textAlign: "center" }}>
                    Dietas
                  </th>
                </>
              )}

              {modulo === "CAFE" && (
                <>
                  <th style={{ width: "16%", textAlign: "center" }}>
                    Pacotes ({globalConfig.cafeCapacitePacote}un)
                  </th>
                  <th style={{ width: "14%", textAlign: "center" }}>
                    Pães Avulsos
                  </th>
                  <th style={{ width: "12%", textAlign: "center" }}>
                    Garrafas ({globalConfig.cafeLitrosPorGarrafa}L)
                  </th>
                </>
              )}

              {modulo === "BISCOITO" && (
                <>
                  <th style={{ width: "16%", textAlign: "center" }}>
                    Pacotes ({globalConfig.biscoitoCapacidadePacote}un)
                  </th>
                  <th style={{ width: "14%", textAlign: "center" }}>
                    Biscoitos Avulsos
                  </th>
                  <th style={{ width: "12%", textAlign: "center" }}>
                    Garrafas Suco
                  </th>
                </>
              )}

              <th style={{ width: "14%", textAlign: "center" }}>Conferência</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "16px" }}>
                  Nenhuma ala registrada no sistema.
                </td>
              </tr>
            ) : (
              data.map((item, idx) => {
                const computed = config.calcularAla(
                  { id: item.id, nome: item.nome, internos: item.internos, dietas: item.dietas },
                  globalConfig
                )
                const initial = item.nome.replace(/[^a-zA-Z0-9]/g, "").charAt(0).toUpperCase() || "A"

                return (
                  <tr key={item.id}>
                    {/* # Index */}
                    <td style={{ textAlign: "center", fontWeight: "700", color: "#64748b" }}>
                      {idx + 1}
                    </td>

                    {/* Ala */}
                    <td>
                      <div className="ala-col">
                        <div className="ala-badge">{initial}</div>
                        <div className="ala-text-title">{item.nome}</div>
                      </div>
                    </td>

                    {/* Internos */}
                    <td style={{ textAlign: "center" }}>
                      <span className="cell-mono">{item.internos || 0}</span>
                    </td>

                    {/* Colunas Alimentação */}
                    {modulo === "ALIMENTACAO" && (
                      <>
                        <td style={{ textAlign: "center" }}>
                          <span className="cell-mono">{computed.caixas || 0}</span>
                          <span className="cell-unit">cx</span>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <span className="cell-mono">{computed.normal || 0}</span>
                          <span className="cell-unit">un</span>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <span className="cell-mono">{item.dietas || 0}</span>
                        </td>
                      </>
                    )}

                    {/* Colunas Café */}
                    {modulo === "CAFE" && (
                      <>
                        <td style={{ textAlign: "center" }}>
                          <span className="cell-mono">{computed.pacotes || 0}</span>
                          <span className="cell-unit">cx</span>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <span className="cell-mono">{computed.unidades || 0}</span>
                          <span className="cell-unit">un</span>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <span className="cell-mono">{computed.garrafas || 0}</span>
                          <span className="cell-unit">gf</span>
                        </td>
                      </>
                    )}

                    {/* Colunas Biscoito */}
                    {modulo === "BISCOITO" && (
                      <>
                        <td style={{ textAlign: "center" }}>
                          <span className="cell-mono">{computed.pacotes || 0}</span>
                          <span className="cell-unit">cx</span>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <span className="cell-mono">{computed.unidades || 0}</span>
                          <span className="cell-unit">un</span>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <span className="cell-mono">{computed.garrafas || 0}</span>
                          <span className="cell-unit">gf</span>
                        </td>
                      </>
                    )}

                    {/* Visto / Conferência Manual */}
                    <td style={{ textAlign: "center" }}>
                      <div className="visto-box">
                        <div className="visto-square" />
                        <span>Visto</span>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} style={{ textAlign: "left", paddingLeft: "10px" }}>
                TOTAIS GERAIS:
              </td>
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

              <td style={{ textAlign: "center", fontSize: "11px", color: "#64748b" }}>—</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Painel Inferior: Resumo + Horários */}
      <div className="print-bottom-grid">
        <div className="print-summary-panel">
          <div className="print-panel-title">
            Resumo Operacional de Distribuição
          </div>
          <div className="print-summary-boxes">
            {Object.entries(summaryMetrics).map(([key, val]) => (
              <div key={key} className="print-sum-card">
                <span className="print-sum-label">{key}</span>
                <span className="print-sum-val">{val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="print-timing-panel">
          <div className="print-panel-title">
            Horários da Distribuição
          </div>
          <div className="print-timing-list">
            <div className="print-timing-row">
              <span className="print-timing-label">Hora da Chegada:</span>
              <span className="print-timing-line">____ : ____</span>
            </div>
            <div className="print-timing-row">
              <span className="print-timing-label">Hora Inicial:</span>
              <span className="print-timing-line">____ : ____</span>
            </div>
            <div className="print-timing-row">
              <span className="print-timing-label">Hora Término:</span>
              <span className="print-timing-line">____ : ____</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
