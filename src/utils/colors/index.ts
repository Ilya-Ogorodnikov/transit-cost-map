import { COLORS } from "../../constants";

/**
 * Возвращает цвет для указанной «стоимости».
 * Пороги:
 * - `≤5`— зелёный;
 * - `(5,15]` — жёлтый;
 * - `(15,30]` — красный;
 * - `>30` — фиолетовый;
 * - `null/undefined/NaN` — чёрный (недостижимо).
 */
export const colorForCost = (cost: number | null | undefined): string => {
  if (cost == null || Number.isNaN(cost)) return COLORS.black;
  if (cost <= 5) return COLORS.green;
  if (cost <= 15) return COLORS.yellow;
  if (cost <= 30) return COLORS.red;
  return COLORS.purple;
};
