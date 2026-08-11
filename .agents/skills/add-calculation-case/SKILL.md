---
name: add-calculation-case
description: >-
  Use when adding or changing a calculation rule, validation, or formula in
  calculateMeetingCost or related domain logic.
---

# Adicionar ou alterar regra de cálculo

## Quando usar

Siga este processo ao modificar validações, mensagens de erro ou a fórmula em
`src/calculate-meeting-cost.js`.

## Passos

1. Edite **somente** `calculate-meeting-cost.js` para regras de negócio.
2. Preserve o contrato de retorno: `{ ok: true, totalCost }` ou
   `{ ok: false, error }`.
3. Para cada nova regra, cubra casos de borda:
   - Não finitos (`NaN`, `Infinity`, `-Infinity`) em qualquer parâmetro.
   - `participantes < 1`
   - `duracaoMinutos <= 0`
   - `custoPorHora < 0` (zero é válido)
4. Inclua mensagem acionável com exemplo: `npm start -- 6 45 120`.
5. Não mova validação de domínio para `cli.js` nem formatação para o módulo de
   cálculo.
6. Se a CLI precisar exibir novos campos, altere apenas `cli.js` para
   apresentação — sem duplicar validação.

## Verificação

Execute manualmente (sensors automatizados ainda não existem):

```bash
npm start -- 6 45 120          # válido → total R$ 540,00
npm start -- 0 45 120          # participantes inválidos
npm start -- 6 0 120           # duração inválida
npm start -- 6 45 -1           # custo negativo
npm start -- abc 45 120          # não finito
```

Confirme `exitCode` 1 e mensagens `Erro:` para entradas inválidas.
