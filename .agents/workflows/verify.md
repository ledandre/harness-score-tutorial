# Verificação manual

Execute somente comandos que existem em `package.json`.

## Comandos disponíveis

```bash
npm start -- <participantes> <duracao-minutos> <custo-por-hora>
```

### Caso válido

```bash
npm start -- 6 45 120
```

Esperado: total `R$ 540,00`, `exitCode` 0.

### Casos inválidos (amostra)

```bash
npm start -- 0 45 120
npm start -- 6 0 120
npm start -- 6 45 -1
```

Esperado: mensagem `Erro:` em stderr, `exitCode` 1.

## Sensors pendentes

Estes comandos **não existem** neste repositório — não os invente nem execute:

- `npm test` — testes automatizados pendentes
- `npm run lint` — linter pendente
- `npm run format` — formatter pendente
- `npm run typecheck` — typecheck pendente
- `npm run check` — agregador de verificação pendente

Até que sejam adicionados, use `npm start` com entradas válidas e inválidas como
única verificação local.
