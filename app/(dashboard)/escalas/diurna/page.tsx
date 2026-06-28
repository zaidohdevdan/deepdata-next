import { getConfigValues } from "@/lib/calculation"
import { auth } from "@/lib/auth"
import DiurnaClient from "./DiurnaClient"

export const dynamic = "force-dynamic"

export default async function DiurnaEscalasPage() {
  const globalConfig = await getConfigValues()
  const session = await auth()
  
  let initialPoliciaisFixosDiurna = []
  let initialPoliciaisFixosAlvorada = []
  try {
    initialPoliciaisFixosDiurna = JSON.parse(globalConfig.escalaPoliciaisFixos_diurna || "[]")
  } catch (error) {
    console.error("Error parsing fixed police officers for diurna:", error)
  }
  try {
    initialPoliciaisFixosAlvorada = JSON.parse(globalConfig.escalaPoliciaisFixos_alvorada || "[]")
  } catch (error) {
    console.error("Error parsing fixed police officers for alvorada:", error)
  }

  let equipeAlfa = []
  let equipeBravo = []
  let equipeEcho = []
  let equipeFox = []

  try { equipeAlfa = JSON.parse(globalConfig.equipeAlfa || "[]") } catch {}
  try { equipeBravo = JSON.parse(globalConfig.equipeBravo || "[]") } catch {}
  try { equipeEcho = JSON.parse(globalConfig.equipeEcho || "[]") } catch {}
  try { equipeFox = JSON.parse(globalConfig.equipeFox || "[]") } catch {}

  const currentUser = session?.user ? {
    username: session.user.username || "",
    name: session.user.name || "",
    role: session.user.role || "USER"
  } : null

  return (
    <DiurnaClient 
      currentUser={currentUser}
      equipeAlfa={equipeAlfa}
      equipeBravo={equipeBravo}
      equipeEcho={equipeEcho}
      equipeFox={equipeFox}
      nomeUnidade={globalConfig.nomeUnidade}
      localidade={globalConfig.localidade}
      // Diurna Configs
      initialPoliciaisFixosDiurna={initialPoliciaisFixosDiurna}
      initialPostosConfigDiurna={globalConfig.escalaPostosConfig_diurna}
      initialHoraInicioDiurna={globalConfig.escalaHoraInicio_diurna}
      initialHoraFimDiurna={globalConfig.escalaHoraFim_diurna}
      initialNumFaixasDiurna={globalConfig.escalaNumFaixas_diurna}
      // Alvorada Configs
      initialPoliciaisFixosAlvorada={initialPoliciaisFixosAlvorada}
      initialPostosConfigAlvorada={globalConfig.escalaPostosConfig_alvorada}
      initialHoraInicioAlvorada={globalConfig.escalaHoraInicio_alvorada}
      initialHoraFimAlvorada={globalConfig.escalaHoraFim_alvorada}
      initialNumFaixasAlvorada={globalConfig.escalaNumFaixas_alvorada}
    />
  )
}
