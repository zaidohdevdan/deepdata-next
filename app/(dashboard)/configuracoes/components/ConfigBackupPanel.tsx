"use client"

import { useState, useRef } from "react"
import { Database, Download, Upload, ShieldCheck, AlertTriangle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { exportDatabaseBackupAction, importDatabaseBackupAction } from "@/app/actions/backup"

export function ConfigBackupPanel() {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExportBackup = async () => {
    setIsExporting(true)
    const loadId = toast.loading("Gerando arquivo de backup local...")
    try {
      const res = await exportDatabaseBackupAction()
      toast.dismiss(loadId)

      if (res.success && res.backupJson) {
        const blob = new Blob([res.backupJson], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        const dateStr = new Date().toISOString().slice(0, 10)
        a.href = url
        a.download = `backup_deepdata_local_${dateStr}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success("Backup local exportado com sucesso!")
      } else {
        toast.error(res.error || "Erro ao exportar backup.")
      }
    } catch {
      toast.dismiss(loadId)
      toast.error("Falha ao comunicar com o servidor para exportar backup.")
    } finally {
      setIsExporting(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!window.confirm("Atenção: A restauração substituirá os dados atuais pelos dados do arquivo de backup. Deseja continuar?")) {
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }

    setIsImporting(true)
    const loadId = toast.loading("Restaurando dados locais a partir do arquivo...")

    try {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const text = event.target?.result as string
        const res = await importDatabaseBackupAction(text)
        toast.dismiss(loadId)

        if (res.success) {
          toast.success("Backup local restaurado com sucesso! Atualizando sistema...")
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        } else {
          toast.error(res.error || "Erro ao processar arquivo de backup.")
        }
        setIsImporting(false)
      }
      reader.onerror = () => {
        toast.dismiss(loadId)
        toast.error("Erro ao ler arquivo selecionado.")
        setIsImporting(false)
      }
      reader.readAsText(file)
    } catch {
      toast.dismiss(loadId)
      toast.error("Falha ao restaurar dados.")
      setIsImporting(false)
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
            <Database size={22} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              Banco de Dados & Segurança
              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                <ShieldCheck size={12} /> Conectado
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Banco de dados integrado com persistência ativa. Exporte cópias de segurança em JSON regularmente.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Exportar Backup */}
        <div className="border border-slate-200/60 rounded-xl p-4 bg-slate-50/50 flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Download size={14} className="text-emerald-600" /> Exportar Cópia de Segurança
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Gera um arquivo JSON estruturado contendo alas, distribuições, histórico de ocorrências, visitas e parâmetros operacionais.
            </p>
          </div>
          <button
            type="button"
            onClick={handleExportBackup}
            disabled={isExporting}
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
          >
            {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            Baixar Backup Local (.json)
          </button>
        </div>

        {/* Restaurar Backup */}
        <div className="border border-slate-200/60 rounded-xl p-4 bg-slate-50/50 flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Upload size={14} className="text-indigo-600" /> Restaurar Cópia de Segurança
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Restaure um arquivo JSON previamente exportado para recuperar dados operacionais nesta máquina.
            </p>
          </div>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
            >
              {isImporting ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              Selecionar Arquivo de Backup
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-amber-800 bg-amber-50/70 p-3 rounded-lg border border-amber-200/60">
        <AlertTriangle size={15} className="text-amber-600 shrink-0" />
        <span>
          <strong>Dica de Segurança:</strong> Faça backups regulares antes de alterações estruturais e guarde a cópia em local seguro ou mídia removível.
        </span>
      </div>
    </div>
  )
}
