# Meeting Cost CLI

Estime o custo de mão de obra de reuniões via CLI em Node.js 24 (ESM). Entradas:
participantes, duração em minutos e custo por hora. Imprima resultado em BRL
(`Intl.NumberFormat`, locale `pt-BR`). Consulte `PROJETO.md` para exemplo.

## Estrutura e comandos

```
.
├── .agents/
│   ├── rules/src-domain.md
│   ├── skills/add-calculation-case/SKILL.md
│   └── workflows/verify.md
├── AGENTS.md
├── LICENSE
├── PROJETO.md
├── README.md
├── package.json
├── package-lock.json
└── src/
    ├── calculate-meeting-cost.js
    └── cli.js
```

- `calculate-meeting-cost.js` — domínio puro: `calculateMeetingCost`.
- `cli.js` — lê `process.argv`, formata saída, define `exitCode`.
- Harness em `.agents/` (rule escopada a `src/**`, skill de cálculo, workflow
  de verificação). Não existem testes, lint, typecheck, CI ou hooks.

```bash
npm start -- <participantes> <duracao-minutos> <custo-por-hora>
# ex.: npm start -- 6 45 120  →  total R$ 540,00
```

- Único script npm: `start` (`node src/cli.js`). Não invente `npm test`, `npm run lint`,
  `npm run format`, `npm run typecheck` nem `npm run check`.
- Valide mudanças com `npm start` e argumentos válidos e inválidos.

## Domínio, erros e runtime

- Fórmula: `totalCost = participantes × (duracaoMinutos / 60) × custoPorHora`.
- Retorne `{ ok: true, totalCost }` ou `{ ok: false, error }`.
- Rejeite não finitos; exija `participantes >= 1`, `duracao > 0`, `custo >= 0`.
- Valide negócio em `calculateMeetingCost`; em `cli.js` verifique só presença dos
  três args e converta com `Number()`.
- Formate moeda e defina `process.exitCode = 1` com `Erro:` em `stderr` na CLI.
- Não mova validação de domínio para a CLI nem apresentação para o cálculo.
- Use ESM (`"type": "module"`): imports com `.js`, sem `require()`.
- Sem dependências de runtime; `package-lock.json` fixa instalação reproduzível.
  Requer Node.js >= 24.

## Segurança, escopo e conclusão

- Não exponha credenciais (`.env`, tokens, chaves). Não adicione rede.
- Não altere `README.md`, `LICENSE` nem `PROJETO.md` sem pedido explícito.
- Não instale deps, crie harness (rules, skills, hooks, CI, MCP), testes ou lint
  sem pedido. Não faça commit, push ou tag sem solicitação.
- Prefira a menor mudança que atenda ao pedido.

Antes de concluir, confirme:

- [ ] `calculateMeetingCost` pura, exportada, fórmula intacta.
- [ ] Validação de domínio intacta (finitos, participantes >= 1, duração > 0, custo >= 0).
- [ ] `cli.js` só cuida de argv, formatação BRL e saída.
- [ ] `npm start -- 6 45 120` → `R$ 540,00`; inválidos → erro acionável, exit 1.
- [ ] ESM com extensão `.js`; sem deps de runtime adicionadas sem pedido.
- [ ] `README.md`, `LICENSE`, `PROJETO.md` inalterados; sem commit sem pedido.
