"use client"

import { toast } from "sonner"
import { ConfigValues, alimentacaoConfig, cafeConfig, biscoitoConfig } from "@/lib/calculation"
import { AlaDistribData } from "@/app/actions/alimentacao"

import { AlimentacaoHeader } from "./AlimentacaoHeader"
import { AlimentacaoTable } from "./AlimentacaoTable"
import { AlimentacaoSummary } from "./AlimentacaoSummary"
import { AlimentacaoPrintLayout } from "./AlimentacaoPrintLayout"
import { AddAlaModal, ClearDataModal, DeleteAlaModal } from "./Modals"

import { useAlimentacaoData } from "./hooks/useAlimentacaoData"
import { useAlimentacaoExcel } from "./hooks/useAlimentacaoExcel"
import { handleExportExcel } from "./utils/export-alimentacao"

const configMap = {
  ALIMENTACAO: alimentacaoConfig,
  CAFE: cafeConfig,
  BISCOITO: biscoitoConfig,
}

interface AlimentacaoPageProps {
  modulo: "ALIMENTACAO" | "CAFE" | "BISCOITO"
  initialData: AlaDistribData[]
  globalConfig: ConfigValues
}

export function AlimentacaoPage({ modulo, initialData, globalConfig }: AlimentacaoPageProps) {
  const config = configMap[modulo]

  const distribData = useAlimentacaoData({ modulo, initialData })
  const { handleImportExcel } = useAlimentacaoExcel({ setData: distribData.setData })

  const summaryMetrics = config.calcularResumo(
    distribData.data.map((i) => ({ id: i.id, nome: i.nome, internos: i.internos, dietas: i.dietas })),
    globalConfig
  )

  return (
    <>
      {/* Interface de Tela Interativa */}
      <div className="space-y-6 print:hidden">
        <AlimentacaoHeader
          config={config}
          globalConfig={globalConfig}
          onImport={handleImportExcel}
          onExport={() => handleExportExcel(distribData.data, config, globalConfig)}
          onClearClick={() => distribData.setShowClearModal(true)}
        />

        {/* Main Container */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Table Column */}
          <div className="xl:col-span-3 flex flex-col">
            <AlimentacaoTable
              data={distribData.data}
              config={config}
              globalConfig={globalConfig}
              isPending={distribData.isPending}
              onCellChange={distribData.handleCellChange}
              onDeleteAla={distribData.handleDeleteAla}
              onAddAlaClick={() => distribData.setShowAddModal(true)}
              onResetLocal={() => {
                distribData.setData(initialData)
                toast.success("Alterações descartadas. Dados restaurados do banco local.")
              }}
              onSave={distribData.handleSave}
            />
          </div>

          {/* Summary sidebar Column */}
          <div className="xl:col-span-1 space-y-6">
            <AlimentacaoSummary
              summaryMetrics={summaryMetrics}
              config={config}
              globalConfig={globalConfig}
            />
          </div>
        </div>

        <AddAlaModal
          isOpen={distribData.showAddModal}
          onClose={() => distribData.setShowAddModal(false)}
          onConfirm={distribData.handleAddAla}
          isPending={distribData.isPending}
        />

        <ClearDataModal
          isOpen={distribData.showClearModal}
          onClose={() => distribData.setShowClearModal(false)}
          onConfirm={distribData.handleClear}
          isPending={distribData.isPending}
        />

        <DeleteAlaModal
          isOpen={!!distribData.alaToDelete}
          onClose={() => distribData.setAlaToDelete(null)}
          onConfirm={distribData.confirmDeleteAla}
          isPending={distribData.isPending}
          alaName={distribData.alaToDelete?.name || ""}
        />
      </div>

      {/* Layout Oficial de Impressão A4 (Econômico e Enquadrado) */}
      <AlimentacaoPrintLayout
        modulo={modulo}
        config={config}
        globalConfig={globalConfig}
        data={distribData.data}
        summaryMetrics={summaryMetrics}
      />
    </>
  )
}
