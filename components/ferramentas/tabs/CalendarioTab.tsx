"use client"

import { useState, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
import {
  EQUIPES_PLANTAO,
  getEquipeDoDia,
  getFeriadosAno,
} from "../utils/penalCalculations"

interface DayEvent {
  id: string
  dateStr: string // YYYY-MM-DD
  title: string
  type: "OPERACIONAL" | "JUDICIAL" | "LEMBRETE"
}

const EVENTS_STORAGE_KEY = "deepdata_calendario_events_v1"

export function CalendarioTab() {
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date())
  const [filterEquipe, setFilterEquipe] = useState<string>("TODAS")
  const [events, setEvents] = useState<DayEvent[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [newEventTitle, setNewEventTitle] = useState("")
  const [newEventType, setNewEventType] = useState<DayEvent["type"]>("OPERACIONAL")

  // Carregar eventos após montagem no cliente para evitar mismatch de hidratação
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem(EVENTS_STORAGE_KEY)
        if (saved) {
          setEvents(JSON.parse(saved))
        }
      } catch {}
      setIsLoaded(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  // Salvar eventos no localStorage (apenas após carregamento inicial)
  useEffect(() => {
    if (!isLoaded) return
    try {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events))
    } catch {}
  }, [events, isLoaded])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const feriados = getFeriadosAno(year)

  // Navegação
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const handleGoToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDate(today)
  }

  // Montagem da grade mensal
  const firstDayIndex = new Date(year, month, 1).getDay() // 0 = Domingo
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ]

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  const selectedDateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
  const selectedDayEvents = events.filter((e) => e.dateStr === selectedDateStr)
  const selectedDayEquipe = getEquipeDoDia(selectedDate)
  const selectedDayFeriado = feriados[selectedDateStr]

  const handleAddEvent = () => {
    if (!newEventTitle.trim()) {
      toast.error("Insira o título do evento.")
      return
    }
    const newEv: DayEvent = {
      id: "ev-" + Math.random().toString(36).substring(2, 9),
      dateStr: selectedDateStr,
      title: newEventTitle.trim(),
      type: newEventType,
    }
    setEvents((prev) => [...prev, newEv])
    setNewEventTitle("")
    toast.success("Lembrete salvo com sucesso!")
  }

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
    toast.success("Lembrete removido.")
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] space-y-6">
        {/* Cabeçalho do Calendário */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-800">
              Calendário Operacional e Ciclo de Plantões (24x72)
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Acompanhe o revezamento contínuo das Equipes Alfa, Bravo, Charlie e Delta, feriados e registre eventos da unidade.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filtro de Equipe */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-full px-2 py-1 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase ml-1 mr-1">
                Filtro:
              </span>
              <button
                type="button"
                onClick={() => setFilterEquipe("TODAS")}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                  filterEquipe === "TODAS"
                    ? "bg-slate-800 text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Todas
              </button>
              {EQUIPES_PLANTAO.map((eq) => (
                <button
                  key={eq.id}
                  type="button"
                  onClick={() => setFilterEquipe(eq.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                    filterEquipe === eq.id
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {eq.nome}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleGoToday}
              className="px-3.5 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-full transition cursor-pointer"
            >
              Hoje
            </button>
          </div>
        </div>

        {/* Barra de Navegação do Mês */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition cursor-pointer"
              title="Mês anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-lg font-black text-slate-900 min-w-44 text-center">
              {monthNames[month]} de {year}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition cursor-pointer"
              title="Próximo mês"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs">
            {EQUIPES_PLANTAO.map((eq) => (
              <div key={eq.id} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${eq.color.split(" ")[0]}`} />
                <span className="font-bold text-slate-600">{eq.nome}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Grade do Calendário */}
          <div className="lg:col-span-2 space-y-2">
            {/* Dias da Semana */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 py-1">
              {weekDays.map((d, i) => (
                <div key={i} className={i === 0 || i === 6 ? "text-rose-500" : ""}>
                  {d}
                </div>
              ))}
            </div>

            {/* Células do Mês */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {/* Espaços em branco antes do 1º dia */}
              {Array.from({ length: firstDayIndex }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-20 sm:h-24 rounded-2xl bg-slate-50/40" />
              ))}

              {/* Dias do mês */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1
                const dayDate = new Date(year, month, dayNum)
                const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`
                const equipe = getEquipeDoDia(dayDate)
                const feriadoNome = feriados[dateStr]
                const dayEvents = events.filter((e) => e.dateStr === dateStr)

                const isToday =
                  new Date().toDateString() === dayDate.toDateString()
                const isSelected =
                  selectedDate.toDateString() === dayDate.toDateString()

                const isDimmed = filterEquipe !== "TODAS" && equipe.id !== filterEquipe

                return (
                  <div
                    key={dayNum}
                    onClick={() => setSelectedDate(dayDate)}
                    className={`h-20 sm:h-24 p-1.5 sm:p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative group ${
                      isSelected
                        ? "border-blue-500 ring-2 ring-blue-100 bg-blue-50/30"
                        : "border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-sm"
                    } ${isDimmed ? "opacity-35" : ""}`}
                  >
                    {/* Topo da Célula */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-black ${
                          isToday
                            ? "w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-mono shadow-xs"
                            : "text-slate-800"
                        }`}
                      >
                        {dayNum}
                      </span>

                      {/* Badge da Equipe */}
                      <span
                        className={`px-1 sm:px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] font-extrabold uppercase ${equipe.tint}`}
                      >
                        <span className="hidden sm:inline">{equipe.nome}</span>
                        <span className="sm:hidden">{equipe.nome[0]}</span>
                      </span>
                    </div>

                    {/* Indicadores de Eventos / Feriados */}
                    <div className="space-y-0.5 overflow-hidden">
                      {feriadoNome && (
                        <div
                          className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1 py-0.5 rounded truncate"
                          title={feriadoNome}
                        >
                          ★ {feriadoNome}
                        </div>
                      )}
                      {dayEvents.slice(0, 1).map((ev) => (
                        <div
                          key={ev.id}
                          className="text-[9px] font-semibold text-blue-700 bg-blue-50/80 px-1 py-0.5 rounded truncate"
                          title={ev.title}
                        >
                          • {ev.title}
                        </div>
                      ))}
                      {dayEvents.length > 1 && (
                        <span className="text-[8px] font-bold text-slate-400 block text-right">
                          +{dayEvents.length - 1} mais
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Painel Lateral: Detalhes do Dia Selecionado & Eventos */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Plantão do Dia
                </span>
                <div className="flex items-center justify-between mt-1">
                  <h3 suppressHydrationWarning className="text-base font-black text-slate-800">
                    {selectedDate.toLocaleDateString("pt-BR", {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                    })}
                  </h3>
                </div>

                <div className="mt-2.5 flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase ${selectedDayEquipe.color}`}>
                    Equipe {selectedDayEquipe.nome}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Plantão de 24 horas (07:00 às 07:00)
                  </span>
                </div>

                {selectedDayFeriado && (
                  <div className="mt-2 text-xs font-bold text-rose-600 flex items-center gap-1.5">
                    <span>★ Feriado Nacional:</span>
                    <span>{selectedDayFeriado}</span>
                  </div>
                )}
              </div>

              {/* Lista de Lembretes / Eventos */}
              <div className="space-y-2">
                <span className="text-xs font-black text-slate-700 uppercase tracking-wide block">
                  Lembretes & Operações Marcadas ({selectedDayEvents.length})
                </span>

                {selectedDayEvents.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-4">
                    Nenhum lembrete registrado para este dia.
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {selectedDayEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                          <span className="font-semibold text-slate-700 truncate">
                            {ev.title}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteEvent(ev.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Adicionar Novo Lembrete */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <span suppressHydrationWarning className="text-[11px] font-bold text-slate-500 uppercase block">
                  Novo Lembrete para {selectedDate.toLocaleDateString("pt-BR")}
                </span>
                <div className="flex gap-2">
                  <select
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value as DayEvent["type"])}
                    className="text-xs font-bold bg-white border border-slate-200 rounded-xl px-2.5 py-2 outline-none text-slate-700"
                  >
                    <option value="OPERACIONAL">Operacional</option>
                    <option value="JUDICIAL">Judicial</option>
                    <option value="LEMBRETE">Lembrete</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Ex: Revista Geral Ala B, Escolta..."
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    className="w-full text-xs font-medium px-3 py-2 bg-white text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddEvent}
                  className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Adicionar Lembrete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
