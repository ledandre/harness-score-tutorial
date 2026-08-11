/**
 * @typedef {{ ok: true, totalCost: number }} MeetingCostSuccess
 * @typedef {{ ok: false, error: string }} MeetingCostFailure
 * @typedef {MeetingCostSuccess | MeetingCostFailure} MeetingCostResult
 */

/**
 * Calcula o custo total de mão de obra de uma reunião.
 *
 * @param {number} participants Número de participantes (>= 1).
 * @param {number} durationMinutes Duração em minutos (> 0).
 * @param {number} costPerHour Custo por hora por participante (>= 0).
 * @returns {MeetingCostResult}
 */
export function calculateMeetingCost(
  participants,
  durationMinutes,
  costPerHour,
) {
  if (
    !Number.isFinite(participants) ||
    !Number.isFinite(durationMinutes) ||
    !Number.isFinite(costPerHour)
  ) {
    return {
      ok: false,
      error:
        "Todos os valores devem ser números finitos. Exemplo: npm start -- 6 45 120",
    };
  }

  if (participants < 1) {
    return {
      ok: false,
      error:
        "O número de participantes deve ser pelo menos 1. Exemplo: npm start -- 6 45 120",
    };
  }

  if (durationMinutes <= 0) {
    return {
      ok: false,
      error:
        "A duração deve ser maior que zero minutos. Exemplo: npm start -- 6 45 120",
    };
  }

  if (costPerHour < 0) {
    return {
      ok: false,
      error:
        "O custo por hora não pode ser negativo. Exemplo: npm start -- 6 45 120",
    };
  }

  const totalCost = participants * (durationMinutes / 60) * costPerHour;

  return { ok: true, totalCost };
}
