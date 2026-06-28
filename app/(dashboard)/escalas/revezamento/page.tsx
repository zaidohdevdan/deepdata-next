import { getConfigValues } from "@/lib/calculation"
import { auth } from "@/lib/auth"
import RevezamentoClient from "./RevezamentoClient"
export const dynamic = "force-dynamic"

export default async function RevezamentoPage() {
  const globalConfig = await getConfigValues()
  const session = await auth()

  let initialPoliciaisFixosAlmoco = []
  let initialPoliciaisFixosJanta = []
  try {
    initialPoliciaisFixosAlmoco = JSON.parse(globalConfig.escalaPoliciaisFixos_almoco || "[]")
  } catch { }
  try {
    initialPoliciaisFixosJanta = JSON.parse(globalConfig.escalaPoliciaisFixos_janta || "[]")
  } catch { }

  let equipeAlfa = []
  let equipeBravo = []
  let equipeEcho = []
  let equipeFox = []

  try { equipeAlfa = JSON.parse(globalConfig.equipeAlfa || "[]") } catch { }
  try { equipeBravo = JSON.parse(globalConfig.equipeBravo || "[]") } catch { }
  try { equipeEcho = JSON.parse(globalConfig.equipeEcho || "[]") } catch { }
  try { equipeFox = JSON.parse(globalConfig.equipeFox || "[]") } catch { }

  const currentUser = session?.user ? {
    username: session.user.username || "",
    name: session.user.name || "",
    role: session.user.role || "USER"
  } : null

  return (
    <RevezamentoClient
      currentUser={currentUser}
      equipeAlfa={equipeAlfa}
      equipeBravo={equipeBravo}
      equipeEcho={equipeEcho}
      equipeFox={equipeFox}
      nomeUnidade={globalConfig.nomeUnidade}
      localidade={globalConfig.localidade}
      // Almoço Configs
      initialPoliciaisFixosAlmoco={initialPoliciaisFixosAlmoco}
      initialPostosConfigAlmoco={globalConfig.escalaPostosConfig_almoco}
      initialHoraInicioAlmoco={globalConfig.escalaHoraInicio_almoco}
      initialHoraFimAlmoco={globalConfig.escalaHoraFim_almoco}
      initialNumFaixasAlmoco={globalConfig.escalaNumFaixas_almoco}
      // Janta Configs
      initialPoliciaisFixosJanta={initialPoliciaisFixosJanta}
      initialPostosConfigJanta={globalConfig.escalaPostosConfig_janta}
      initialHoraInicioJanta={globalConfig.escalaHoraInicio_janta}
      initialHoraFimJanta={globalConfig.escalaHoraFim_janta}
      initialNumFaixasJanta={globalConfig.escalaNumFaixas_janta}
    />
  )
}
