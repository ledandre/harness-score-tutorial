import { calculateMeetingCost } from "./calculate-meeting-cost.js";

const USAGE =
  "Uso: npm start -- <participantes> <duracao-minutos> <custo-por-hora>";

/**
 * @typedef {{ ok: true, value: number } | { ok: false, error: string }} ParseResult
 */

/**
 * @param {string | undefined} raw
 * @param {string} label
 * @returns {ParseResult}
 */
function parsePositiveNumber(raw, label) {
  const value = Number(raw);

  if (raw === undefined || raw === "") {
    return { ok: false, error: `Informe ${label}. ${USAGE}` };
  }

  return { ok: true, value };
}

/**
 * @param {number} amount
 * @returns {string}
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
}

function main() {
  const [, , participantsRaw, durationRaw, costPerHourRaw] = process.argv;

  const participants = parsePositiveNumber(
    participantsRaw,
    "o número de participantes",
  );
  if (!participants.ok) {
    console.error(`Erro: ${participants.error}`);
    process.exitCode = 1;
    return;
  }

  const duration = parsePositiveNumber(durationRaw, "a duração em minutos");
  if (!duration.ok) {
    console.error(`Erro: ${duration.error}`);
    process.exitCode = 1;
    return;
  }

  const costPerHour = parsePositiveNumber(costPerHourRaw, "o custo por hora");
  if (!costPerHour.ok) {
    console.error(`Erro: ${costPerHour.error}`);
    process.exitCode = 1;
    return;
  }

  const result = calculateMeetingCost(
    participants.value,
    duration.value,
    costPerHour.value,
  );

  if (!result.ok) {
    console.error(`Erro: ${result.error}`);
    process.exitCode = 1;
    return;
  }

  console.log("Custo da reunião");
  console.log(`Participantes: ${participants.value}`);
  console.log(`Duração: ${duration.value} min`);
  console.log(`Custo por hora: ${formatCurrency(costPerHour.value)}`);
  console.log(`Total: ${formatCurrency(result.totalCost)}`);
}

main();
