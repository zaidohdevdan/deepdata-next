import { Metadata } from "next"
import { FerramentasContainer } from "@/components/ferramentas/FerramentasContainer"

export const metadata: Metadata = {
  title: "Ferramentas Operacionais | DeepData",
  description:
    "Utilitários para conversão e compactação de arquivos, calculadora de prazos e frações penais, bloco de notas e calendário de plantões.",
}

export const dynamic = "force-dynamic"

export default function FerramentasPage() {
  return <FerramentasContainer />
}
