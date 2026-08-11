# Meeting Cost CLI

Aplicação de linha de comando em Node.js 24 (ESM) que estima o custo de mão de
obra de uma reunião com base no número de participantes, na duração em minutos
e no custo por hora.

## Uso

```bash
npm start -- <participantes> <duracao-minutos> <custo-por-hora>
```

### Exemplo

```bash
npm start -- 6 45 120
```

Saída esperada:

```text
Custo da reunião
Participantes: 6
Duração: 45 min
Custo por hora: R$ 120,00
Total: R$ 540,00
```
