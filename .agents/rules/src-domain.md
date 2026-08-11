---
description: Domínio e arquitetura do código em src/ — cálculo, validação e separação CLI.
globs:
  - src/**
alwaysApply: false
---

# Domínio e arquitetura em `src/`

- Mantenha `calculateMeetingCost` em `calculate-meeting-cost.js` como função pura
  exportada.
- Fórmula: `totalCost = participantes × (duracaoMinutos / 60) × custoPorHora`.
- Retorne `{ ok: true, totalCost }` ou `{ ok: false, error }`; não lance exceções.
- Rejeite não finitos; exija `participantes >= 1`, `duracaoMinutos > 0`,
  `custoPorHora >= 0`.
- Valide negócio somente em `calculateMeetingCost`. Em `cli.js`, verifique presença
  dos três argumentos e converta com `Number()`.
- Formate moeda (`Intl.NumberFormat`, `pt-BR`, `BRL`) e defina `process.exitCode = 1`
  com `Erro:` em `stderr` apenas na CLI.
- Use ESM: imports relativos com extensão `.js`; sem `require()`.
