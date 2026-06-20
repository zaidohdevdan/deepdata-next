import type { Metadata } from "next"
import { auth } from "@/lib/auth"
import { getOcorrenciasAction, getCategoriasAction } from "@/app/actions/ocorrencias"
import OcorrenciasContainer from "@/components/ocorrencias/OcorrenciasContainer"

export const metadata: Metadata = {
  title: "Livro de Ocorrências",
  description: "Gerenciamento de relatórios e ocorrências da unidade prisional.",
}

export default async function OcorrenciasPage() {
  const session = await auth()
  const userName = session?.user?.name || "Policial Penal"
  const userRole = session?.user?.role || "USER"

  const dbOcorrencias = await getOcorrenciasAction()
  const dbCategorias = await getCategoriasAction()

  return (
    <OcorrenciasContainer
      initialOcorrencias={dbOcorrencias}
      initialCategorias={dbCategorias.map(c => c.nome)}
      currentUserName={userName}
      userRole={userRole}
    />
  )
}
