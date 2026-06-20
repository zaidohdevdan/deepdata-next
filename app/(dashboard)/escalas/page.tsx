import { getConfigValues } from "@/lib/calculation"
import EscalasContainer from "@/components/escalas/EscalasContainer"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

interface PolicialFixo {
  matricula: string
  nome: string
  posto: string
  faixa: string
}

export default async function EscalasPage() {
  const globalConfig = await getConfigValues()
  const session = await auth()
  
  let policiaisFixos: PolicialFixo[] = []
  try {
    policiaisFixos = JSON.parse(globalConfig.escalaPoliciaisFixos || "[]")
  } catch (error) {
    console.error("Error parsing fixed police officers:", error)
  }

  // Parse teams
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
      policiaisFixos={policiaisFixos}
      currentUser={currentUser}
      equipeAlfa={equipeAlfa}
      equipeBravo={equipeBravo}
      equipeEcho={equipeEcho}
      equipeFox={equipeFox}
    />
  )
}
