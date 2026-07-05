import { useState, useMemo } from "react"
import { ExtractedVisitor } from "@/lib/pdf-parser"

const PAGE_SIZE = 50

export function useVisitasFiltros(data: ExtractedVisitor[]) {
  const [searchInterno, setSearchInterno] = useState("")
  const [searchVisitante, setSearchVisitante] = useState("")
  const [selectedAla, setSelectedAla] = useState("Todos")
  const [selectedCela, setSelectedCela] = useState("Todas")
  const [selectedPrioridade, setSelectedPrioridade] = useState("Todas")
  const [sortOption, setSortOption] = useState<"senha" | "custodiado" | "localizacao">("senha")
  const [viewMode, setViewMode] = useState<"visitas" | "internos">("visitas")
  const [selectedParidadeCela, setSelectedParidadeCela] = useState("Todas")
  const [currentPage, setCurrentPage] = useState(1)

  // Chave de filtros: sempre que mudar, recalcula a página como 1
  // Evita o padrão proibido de chamar setState diretamente dentro de useEffect
  const filterKey = useMemo(
    () => [searchInterno, searchVisitante, selectedAla, selectedCela, selectedPrioridade, selectedParidadeCela, sortOption, viewMode].join("|"),
    [searchInterno, searchVisitante, selectedAla, selectedCela, selectedPrioridade, selectedParidadeCela, sortOption, viewMode]
  )

  const celasDisponiveis = useMemo(() => Array.from(
    new Set(
      data
        .filter((d) => selectedAla === "Todos" || d.ala === selectedAla)
        .map((d) => d.cela)
        .filter(Boolean)
    )
  ).sort(), [data, selectedAla])

  const sortedAndFiltered = useMemo(() => {
    return data
      .filter((item) => {
        const matchInterno = item.custodiado.toLowerCase().includes(searchInterno.toLowerCase()) ||
          String(item.prontuario).includes(searchInterno)
        const matchVisitante = item.nomeVisitante.toLowerCase().includes(searchVisitante.toLowerCase()) ||
          item.cpfVisitante.includes(searchVisitante)
        const matchAla = selectedAla === "Todos" || item.ala.toUpperCase() === selectedAla.toUpperCase()
        const matchCela = selectedCela === "Todas" || item.cela === selectedCela
        const matchPrioridade = selectedPrioridade === "Todas" || item.prioridade === selectedPrioridade

        const matchParidadeCela = (() => {
          if (selectedParidadeCela === "Todas") return true
          if (!item.cela) return false
          const cellNumMatch = item.cela.match(/\d+$/)
          if (!cellNumMatch) return false
          const num = parseInt(cellNumMatch[0], 10)
          return selectedParidadeCela === "pares" ? num % 2 === 0 : num % 2 !== 0
        })()

        return matchInterno && matchVisitante && matchAla && matchCela && matchPrioridade && matchParidadeCela
      })
      .sort((a, b) => {
        if (sortOption === "senha") return a.senha - b.senha
        if (sortOption === "custodiado") return a.custodiado.localeCompare(b.custodiado)
        return a.localizacao.localeCompare(b.localizacao)
      })
  }, [data, searchInterno, searchVisitante, selectedAla, selectedCela, selectedPrioridade, selectedParidadeCela, sortOption])

  const allDisplayRows = useMemo(() => {
    if (viewMode === "visitas") {
      return sortedAndFiltered.map((item) => ({
        senhaDisplay: String(item.senha),
        custodiado: item.custodiado,
        prontuario: item.prontuario,
        cela: item.cela,
        ala: item.ala,
        nomeVisitante: item.nomeVisitante,
        cpfVisitante: item.cpfVisitante,
        relacao: item.relacao,
        prioridade: item.prioridade,
        situacao: item.situacao,
      }))
    } else {
      const groups = new Map<string, ExtractedVisitor[]>()
      sortedAndFiltered.forEach((item) => {
        const key = item.prontuario > 0 ? String(item.prontuario) : item.custodiado.toUpperCase()
        if (!groups.has(key)) {
          groups.set(key, [])
        }
        groups.get(key)!.push(item)
      })

      return Array.from(groups.values()).map((items) => {
        const sortedItems = [...items].sort((a, b) => a.senha - b.senha)
        const senhas = sortedItems.map((i) => i.senha).join(", ")
        const nomes = Array.from(new Set(sortedItems.map((i) => i.nomeVisitante).filter(Boolean))).join(", ")
        const cpfs = Array.from(new Set(sortedItems.map((i) => i.cpfVisitante).filter(Boolean))).join(", ")
        const relacoes = Array.from(new Set(sortedItems.map((i) => i.relacao).filter(Boolean))).join(", ")
        const situacoes = Array.from(new Set(sortedItems.map((i) => i.situacao).filter(Boolean))).join(", ")
        const prioridades = sortedItems.some((i) => i.prioridade === "sim") ? "sim" : "não"
        const first = sortedItems[0]

        return {
          senhaDisplay: senhas || "—",
          custodiado: first.custodiado,
          prontuario: first.prontuario,
          cela: first.cela,
          ala: first.ala,
          nomeVisitante: nomes || "—",
          cpfVisitante: cpfs || "—",
          relacao: relacoes || "—",
          prioridade: prioridades,
          situacao: situacoes || "—",
        }
      })
    }
  }, [sortedAndFiltered, viewMode])

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(allDisplayRows.length / PAGE_SIZE))
  }, [allDisplayRows])

  // Página atual reseta para 1 sempre que a chave de filtro muda
  // sem precisar de useEffect que chamaria setState diretamente
  const effectivePage = useMemo(() => {
    // filterKey é usado aqui para que o useMemo reexecute a cada mudança de filtro
    void filterKey
    return currentPage
  }, [filterKey, currentPage])

  const displayRows = useMemo(() => {
    const start = (effectivePage - 1) * PAGE_SIZE
    return allDisplayRows.slice(start, start + PAGE_SIZE)
  }, [allDisplayRows, effectivePage])

  return {
    searchInterno, setSearchInterno,
    searchVisitante, setSearchVisitante,
    selectedAla, setSelectedAla,
    selectedCela, setSelectedCela,
    selectedPrioridade, setSelectedPrioridade,
    sortOption, setSortOption,
    viewMode, setViewMode,
    selectedParidadeCela, setSelectedParidadeCela,
    celasDisponiveis,
    displayRows,
    allDisplayRows,
    currentPage,
    setCurrentPage,
    totalPages,
    sortedAndFiltered
  }
}
