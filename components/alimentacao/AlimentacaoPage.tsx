"use client"

import { toast } from "sonner"
import { ConfigValues, alimentacaoConfig, cafeConfig, biscoitoConfig } from "@/lib/calculation"
import { AlaDistribData } from "@/app/actions/alimentacao"

import { AlimentacaoHeader } from "./AlimentacaoHeader"
import { AlimentacaoTable } from "./AlimentacaoTable"
import { AlimentacaoSummary } from "./AlimentacaoSummary"
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
    <div className="space-y-6">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm 12mm 10mm 12mm;
          }
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif !important;
            font-size: 13px !important;
          }
          .print\\:hidden, button, header, nav, aside, footer {
            display: none !important;
          }
          table {
            width: 100% !important;
            border-collapse: collapse !important;
            border: 1.5px solid #000000 !important;
            margin-top: 15px !important;
          }
          th, td {
            border: 1.5px solid #000000 !important;
            padding: 8px 10px !important;
            color: #000000 !important;
            font-size: 13px !important;
          }
          th {
            background-color: #e5e7eb !important;
            font-weight: 800 !important;
            text-transform: uppercase !important;
          }
          tr {
            page-break-inside: avoid !important;
          }
          td input, td select {
            border: none !important;
            background: transparent !important;
            padding: 0 !important;
            font-weight: bold !important;
            color: #111827 !important;
            width: 100% !important;
            text-align: center !important;
          }
        }
      ` }} />
      <AlimentacaoHeader
        config={config}
        globalConfig={globalConfig}
        onImport={handleImportExcel}
        onExport={() => handleExportExcel(distribData.data, config, globalConfig)}
        onClearClick={() => distribData.setShowClearModal(true)}
      />

      {/* Main Container */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 print:flex print:flex-col print:gap-4">
        {/* Table Column */}
        <div className="xl:col-span-3 flex flex-col print:w-full">
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
              toast.success("Alterações descartadas. Dados restaurados do banco.")
            }}
            onSave={distribData.handleSave}
          />
        </div>

        {/* Summary sidebar Column */}
        <div className="xl:col-span-1 space-y-6 print:w-full print:block">
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
  )
}
