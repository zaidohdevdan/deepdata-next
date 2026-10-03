"use client"

import { Fragment } from "react"
import Link from "next/link"
import { Users } from "lucide-react"
import { useEscalaState } from "./useEscalaState"
import EscalasHeader from "./EscalasHeader"
import PostosGrid from "./PostosGrid"
import IndependentPostsGrid from "./IndependentPostsGrid"
import { EscalasContainerProps } from "./types"
import EscalasPrintLayout from "./EscalasPrintLayout"

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
    <><div className="space-y-6">
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
          handleEditPost={state.handleEditPost}
          handlePostReorder={state.handlePostReorder}
          draggedPostName={state.draggedPostName}
          setDraggedPostName={state.setDraggedPostName}
          dragOverPostName={state.dragOverPostName}
          setDragOverPostName={state.setDragOverPostName}
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
          isSavingConfig={state.isSavingConfig} />

        {state.basePoliciais.length > 0 ? (
          <>
            <PostosGrid
              faixasHorario={state.faixasHorario}
              basePoliciais={state.basePoliciais}
              presenceMap={state.presenceMap}
              estado={state.estado}
              postosConfig={state.postosConfig}
              policiaisFixos={state.policiaisFixos}
              unlockedFixedTokens={state.unlockedFixedTokens}
              toggleFixedOfficerLock={state.toggleFixedOfficerLock}
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
              parseToken={state.parseToken} />

            <IndependentPostsGrid
              tipo={tipo}
              independentHorarios={state.independentHorarios}
              setIndependentHorarios={state.setIndependentHorarios}
              independentEstado={state.independentEstado}
              policiaisFixos={state.policiaisFixos}
              unlockedFixedTokens={state.unlockedFixedTokens}
              toggleFixedOfficerLock={state.toggleFixedOfficerLock}
              handleDragStart={state.handleDragStart}
              handleDragOver={state.handleDragOver}
              handleDrop={state.handleDrop}
              handleDuplicateToken={state.handleDuplicateToken}
              handleRemoveToken={state.handleRemoveToken}
              parseToken={state.parseToken} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 md:p-16 bg-white border border-slate-200/80 rounded-3xl shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] text-center print:hidden space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shadow-sm">
              <Users size={32} />
            </div>
            <div className="space-y-1.5 max-w-md">
              <h3 className="font-black text-slate-900 text-lg">Nenhum Policial no Contingente</h3>
              <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed">
                Para alocar servidores nesta escala, é necessário primeiro carregar ou confirmar o efetivo de plantão.
              </p>
            </div>
            <Link
              href="/escalas/efetivo"
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md shadow-blue-600/20 transition cursor-pointer"
            >
              <Users size={14} />
              Gerenciar Efetivo de Plantão
            </Link>
          </div>
        )}
      </div>

      {/* -------------------- PREMIUM TABULAR PRINT LAYOUT (HIDDEN ON SCREEN, ONLY SHOWN ON PRINT) -------------------- */}
      <EscalasPrintLayout tipo={tipo} state={state} nomeUnidade={nomeUnidade} localidade={localidade} chefeMatricula={chefeMatricula} />
    </div>
    </>
  )
}
