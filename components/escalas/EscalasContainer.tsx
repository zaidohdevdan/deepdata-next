"use client"

import { Fragment } from "react"
import { useEscalaState } from "./useEscalaState"
import EscalasHeader from "./EscalasHeader"
import EfetivoChecklist from "./EfetivoChecklist"
import PostosGrid from "./PostosGrid"
import IndependentPostsGrid from "./IndependentPostsGrid"
import { EscalasContainerProps } from "./types"

export default function EscalasContainer({
  tipo,
  initialPoliciaisFixos,
  currentUser,
  equipeAlfa,
  equipeBravo,
  equipeEcho,
  equipeFox,
  nomeUnidade = "UPI-4",
  localidade = "Itaitinga",
  initialPostosConfig = "",
  initialHoraInicio = "",
  initialHoraFim = "",
  initialNumFaixas = ""
}: EscalasContainerProps) {
  
  const state = useEscalaState({
    tipo,
    initialPoliciaisFixos,
    currentUser,
    equipeAlfa,
    equipeBravo,
    equipeEcho,
    equipeFox,
    initialPostosConfig,
    initialHoraInicio,
    initialHoraFim,
    initialNumFaixas
  })

  const selectedChefeObj = state.availableChefes.find(c => c.nome === state.chefe)
  const chefeMatricula = selectedChefeObj?.matricula || ""

  return (
    <div className="space-y-6">
      {/* -------------------- INTERACTIVE SCREEN UI (HIDDEN ON PRINT) -------------------- */}
      <div className="print:hidden space-y-6">
        <EscalasHeader
          tipo={tipo}
          chefe={state.chefe}
          setChefe={state.setChefe}
          isManualChefe={state.isManualChefe}
          setIsManualChefe={state.setIsManualChefe}
          equipe={state.equipe}
          setEquipe={state.setEquipe}
          dataEscala={state.dataEscala}
          setDataEscala={state.setDataEscala}
          horaInicio={state.horaInicio}
          setHoraInicio={state.setHoraInicio}
          horaFim={state.horaFim}
          setHoraFim={state.setHoraFim}
          numFaixas={state.numFaixas}
          setNumFaixas={state.setNumFaixas}
          availableChefes={state.availableChefes}
          showConfig={state.showConfig}
          setShowConfig={state.setShowConfig}
          handleSave={state.handleSave}
          handleClear={state.handleClear}
          showClearConfirm={state.showClearConfirm}
          setShowClearConfirm={state.setShowClearConfirm}
          confirmClear={state.confirmClear}
          newPostName={state.newPostName}
          setNewPostName={state.setNewPostName}
          newPostLimit={state.newPostLimit}
          setNewPostLimit={state.setNewPostLimit}
          handleAddPost={state.handleAddPost}
          handleDeletePost={state.handleDeletePost}
          postosConfig={state.postosConfig}
          fixedMatricula={state.fixedMatricula}
          setFixedMatricula={state.setFixedMatricula}
          fixedPosto={state.fixedPosto}
          setFixedPosto={state.setFixedPosto}
          fixedFaixa={state.fixedFaixa}
          setFixedFaixa={state.setFixedFaixa}
          handleAddFixedOfficer={state.handleAddFixedOfficer}
          handleRemoveFixedOfficer={state.handleRemoveFixedOfficer}
          policiaisFixos={state.policiaisFixos}
          basePoliciais={state.basePoliciais}
          handleSaveScaleSettings={state.handleSaveScaleSettings}
          isSavingConfig={state.isSavingConfig}
        />

        <EfetivoChecklist
          basePoliciais={state.basePoliciais}
          setBasePoliciais={state.setBasePoliciais}
          presenceMap={state.presenceMap}
          setPresenceMap={state.setPresenceMap}
          currentUser={currentUser}
          equipeAlfa={equipeAlfa}
          equipeBravo={equipeBravo}
          equipeEcho={equipeEcho}
          equipeFox={equipeFox}
          selectedForDeletion={state.selectedForDeletion}
          setSelectedForDeletion={state.setSelectedForDeletion}
          handleDeleteSelectedOfficers={state.handleDeleteSelectedOfficers}
          editingOfficerMatricula={state.editingOfficerMatricula}
          setEditingOfficerMatricula={state.setEditingOfficerMatricula}
          editOfficerNome={state.editOfficerNome}
          setEditOfficerNome={state.setEditOfficerNome}
          editOfficerMatricula={state.editOfficerMatricula}
          setEditOfficerMatricula={state.setEditOfficerMatricula}
          handleSaveEditOfficer={state.handleSaveEditOfficer}
          handleStartEditOfficer={state.handleStartEditOfficer}
          handleDeleteOfficer={state.handleDeleteOfficer}
          newPPNome={state.newPPNome}
          setNewPPNome={state.setNewPPNome}
          newPPMatricula={state.newPPMatricula}
          setNewPPMatricula={state.setNewPPMatricula}
          handleAddPolicial={state.handleAddPolicial}
          handleCSVUpload={state.handleCSVUpload}
        />

        {state.basePoliciais.length > 0 && (
          <>
            <PostosGrid
              faixasHorario={state.faixasHorario}
              basePoliciais={state.basePoliciais}
              presenceMap={state.presenceMap}
              estado={state.estado}
              postosConfig={state.postosConfig}
              policiaisFixos={state.policiaisFixos}
              poolSearch={state.poolSearch}
              setPoolSearch={state.setPoolSearch}
              poolFilter={state.poolFilter}
              setPoolFilter={state.setPoolFilter}
              isDragOverPool={state.isDragOverPool}
              setIsDragOverPool={state.setIsDragOverPool}
              numFaixas={state.numFaixas}
              autoOcupar={state.autoOcupar}
              handleClear={state.handleClear}
              handleSave={state.handleSave}
              handleDragStart={state.handleDragStart}
              handleDragOver={state.handleDragOver}
              handleDrop={state.handleDrop}
              handleDropIntoGlobalPool={state.handleDropIntoGlobalPool}
              handleDuplicateToken={state.handleDuplicateToken}
              handleRemoveToken={state.handleRemoveToken}
              parseToken={state.parseToken}
              tipo={tipo}
            />

            <IndependentPostsGrid
              tipo={tipo}
              independentHorarios={state.independentHorarios}
              setIndependentHorarios={state.setIndependentHorarios}
              independentEstado={state.independentEstado}
              policiaisFixos={state.policiaisFixos}
              handleDragStart={state.handleDragStart}
              handleDragOver={state.handleDragOver}
              handleDrop={state.handleDrop}
              handleDuplicateToken={state.handleDuplicateToken}
              handleRemoveToken={state.handleRemoveToken}
              parseToken={state.parseToken}
            />
          </>
        )}
      </div>

      {/* -------------------- PREMIUM TABULAR PRINT LAYOUT (HIDDEN ON SCREEN, ONLY SHOWN ON PRINT) -------------------- */}
      <div className="print-container">
        <style dangerouslySetInnerHTML={{ __html: `
          .print-container {
            display: none;
          }
          @media print {
            * {
              box-sizing: border-box !important;
            }
            @page {
              size: A4 portrait;
              margin: 6mm 8mm 6mm 8mm;
            }
            body {
              background-color: #ffffff !important;
              color: #111827 !important;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
              font-size: 12px !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            .print-container {
              display: flex !important;
              flex-direction: column !important;
              min-height: 268mm !important;
              width: 194mm !important;
              max-width: 194mm !important;
              margin: 0 auto !important;
              padding: 0 !important;
              box-sizing: border-box !important;
            }
            .print-spacer {
              flex-grow: 1 !important;
            }
            .print-header {
              border-bottom: 2.5px solid #000000 !important;
              padding-bottom: 6px !important;
              margin-bottom: 10px !important;
              text-align: center !important;
            }
            .print-header h3 {
              font-size: 12px !important;
              font-weight: 700 !important;
              color: #000000 !important;
              margin: 0 0 2px 0 !important;
              text-transform: uppercase !important;
            }
            .print-header h4 {
              font-size: 16px !important;
              font-weight: 800 !important;
              color: #000000 !important;
              margin: 0 !important;
              letter-spacing: 0.5px !important;
            }
            .print-meta-grid {
              display: grid !important;
              grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
              border: 2px solid #000000 !important;
              background-color: #f3f4f6 !important;
              margin-top: 6px !important;
              padding: 6px 10px !important;
              border-radius: 2px !important;
              text-align: left !important;
              font-size: 11px !important;
            }
            .print-section-title {
              font-size: 12px !important;
              font-weight: 700 !important;
              text-transform: uppercase !important;
              color: #000000 !important;
              border-left: 3px solid #000000 !important;
              padding-left: 6px !important;
              margin-bottom: 4px !important;
              margin-top: 8px !important;
              letter-spacing: 0.25px !important;
            }
            .print-table {
              width: 100% !important;
              border-collapse: collapse !important;
              margin-bottom: 8px !important;
              font-size: 11.5px !important;
              border: 2px solid #000000 !important;
            }
            .print-table th {
              background-color: #e5e7eb !important;
              color: #000000 !important;
              font-weight: 800 !important;
              border: 2px solid #000000 !important;
              padding: 5px 6px !important;
              text-transform: uppercase !important;
              font-size: 11px !important;
              letter-spacing: 0.25px !important;
              text-align: center !important;
            }
            .print-table td {
              border: 2px solid #000000 !important;
              padding: 5px 6px !important;
              vertical-align: middle !important;
              text-align: center;
              color: #000000 !important;
            }
            .print-cell-active {
              background-color: #ffffff !important;
              padding: 0 !important;
            }
            .print-cell-group {
              display: flex !important;
              flex-direction: row !important;
              align-items: center !important;
              justify-content: center !important;
              gap: 8px !important;
              flex-wrap: wrap !important;
            }
            .print-cell-divider {
              width: 1px !important;
              height: 14px !important;
              background-color: #000000 !important;
              align-self: center !important;
            }
            .print-cell-active div:first-child {
              font-weight: 800 !important;
              color: #000000 !important;
              font-size: 12px !important;
            }
            .print-cell-subtext {
              font-size: 9.5px !important;
              color: #000000 !important;
              font-family: monospace !important;
              margin-top: 0.5px !important;
            }
            .print-cell-empty {
              color: #4b5563 !important;
              font-style: italic !important;
              font-size: 10px !important;
            }
            .print-signatures {
              margin-top: 20px !important;
              display: flex !important;
              justify-content: center !important;
              text-align: center !important;
              page-break-inside: avoid !important;
              font-size: 11px !important;
            }
            .print-signature-line {
              border-top: 2px solid #000000 !important;
              width: 280px !important;
              margin: 24px auto 4px auto !important;
            }
          }
        ` }} />

        <div className="print-header">
          <h3>{nomeUnidade} — Localidade: {localidade}</h3>
          <h4>ESCALA DE PLANTÃO</h4>
          <div className="print-meta-grid uppercase font-semibold">
            <div><strong>Chefe de Equipe:</strong> {state.chefe ? `${state.chefe}${chefeMatricula ? ` (${chefeMatricula})` : ""}` : "______________________"}</div>
            <div className="text-center"><strong>Equipe:</strong> {state.equipe || "______________________"}</div>
            <div className="text-right"><strong>Data do Plantão:</strong> {state.dataEscala ? new Date(state.dataEscala + "T00:00:00").toLocaleDateString("pt-BR") : "____/____/______"}</div>
          </div>
        </div>

        <div>
          <h3 className="print-section-title">Postos Operacionais (Divisão de Turnos)</h3>
          <table className="print-table">
            <thead>
              <tr>
                <th style={{ width: "20%" }}>Posto / Turno</th>
                {Array.from({ length: state.numFaixas }).map((_, f) => {
                  const time = state.faixasHorario[f] || { inicio: "--:--", fim: "--:--" }
                  return <th key={f}>Turno {f + 1} ({time.inicio} - {time.fim})</th>
                })}
              </tr>
            </thead>
            <tbody>
              {Object.keys(state.postosConfig).map((posto) => (
                <tr key={posto}>
                  <td className="font-bold text-slate-800 text-center uppercase">{posto}</td>
                  {Array.from({ length: state.numFaixas }).map((_, f) => {
                    const tokens = state.estado[f]?.[posto] || []
                    return (
                      <td key={f} className="text-center">
                        {tokens.length > 0 ? (
                          <div className="print-cell-group">
                            {tokens.map((tid, idx) => {
                              const pp = state.parseToken(tid)
                              if (!pp) return null
                              return (
                                <Fragment key={tid}>
                                  {idx > 0 && <div className="print-cell-divider"></div>}
                                  <div className="print-cell-active">
                                    <div className="font-semibold text-slate-900">{pp.qra || pp.nome}</div>
                                    <div className="print-cell-subtext">Matrícula: {pp.matricula}</div>
                                  </div>
                                </Fragment>
                              )
                            })}
                          </div>
                        ) : <span className="print-cell-empty">— VAGO —</span>}
                      </td>
                    )
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
                      const timeVal = state.independentHorarios[gId]?.[slotIdx] || "00:00 - 06:00"
                      const tokens = state.independentEstado[gId]?.[slotIdx] || []
                      return (
                        <td key={slotIdx} className="text-center">
                          <div className="text-[7.5px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1">{timeVal}</div>
                          {tokens.length > 0 ? (
                            <div className="print-cell-group">
                              {tokens.map((tid, idx) => {
                                const pp = state.parseToken(tid)
                                if (!pp) return null
                                return (
                                  <Fragment key={tid}>
                                    {idx > 0 && <div className="print-cell-divider"></div>}
                                    <div className="print-cell-active">
                                      <div className="font-semibold text-slate-900">{pp.qra || pp.nome}</div>
                                      <div className="print-cell-subtext">{pp.matricula}</div>
                                    </div>
                                  </Fragment>
                                )
                              })}
                            </div>
                          ) : <span className="print-cell-empty">— VAGO —</span>}
                        </td>
                      )
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
                      const timeVal = state.independentHorarios[gId]?.[slotIdx] || "00:00 - 06:00"
                      const tokens = state.independentEstado[gId]?.[slotIdx] || []
                      return (
                        <td key={slotIdx} className="text-center">
                          <div className="text-[7.5px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1">{timeVal}</div>
                          {tokens.length > 0 ? (
                            <div className="print-cell-group">
                              {tokens.map((tid, idx) => {
                                const pp = state.parseToken(tid)
                                if (!pp) return null
                                return (
                                  <Fragment key={tid}>
                                    {idx > 0 && <div className="print-cell-divider"></div>}
                                    <div className="print-cell-active">
                                      <div className="font-semibold text-slate-900">{pp.qra || pp.nome}</div>
                                      <div className="print-cell-subtext">{pp.matricula}</div>
                                    </div>
                                  </Fragment>
                                )
                              })}
                            </div>
                          ) : <span className="print-cell-empty">— VAGO —</span>}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="print-spacer"></div>

        <div className="print-signatures">
          <div>
            <div className="print-signature-line"></div>
            <div className="font-bold text-slate-800 uppercase text-xs">{state.chefe || "______________________"}</div>
            {chefeMatricula && (
              <div className="text-[9.5px] text-slate-700 font-mono font-bold mt-0.5 uppercase">MATRÍCULA: {chefeMatricula}</div>
            )}
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1">CHEFE DE EQUIPE (UPI-4)</div>
          </div>
        </div>
      </div>
    </div>
  )
}
