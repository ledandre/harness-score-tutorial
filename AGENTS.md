# Meeting Cost CLI

Estime o custo de mão de obra de reuniões via CLI em Node.js 24 (ESM). Entradas:
participantes, duração em minutos e custo por hora. Imprima resultado em BRL
(`Intl.NumberFormat`, locale `pt-BR`). Consulte `PROJETO.md` para exemplo.

## Estrutura e comandos

```
.
├── .agents/
├── .github/workflows/ci.yml
├── src/
├── test/
├── biome.json
├── tsconfig.json
├── package.json
└── package-lock.json
```

- `calculate-meeting-cost.js` — domínio puro: `calculateMeetingCost`.
- `cli.js` — lê `process.argv`, formata saída, define `exitCode`.
- Harness em `.agents/`; verificação em `.agents/workflows/verify.md`.

```bash
npm run check          # lint + typecheck + testes
npm start -- 6 45 120  # smoke manual da CLI
```

Scripts: `test`, `lint`, `format`, `typecheck`, `check`, `start`.

## Domínio, erros e runtime

- Fórmula: `totalCost = participantes × (duracaoMinutos / 60) × custoPorHora`.
- Retorne `{ ok: true, totalCost }` ou `{ ok: false, error }`.
- Rejeite não finitos; exija `participantes >= 1`, `duracao > 0`, `custo >= 0`.
- Valide negócio em `calculateMeetingCost`; em `cli.js` verifique só presença dos
  três args e converta com `Number()`.
- Formate moeda e defina `process.exitCode = 1` com `Erro:` em `stderr` na CLI.
- Não mova validação de domínio para a CLI nem apresentação para o cálculo.
- Use ESM (`"type": "module"`): imports com `.js`, sem `require()`.
- Sem dependências de runtime; dev: Biome, TypeScript, `@types/node`. Requer Node.js >= 24.

## Segurança, escopo e conclusão

- Não exponha credenciais (`.env`, tokens, chaves). Não adicione rede.
- Não altere `README.md`, `LICENSE` nem `PROJETO.md` sem pedido explícito.
- Não adicione hooks, MCP, subagentes ou pre-commit sem pedido.
- Não faça commit, push ou tag sem solicitação.
- Prefira a menor mudança que atenda ao pedido.

Antes de concluir, confirme:

- [ ] `npm run check` passa.
- [ ] `calculateMeetingCost` pura, exportada, fórmula intacta.
- [ ] Validação de domínio intacta (finitos, participantes >= 1, duração > 0, custo >= 0).
- [ ] `cli.js` só cuida de argv, formatação BRL e saída.
- [ ] `README.md`, `LICENSE`, `PROJETO.md` inalterados; sem commit sem pedido.
