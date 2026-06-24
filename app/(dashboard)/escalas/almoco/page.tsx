import { getConfigValues } from "@/lib/calculation"
import EscalasContainer from "@/components/escalas/EscalasContainer"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function AlmocoEscalasPage() {
  const globalConfig = await getConfigValues()
  const session = await auth()
  
  let initialPoliciaisFixos = []
  try {
    initialPoliciaisFixos = JSON.parse(globalConfig.escalaPoliciaisFixos_almoco || "[]")
  } catch (error) {
    console.error("Error parsing fixed police officers for almoco:", error)
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
      tipo="almoco"
      initialPoliciaisFixos={initialPoliciaisFixos}
      currentUser={currentUser}
      equipeAlfa={equipeAlfa}
      equipeBravo={equipeBravo}
      equipeEcho={equipeEcho}
      equipeFox={equipeFox}
      nomeUnidade={globalConfig.nomeUnidade}
      localidade={globalConfig.localidade}
      initialPostosConfig={globalConfig.escalaPostosConfig_almoco}
      initialHoraInicio={globalConfig.escalaHoraInicio_almoco}
      initialHoraFim={globalConfig.escalaHoraFim_almoco}
      initialNumFaixas={globalConfig.escalaNumFaixas_almoco}
    />
  )
}
