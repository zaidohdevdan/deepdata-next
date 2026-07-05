import { getConfigValues } from "@/lib/calculation"
import { auth } from "@/lib/auth"
import EfetivoClient from "./EfetivoClient"

export const dynamic = "force-dynamic"

export default async function EfetivoEscalasPage() {
  const globalConfig = await getConfigValues()
  const session = await auth()

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
    <EfetivoClient
      currentUser={currentUser}
      equipeAlfa={equipeAlfa}
      equipeBravo={equipeBravo}
      equipeEcho={equipeEcho}
      equipeFox={equipeFox}
    />
  )
}
