#!/usr/bin/env python3
"""Fix v2: adiciona dark:bg-slate-800 para o fundo escurecer em dark mode."""
from pathlib import Path

EDITS = [
    ("components/ferramentas/tabs/TermosModelosTab.tsx",
     "bg-white text-slate-900 dark:text-slate-100",
     "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100", True),
    ("components/ferramentas/tabs/TermosModelosTab.tsx",
     "bg-slate-50 text-slate-900 dark:text-slate-100",
     "bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100", True),
    ("components/ferramentas/tabs/ConversorTab.tsx",
     "bg-slate-50 text-slate-900 dark:text-slate-100",
     "bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100", True),
    ("components/ferramentas/tabs/BlocoNotasTab.tsx",
     "bg-white text-slate-900 dark:text-slate-100",
     "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100", True),
    ("components/ferramentas/tabs/CalculadoraTab.tsx",
     "bg-white text-slate-900 dark:text-slate-100",
     "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100", True),
    ("components/ferramentas/tabs/CalendarioTab.tsx",
     "bg-white text-slate-900 dark:text-slate-100",
     "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100", True),
    ("components/ferramentas/tabs/CompactadorTab.tsx",
     "bg-white text-slate-900 dark:text-slate-100",
     "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100", True),
    ("components/ocorrencias/modals/OcorrenciaFormModal.tsx",
     "bg-white text-slate-900 dark:text-slate-100",
     "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100", True),
    ("components/escalas/IndependentPostsGrid.tsx",
     "bg-slate-50 text-slate-900 dark:text-slate-100",
     "bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100", True),
]

total = 0
files = set()
for rel, old, new, replace_all in EDITS:
    path = Path(rel)
    if not path.exists():
        print(f"  [MISS] {rel}")
        continue
    content = path.read_text(encoding="utf-8")
    if old not in content:
        print(f"  [SKIP] {rel}")
        continue
    n = content.count(old) if replace_all else 1
    path.write_text(content.replace(old, new), encoding="utf-8")
    total += n
    files.add(rel)
    print(f"  [OK]   {rel}: {n}")

print(f"\nTotal: {total} substituicoes em {len(files)} arquivos.")