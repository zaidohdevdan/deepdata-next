#!/usr/bin/env python3
"""Fix invisible-input bug: text color = background color in dark mode."""
import sys
from pathlib import Path

# (file, old, new, replace_all)
EDITS = [
    # 1. Harden shadcn Input base
    ("components/ui/input.tsx",
     "px-2.5 py-1 text-base transition-colors outline-none file:inline-flex",
     "px-2.5 py-1 text-base text-foreground transition-colors outline-none file:inline-flex",
     False),

    # 2. ConfigForm.tsx — 8x text-slate-850 invalid
    ("app/admin/configuracoes/ConfigForm.tsx",
     "font-semibold text-slate-850",
     "font-semibold text-slate-800", True),

    # 3. TermosModelosTab.tsx — 7 patterns
    ("components/ferramentas/tabs/TermosModelosTab.tsx",
     "bg-white border border-blue-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
     "bg-white text-slate-900 dark:text-slate-100 border border-blue-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
     True),
    ("components/ferramentas/tabs/TermosModelosTab.tsx",
     "bg-slate-50 border border-slate-200 rounded-xl pl-7 pr-3 py-2 outline-none focus:border-blue-500",
     "bg-slate-50 text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl pl-7 pr-3 py-2 outline-none focus:border-blue-500",
     False),
    ("components/ferramentas/tabs/TermosModelosTab.tsx",
     "bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500",
     "bg-slate-50 text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500",
     True),
    ("components/ferramentas/tabs/TermosModelosTab.tsx",
     "bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500",
     "bg-slate-50 text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500",
     True),
    ("components/ferramentas/tabs/TermosModelosTab.tsx",
     "bg-white border border-slate-200 rounded-xl px-3 py-1.5 outline-none focus:border-blue-500",
     "bg-white text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 outline-none focus:border-blue-500",
     True),
    ("components/ferramentas/tabs/TermosModelosTab.tsx",
     'bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"',
     'bg-slate-50 text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl px-3 py-2"',
     True),
    ("components/ferramentas/tabs/TermosModelosTab.tsx",
     'font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"',
     'font-mono font-bold bg-slate-50 text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl px-3 py-2"',
     False),

    # 4. ConversorTab.tsx
    ("components/ferramentas/tabs/ConversorTab.tsx",
     "font-mono p-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none",
     "font-mono p-3 bg-slate-50 text-slate-900 dark:text-slate-100 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none",
     False),

    # 5. BlocoNotasTab.tsx
    ("components/ferramentas/tabs/BlocoNotasTab.tsx",
     "pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-medium",
     "pl-8 pr-3 py-1.5 text-xs bg-white text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-medium",
     False),

    # 6. CalculadoraTab.tsx — 4x
    ("components/ferramentas/tabs/CalculadoraTab.tsx",
     "text-xs font-bold bg-white border border-slate-200 rounded-xl px-2.5 py-1.5",
     "text-xs font-bold bg-white text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5",
     True),

    # 7. CalendarioTab.tsx
    ("components/ferramentas/tabs/CalendarioTab.tsx",
     "text-xs font-medium px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500",
     "text-xs font-medium px-3 py-2 bg-white text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl outline-none focus:border-blue-500",
     False),

    # 8. CompactadorTab.tsx
    ("components/ferramentas/tabs/CompactadorTab.tsx",
     "max-w-md px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500",
     "max-w-md px-3 py-1.5 text-xs font-bold bg-white text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl outline-none focus:border-blue-500",
     False),

    # 9. OcorrenciaFormModal.tsx — 2 patterns
    ("components/ocorrencias/modals/OcorrenciaFormModal.tsx",
     "w-28 text-center text-2xl border border-slate-200 rounded-xl py-2 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none bg-white",
     "w-28 text-center text-2xl border border-slate-200 rounded-xl py-2 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none bg-white text-slate-900 dark:text-slate-100",
     False),
    ("components/ocorrencias/modals/OcorrenciaFormModal.tsx",
     "text-[10px] font-extrabold text-indigo-650 hover:text-indigo-800",
     "text-[10px] font-extrabold text-indigo-600 hover:text-indigo-800",
     False),

    # 10. IndependentPostsGrid.tsx — 4 patterns
    ("components/escalas/IndependentPostsGrid.tsx",
     "w-full bg-slate-50 border border-slate-200/60 rounded px-1.5 py-0.5 text-[10px] font-semibold text-slate-750 font-mono outline-none focus:border-slate-350",
     "w-full bg-slate-50 text-slate-900 dark:text-slate-100 border border-slate-200/60 rounded px-1.5 py-0.5 text-[10px] font-semibold font-mono outline-none focus:border-slate-400",
     False),
    ("components/escalas/IndependentPostsGrid.tsx",
     '"border-slate-250 shadow-xs"',
     '"border-slate-200 shadow-xs"',
     False),
    ("components/escalas/IndependentPostsGrid.tsx",
     '"bg-slate-900 text-white cursor-grab active:cursor-grabbing hover:bg-slate-850"',
     '"bg-slate-900 text-white cursor-grab active:cursor-grabbing hover:bg-slate-800"',
     False),
    ("components/escalas/IndependentPostsGrid.tsx",
     "text-[8px] text-slate-350 font-mono leading-tight",
     "text-[8px] text-slate-400 font-mono leading-tight",
     False),

    # 11. EscalasConfigPanel.tsx
    ("components/escalas/EscalasConfigPanel.tsx",
     "p-2 pl-4 font-bold text-slate-750 flex items-center gap-2",
     "p-2 pl-4 font-bold text-slate-700 flex items-center gap-2",
     False),

    # 12. PostosGrid.tsx — 3 patterns
    ("components/escalas/PostosGrid.tsx",
     "font-extrabold text-slate-850 truncate",
     "font-extrabold text-slate-800 truncate",
     False),
    ("components/escalas/PostosGrid.tsx",
     '"bg-slate-900 text-white cursor-grab active:cursor-grabbing hover:bg-slate-850 transition-colors"',
     '"bg-slate-900 text-white cursor-grab active:cursor-grabbing hover:bg-slate-800 transition-colors"',
     False),
    ("components/escalas/PostosGrid.tsx",
     "text-[9px] text-slate-350 font-mono leading-none",
     "text-[9px] text-slate-400 font-mono leading-none",
     False),

    # 13. ConfigEquipesPanel.tsx — 3 patterns
    ("app/(dashboard)/configuracoes/components/ConfigEquipesPanel.tsx",
     '"bg-white border-slate-200 text-slate-600 hover:bg-slate-55"',
     '"bg-white border-slate-200 text-slate-600 hover:bg-slate-50"',
     False),
    ("app/(dashboard)/configuracoes/components/ConfigEquipesPanel.tsx",
     "bg-blue-600 hover:bg-blue-750 text-white",
     "bg-blue-600 hover:bg-blue-700 text-white",
     False),
    ("app/(dashboard)/configuracoes/components/ConfigEquipesPanel.tsx",
     "bg-slate-55 border-b border-slate-200 font-bold text-slate-450 uppercase tracking-wider",
     "bg-slate-50 border-b border-slate-200 font-bold text-slate-500 uppercase tracking-wider",
     False),
]

def main():
    total_replacements = 0
    files_touched = set()
    for rel, old, new, replace_all in EDITS:
        path = Path(rel)
        if not path.exists():
            print(f"  [MISS] {rel}: arquivo nao encontrado")
            continue
        content = path.read_text(encoding="utf-8")
        if old not in content:
            print(f"  [SKIP] {rel}: padrao nao encontrado (ja aplicado?)")
            continue
        n = content.count(old) if replace_all else 1
        new_content = content.replace(old, new) if replace_all else content.replace(old, new, 1)
        path.write_text(new_content, encoding="utf-8")
        total_replacements += n
        files_touched.add(rel)
        print(f"  [OK]   {rel}: {n} substituicao(oes)")
    print()
    print(f"Total: {total_replacements} substituicoes em {len(files_touched)} arquivos.")
    print("Rode `git diff --stat` para confirmar 13 arquivos / 56 insercoes / 56 delecoes.")

if __name__ == "__main__":
    main()
