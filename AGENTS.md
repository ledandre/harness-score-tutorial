# Visão geral do produto

Este repositório contém a **Meeting Cost CLI**, uma aplicação de linha de comando
escrita em Node.js 24 com ESM. O produto estima o custo total de mão de obra de
uma reunião a partir de três entradas fornecidas pelo usuário: o número de
participantes, a duração da reunião em minutos e o custo por hora de cada
participante.

O objetivo central do produto é responder à pergunta: quanto custa, em termos de
mão de obra, manter um grupo de pessoas em uma reunião por um determinado
período? A CLI lê os argumentos, delega o cálculo a uma função de domínio pura e
imprime um resultado formatado em moeda brasileira (BRL) quando as entradas são
válidas.

A aplicação é intencionalmente pequena. Não há servidor HTTP, banco de dados,
interface gráfica ou integração com serviços externos. Toda a lógica reside em
dois arquivos JavaScript dentro de `src/`, separados por responsabilidade:
cálculo de domínio em um módulo e interface de linha de comando em outro.

Consulte também `PROJETO.md` para uma descrição resumida e um exemplo de uso
documentado pelo autor do projeto.

# Estrutura do repositório

O repositório possui a seguinte estrutura real de arquivos relevantes para o
desenvolvimento:

```
.
├── AGENTS.md
├── LICENSE
├── PROJETO.md
├── README.md
├── package.json
└── src/
    ├── calculate-meeting-cost.js
    └── cli.js
```

- `package.json` — manifesto do projeto com `"type": "module"`, engine Node.js
  `>=24` e o script `start`.
- `src/calculate-meeting-cost.js` — função de domínio pura `calculateMeetingCost`,
  exportada via ESM. Contém toda a validação de negócio e a fórmula de cálculo.
- `src/cli.js` — ponto de entrada da aplicação. Lê `process.argv`, converte
  argumentos, chama a função de domínio e imprime resultado ou erro no terminal.
- `PROJETO.md` — documentação curta do produto com exemplo de execução.
- `README.md` — guia do tutorial Harness Score. **Não altere este arquivo** a
  menos que o usuário solicite explicitamente.
- `LICENSE` — licença MIT. **Não altere este arquivo** a menos que o usuário
  solicite explicitamente.

Não existem, neste estágio do repositório, diretórios de testes, configuração
de linter, formatter, typecheck, CI, hooks, rules, skills, workflows, `.gitignore`
ou `package-lock.json`. Não presuma a existência de nenhum desses artefatos ao
orientar mudanças ou sugerir comandos de verificação.

A separação entre domínio (`calculate-meeting-cost.js`) e interface (`cli.js`) é
uma decisão arquitetural intencional. O cálculo deve permanecer puro e testável
em isolamento, enquanto a CLI cuida exclusivamente de parsing de argumentos,
formatação de saída e códigos de saída do processo.

# Comandos disponíveis

O único comando npm definido atualmente é:

```bash
npm start -- <participantes> <duracao-minutos> <custo-por-hora>
```

Este comando executa `node src/cli.js` com os argumentos posicionais passados
após `--`. Exemplo documentado em `PROJETO.md`:

```bash
npm start -- 6 45 120
```

**Não existem** neste repositório os comandos `npm test`, `npm run lint`,
`npm run format`, `npm run typecheck`, `npm run check` ou qualquer outro script
além de `start`. Não invente nem execute comandos de verificação que não estejam
definidos em `package.json`.

Para validar manualmente uma mudança, use `npm start` com argumentos válidos e
inválidos e observe a saída no terminal. Essa é, hoje, a única forma de feedback
automatizado disponível no projeto.

Requer Node.js 24 ou superior, conforme `"engines"` em `package.json`.

# Invariantes de domínio

As regras abaixo são derivadas diretamente de `src/calculate-meeting-cost.js` e
**devem ser preservadas** em qualquer alteração ao código de cálculo:

## Fórmula

O custo total é calculado como:

```
totalCost = participantes × (duracaoMinutos / 60) × custoPorHora
```

A duração é expressa em minutos e convertida para horas dividindo por 60. O
custo por hora é multiplicado pelo tempo em horas e pelo número de participantes.

## Regras de validação

A função `calculateMeetingCost(participants, durationMinutes, costPerHour)` deve
rejeitar entradas inválidas e retornar `{ ok: false, error: string }`:

| Entrada | Condição válida |
| --- | --- |
| `participants` | Número finito, `>= 1` |
| `durationMinutes` | Número finito, `> 0` |
| `costPerHour` | Número finito, `>= 0` |

Valores não finitos (`NaN`, `Infinity`, `-Infinity`) são rejeitados para
**todos** os três parâmetros, com mensagem indicando que todos devem ser números
finitos.

Em caso de sucesso, a função retorna `{ ok: true, totalCost: number }`.

## Separação de responsabilidades

- Toda validação de negócio pertence a `calculateMeetingCost`.
- `cli.js` valida apenas a presença dos três argumentos posicionais e converte
  strings de `process.argv` com `Number()`.
- A formatação de moeda (`Intl.NumberFormat` com locale `pt-BR` e moeda `BRL`)
  pertence exclusivamente à camada CLI.
- Em erros, a CLI define `process.exitCode = 1` e imprime mensagens prefixadas
  com `Erro:` em `stderr` via `console.error`.

Não mova validação de domínio para a CLI nem lógica de apresentação para o
módulo de cálculo. Essa separação é um invariante arquitetural do projeto.

# Restrições técnicas: ESM e dependências

Este projeto usa **ESM exclusivamente**. As seguintes restrições se aplicam:

- `package.json` declara `"type": "module"`. Não use `require()` nem `module.exports`.
- Imports relativos devem incluir a extensão `.js` (ex.: `import { calculateMeetingCost } from "./calculate-meeting-cost.js"`).
- Não há dependências de runtime nem de desenvolvimento instaladas. O projeto usa
  **somente APIs nativas do Node.js** (`process`, `console`, `Intl`, etc.).
- Não adicione dependências npm sem solicitação explícita do usuário.
- Não gere `package-lock.json` neste estágio do repositório.
- O runtime exigido é Node.js 24+, conforme `"engines"`.

Ao adicionar novos módulos em `src/`, mantenha a convenção ESM com extensões
explícitas e exportações nomeadas quando apropriado.

# Validação e tratamento de erros

O projeto possui duas camadas de validação que o agente deve respeitar e manter
coerentes:

## Camada CLI (`src/cli.js`)

Verifica se cada um dos três argumentos posicionais foi informado. Se algum
estiver ausente ou vazio, retorna erro com a mensagem de uso:

```
Uso: npm start -- <participantes> <duracao-minutos> <custo-por-hora>
```

## Camada de domínio (`src/calculate-meeting-cost.js`)

Aplica as regras de negócio descritas na seção de invariantes. As mensagens de
erro de domínio incluem um exemplo acionável (`npm start -- 6 45 120`) para
orientar o usuário.

## Comportamento esperado da saída

- **Entrada válida:** imprime bloco com título `Custo da reunião`, participantes,
  duração, custo por hora formatado e total formatado em BRL via `stdout`.
- **Entrada inválida:** imprime mensagem de erro em `stderr` e define
  `process.exitCode = 1`.

Ao modificar mensagens de erro, mantenha-as acionáveis: diga o que está errado
e, quando possível, mostre o formato correto de invocação. Não silencie erros nem
retorne código de saída 0 para entradas inválidas.

Lembre-se: a validação de números finitos, limites de participantes, duração
positiva e custo não negativo é responsabilidade do domínio, não da CLI.

# Limites de segurança

Este é um utilitário local de linha de comando sem autenticação, rede ou
persistência de dados. Mesmo assim, observe os seguintes limites:

- **Não exponha credenciais.** Não crie arquivos `.env`, não hardcode tokens,
  chaves de API ou segredos em nenhum arquivo do repositório.
- **Não adicione comunicação de rede.** O produto não faz requisições HTTP nem
  abre sockets. Não introduza chamadas de rede sem solicitação explícita.
- **Não execute operações destrutivas no sistema de arquivos** além do escopo
  da tarefa solicitada pelo usuário.
- **Não altere `README.md` nem `LICENSE`** sem instrução explícita.
- **Não faça commit, push ou tag** sem que o usuário solicite.

O projeto não lê arquivos de configuração externos nem variáveis de ambiente
para seu funcionamento atual. Mantenha essa simplicidade a menos que o usuário
peça o contrário.

# Ações que um agente não deve executar

Sem instrução explícita do usuário, o agente **não deve**:

- Criar ou modificar `README.md`, `LICENSE` ou `PROJETO.md`.
- Instalar dependências npm ou gerar `package-lock.json`.
- Criar arquivos de harness: `AGENTS.md` adicional, rules, skills, workflows,
  hooks, configuração MCP, `.gitignore`, CI ou pre-commit.
- Adicionar frameworks de teste, linter, formatter ou typecheck.
- Inventar comandos npm que não existem em `package.json`.
- Mover validação de domínio para `cli.js` ou lógica de apresentação para
  `calculate-meeting-cost.js`.
- Fazer commit, push, tag ou qualquer operação Git destrutiva.
- Adicionar funcionalidades ao produto além do que foi solicitado (servidor,
  persistência, autenticação, interface web, etc.).

Quando em dúvida sobre o escopo, prefira a menor mudança possível que atenda
exatamente ao pedido do usuário.

# Checklist de conclusão

Antes de considerar uma tarefa concluída neste repositório, verifique:

- [ ] A função `calculateMeetingCost` permanece pura, exportada e com a fórmula
      `participantes × (minutos / 60) × custoPorHora`.
- [ ] As regras de validação de domínio estão intactas: finitos, `participantes >= 1`,
      `duracao > 0`, `custo >= 0`.
- [ ] `cli.js` continua responsável apenas por argumentos, formatação BRL e saída.
- [ ] Imports ESM usam extensão `.js` e não há `require()`.
- [ ] Nenhuma dependência npm foi adicionada sem solicitação.
- [ ] `npm start -- 6 45 120` produz saída válida com total `R$ 540,00`.
- [ ] Entradas inválidas retornam mensagem de erro acionável e `exitCode` 1.
- [ ] `README.md`, `LICENSE` e `PROJETO.md` não foram alterados (salvo pedido).
- [ ] Nenhum artefato de harness, teste, lint, CI ou lockfile foi criado sem pedido.
- [ ] Nenhum commit foi feito sem solicitação explícita do usuário.
