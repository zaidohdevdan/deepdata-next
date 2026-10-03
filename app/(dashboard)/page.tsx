import { prisma } from "@/lib/prisma"
import { getConfigValues } from "@/lib/calculation"
import { auth } from "@/lib/auth"
import { DashboardView, DashboardMetricData } from "@/components/dashboard/DashboardView"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const session = await auth()

  let globalConfig = {
    nomeUnidade: "UPI-4",
    localidade: "Itaitinga",
    alimentacaoCaixaCapacidade: 42,
    cafeCapacitePacote: 80,
    cafeLitrosPorGarrafa: 40,
    biscoitoCapacidadePacote: 68,
  }

  try {
    const loaded = await getConfigValues()
    if (loaded) globalConfig = { ...globalConfig, ...loaded }
  } catch (err) {
    console.warn("Aviso ao carregar config da dashboard:", err)
  }

  let totalAlas = 0
  let totalOcorrencias = 0
  let totalUsuarios = 0
  let sumAlimentacao = { _sum: { internos: 0, dietas: 0 } }
  let sumCafe = { _sum: { internos: 0 } }
  let sumBiscoito = { _sum: { internos: 0 } }

  try {
    const [
      alasCount,
      ocorrenciasCount,
      usuariosCount,
      resAlim,
      resCafe,
      resBiscoito,
    ] = await Promise.all([
      prisma.ala.count({ where: { ativa: true } }),
      prisma.ocorrencia.count(),
      prisma.user.count(),
      prisma.distribAla.aggregate({
        where: { modulo: "ALIMENTACAO", ala: { ativa: true } },
        _sum: { internos: true, dietas: true },
      }),
      prisma.distribAla.aggregate({
        where: { modulo: "CAFE", ala: { ativa: true } },
        _sum: { internos: true },
      }),
      prisma.distribAla.aggregate({
        where: { modulo: "BISCOITO", ala: { ativa: true } },
        _sum: { internos: true },
      }),
    ])

    totalAlas = alasCount
    totalOcorrencias = ocorrenciasCount
    totalUsuarios = usuariosCount
    if (resAlim) sumAlimentacao = { _sum: { internos: resAlim._sum.internos || 0, dietas: resAlim._sum.dietas || 0 } }
    if (resCafe) sumCafe = { _sum: { internos: resCafe._sum.internos || 0 } }
    if (resBiscoito) sumBiscoito = { _sum: { internos: resBiscoito._sum.internos || 0 } }
  } catch (err) {
    console.warn("Aviso ao carregar dados consolidados da dashboard:", err)
  }

  const metricData: DashboardMetricData = {
    totalAlas,
    totalInternosAlimentacao: sumAlimentacao._sum.internos || 0,
    totalDietas: sumAlimentacao._sum.dietas || 0,
    totalInternosCafe: sumCafe._sum.internos || 0,
    totalInternosBiscoito: sumBiscoito._sum.internos || 0,
    totalUsuarios,
    totalOcorrencias,
    unidade: globalConfig.nomeUnidade,
    localidade: globalConfig.localidade,
    userName: session?.user.name || "Operador",
    userRole: session?.user.role || "OPERADOR",
  }

  return <DashboardView data={metricData} />
}
