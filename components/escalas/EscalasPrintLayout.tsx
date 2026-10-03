import React, { Fragment } from 'react';
import type { Policial } from './types';

interface EscalaState {
  chefe?: string
  equipe?: string
  dataEscala?: string
  numFaixas: number
  faixasHorario: Record<number, { inicio: string; fim: string }>
  postosConfig: Record<string, unknown>
  estado: Record<number, Record<string, string[]>>
  independentEstado: Record<string, Record<number, string[]>>
  independentHorarios: Record<string, Record<number, string>>
  parseToken: (tid: string) => (Policial & { slotIdx: number }) | null
}

type EscalasPrintLayoutProps = {
  tipo: string;
  state: EscalaState;
  nomeUnidade: string;
  localidade: string;
  chefeMatricula: string;
};

export default function EscalasPrintLayout({
  tipo,
  state,
  nomeUnidade,
  localidade,
  chefeMatricula,
}: EscalasPrintLayoutProps) {
  return (
    <div className="print-container">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .print-container { display: none; }
            @media print {
              * { box-sizing: border-box !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
              [data-sonner-toaster], [data-sonner-toast], section[aria-label*="Notification" i], section[aria-label*="Notificação" i], [role="alert"], [role="status"] { display: none !important; }
              @page { size: A4 portrait; margin: 6mm 8mm 6mm 8mm; }
              body { background-color: #ffffff !important; color: #111827 !important; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important; font-size: 11px !important; margin: 0 !important; padding: 0 !important; }
              .print-container { display: flex !important; flex-direction: column !important; width: 100% !important; max-width: 194mm !important; margin: 0 auto !important; padding: 0 !important; box-sizing: border-box !important; }
              .print-spacer { flex-grow: 1 !important; min-height: 4px !important; }
              .print-header { border-bottom: 2px solid #000000 !important; padding-bottom: 4px !important; margin-bottom: 6px !important; text-align: center !important; }
              .print-header h3 { font-size: 11px !important; font-weight: 700 !important; color: #000000 !important; margin: 0 0 2px 0 !important; text-transform: uppercase !important; }
              .print-header h4 { font-size: 15px !important; font-weight: 800 !important; color: #000000 !important; margin: 0 !important; letter-spacing: 0.5px !important; }
              .print-meta-grid { display: grid !important; grid-template-columns: repeat(3, minmax(0, 1fr)) !important; border: 1.5px solid #000000 !important; background-color: #f3f4f6 !important; margin-top: 4px !important; padding: 4px 8px !important; border-radius: 2px !important; text-align: left !important; font-size: 10px !important; }
              .print-section-title { font-size: 11px !important; font-weight: 700 !important; text-transform: uppercase !important; color: #000000 !important; border-left: 3px solid #000000 !important; padding-left: 6px !important; margin-bottom: 3px !important; margin-top: 6px !important; letter-spacing: 0.25px !important; }
              .print-table { width: 100% !important; border-collapse: collapse !important; margin-bottom: 6px !important; font-size: 10.5px !important; border: 1.5px solid #000000 !important; }
              .print-table thead { display: table-header-group !important; }
              .print-table tr { page-break-inside: avoid !important; }
              .print-table th { background-color: #e5e7eb !important; color: #000000 !important; font-weight: 800 !important; border: 1.5px solid #000000 !important; padding: 3.5px 5px !important; text-transform: uppercase !important; font-size: 9.5px !important; letter-spacing: 0.2px !important; text-align: center !important; }
              .print-table td { border: 1px solid #000000 !important; padding: 3px 4px !important; vertical-align: middle !important; text-align: center; color: #000000 !important; }
              .print-cell-active { background-color: #ffffff !important; padding: 0 !important; }
              .print-cell-group { display: flex !important; flex-direction: row !important; align-items: center !important; justify-content: center !important; gap: 6px !important; flex-wrap: wrap !important; }
              .print-cell-divider { width: 1px !important; height: 12px !important; background-color: #000000 !important; align-self: center !important; }
              .print-cell-active div:first-child { font-weight: 800 !important; color: #000000 !important; font-size: 11px !important; }
              .print-cell-subtext { font-size: 8.5px !important; color: #000000 !important; font-family: monospace !important; margin-top: 0.5px !important; }
              .print-cell-empty { color: #6b7280 !important; font-style: italic !important; font-size: 9.5px !important; }
              .print-signatures { margin-top: 10px !important; display: flex !important; justify-content: center !important; text-align: center !important; page-break-inside: avoid !important; font-size: 10px !important; }
              .print-signature-line { border-top: 1.5px solid #000000 !important; width: 260px !important; margin: 16px auto 3px auto !important; }
            }
          `
        }}
      />

      <div className="print-header">
        <h3>{nomeUnidade} — Localidade: {localidade}</h3>
        <h4>ESCALA DE PLANTÃO</h4>
        <div className="print-meta-grid uppercase font-semibold">
          <div><strong>Chefe de Equipe:</strong>{' '}{state.chefe ? `${state.chefe}${chefeMatricula ? ` (${chefeMatricula})` : ''}` : '______________________'}</div>
          <div className="text-center"><strong>Equipe:</strong>{' '}{state.equipe || '______________________'}</div>
          <div className="text-right"><strong>Data do Plantão:</strong>{' '}{state.dataEscala ? new Date(state.dataEscala + "T00:00:00").toLocaleDateString("pt-BR") : "____/____/______"}</div>
        </div>
      </div>

      <div>
        <h3 className="print-section-title">Postos Operacionais</h3>
        <table className="print-table">
          <thead>
            <tr>
              <th style={{ width: "20%" }}>Posto / Turno</th>
              {Array.from({ length: state.numFaixas }).map((_, f) => {
                const time = state.faixasHorario[f] || { inicio: "--:--", fim: "--:--" };
                return <th key={f}>Turno {f + 1} ({time.inicio} - {time.fim})</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {Object.keys(state.postosConfig).map((posto) => (
              <tr key={posto}>
                <td className="font-bold text-slate-800 text-center uppercase">{posto}</td>
                {Array.from({ length: state.numFaixas }).map((_, f) => {
                  const tokens = state.estado[f]?.[posto] || [];
                  return (
                    <td key={f} className="text-center">
                      {tokens.length > 0 ? (
                        <div className="print-cell-group">
                          {tokens.map((tid: string, idx: number) => {
                            const pp = state.parseToken(tid);
                            if (!pp) return null;
                            return (
                              <Fragment key={tid}>
                                {idx > 0 && <div className="print-cell-divider" />}
                                <div className="print-cell-active">
                                  <div className="font-semibold text-slate-900">{pp.qra || pp.nome}</div>
                                  <div className="print-cell-subtext">Matrícula: {pp.matricula}</div>
                                </div>
                              </Fragment>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="print-cell-empty">— VAGO —</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {tipo === "noturna" && (
        <div>
          <h3 className="print-section-title">Postos de Segurança (Guaritas Operacionais)</h3>
          <table className="print-table">
            <thead>
              <tr>
                <th style={{ width: "20%" }}>Posto</th>
                <th style={{ width: "20%" }}>Turno 1</th>
                <th style={{ width: "20%" }}>Turno 2</th>
                <th style={{ width: "20%" }}>Turno 3</th>
                <th style={{ width: "20%" }}>Turno 4</th>
              </tr>
            </thead>
            <tbody>
              {["G1", "G3", "G5", "G6"].map((gId) => (
                <tr key={gId}>
                  <td className="font-bold text-slate-800 text-center uppercase">{gId}</td>
                  {Array.from({ length: 4 }).map((_, slotIdx) => {
                    const timeVal = state.independentHorarios[gId]?.[slotIdx] || "00:00 - 06:00";
                    const tokens = state.independentEstado[gId]?.[slotIdx] || [];
                    return (
                      <td key={slotIdx} className="text-center">
                        <div className="text-[7.5px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1">{timeVal}</div>
                        {tokens.length > 0 ? (
                          <div className="print-cell-group">
                            {tokens.map((tid: string, idx: number) => {
                              const pp = state.parseToken(tid);
                              if (!pp) return null;
                              return (
                                <Fragment key={tid}>
                                  {idx > 0 && <div className="print-cell-divider" />}
                                  <div className="print-cell-active">
                                    <div className="font-semibold text-slate-900">{pp.qra || pp.nome}</div>
                                    <div className="print-cell-subtext">{pp.matricula}</div>
                                  </div>
                                </Fragment>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="print-cell-empty">— VAGO —</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tipo === "noturna" && (
        <div>
          <h3 className="print-section-title">Postos de Segurança (Tenda Operacional)</h3>
          <table className="print-table">
            <thead>
              <tr>
                <th style={{ width: "20%" }}>Posto</th>
                <th style={{ width: "20%" }}>Turno 1</th>
                <th style={{ width: "20%" }}>Turno 2</th>
                <th style={{ width: "20%" }}>Turno 3</th>
                <th style={{ width: "20%" }}>Turno 4</th>
              </tr>
            </thead>
            <tbody>
              {["TENDA ABC"].map((gId) => (
                <tr key={gId}>
                  <td className="font-bold text-slate-800 text-center uppercase">{gId}</td>
                  {Array.from({ length: 4 }).map((_, slotIdx) => {
                    const timeVal = state.independentHorarios[gId]?.[slotIdx] || "00:00 - 06:00";
                    const tokens = state.independentEstado[gId]?.[slotIdx] || [];
                    return (
                      <td key={slotIdx} className="text-center">
                        <div className="text-[7.5px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1">{timeVal}</div>
                        {tokens.length > 0 ? (
                          <div className="print-cell-group">
                            {tokens.map((tid: string, idx: number) => {
                              const pp = state.parseToken(tid);
                              if (!pp) return null;
                              return (
                                <Fragment key={tid}>
                                  {idx > 0 && <div className="print-cell-divider" />}
                                  <div className="print-cell-active">
                                    <div className="font-semibold text-slate-900">{pp.qra || pp.nome}</div>
                                    <div className="print-cell-subtext">{pp.matricula}</div>
                                  </div>
                                </Fragment>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="print-cell-empty">— VAGO —</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="print-spacer" />

      <div className="print-signatures">
        <div>
          <div className="print-signature-line" />
          <div className="font-bold text-slate-800 uppercase text-xs">{state.chefe || "______________________"}</div>
          {chefeMatricula && (
            <div className="text-[9.5px] text-slate-700 font-mono font-bold mt-0.5 uppercase">MATRÍCULA: {chefeMatricula}</div>
          )}
          <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1">CHEFE DE EQUIPE (UPI-4)</div>
        </div>
      </div>
    </div>
  );
}
