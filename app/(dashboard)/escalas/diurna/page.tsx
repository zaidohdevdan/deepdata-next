import { getConfigValues } from "@/lib/calculation"
import EscalasContainer from "@/components/escalas/EscalasContainer"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function DiurnaEscalasPage() {
  const globalConfig = await getConfigValues()
  const session = await auth()
  
  let initialPoliciaisFixos = []
  try {
    initialPoliciaisFixos = JSON.parse(globalConfig.escalaPoliciaisFixos_diurna || "[]")
  } catch (error) {
    console.error("Error parsing fixed police officers for diurna:", error)
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
    <EscalasContainer 
      tipo="diurna"
      initialPoliciaisFixos={initialPoliciaisFixos}
      currentUser={currentUser}
      equipeAlfa={equipeAlfa}
      equipeBravo={equipeBravo}
      equipeEcho={equipeEcho}
      equipeFox={equipeFox}
      nomeUnidade={globalConfig.nomeUnidade}
      localidade={globalConfig.localidade}
      initialPostosConfig={globalConfig.escalaPostosConfig_diurna}
      initialHoraInicio={globalConfig.escalaHoraInicio_diurna}
      initialHoraFim={globalConfig.escalaHoraFim_diurna}
      initialNumFaixas={globalConfig.escalaNumFaixas_diurna}
    />
  )
}
