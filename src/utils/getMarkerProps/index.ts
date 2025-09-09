import { COLORS } from "../../constants";
import { Site } from "../../types"
import { colorForCost } from "../colors";

interface IGetMarkerParams {
  site: Site;
  selectedFromId: number | null;
  costsFrom: Record<number, { cost: number; iwait: number; inveht: number; xnum: number; xpen: number }> | null
}

/**
 * Утилита для получения пропсов маркера и тултипа в нем
 */
export const getMarkerProps = ({ costsFrom, selectedFromId, site }: IGetMarkerParams) => {
  const isOrigin = selectedFromId === site.site_id;
  const costRec =
    !isOrigin && costsFrom ? costsFrom[site.site_id] : undefined;
  const cost = costRec?.cost;
  const radius = isOrigin ? 10 : 6;
  const weight = isOrigin ? 2 : 1;

    /**
     * Правила цвета:
     * - без выбора → нейтральный
     * - origin → голубой highlight
     * - прочие → по стоимости;
     * - если нет записи — чёрный
     */
  const color =
    selectedFromId == null
      ? COLORS.neutral
      : isOrigin
      ? COLORS.origin
      : colorForCost(cost);

  return {
    isOrigin,
    costRec,
    cost,
    radius,
    weight,
    color
  }
}