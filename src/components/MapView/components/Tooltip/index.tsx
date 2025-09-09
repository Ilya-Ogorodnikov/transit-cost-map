import { Tooltip as LeafletTooltip } from "react-leaflet"
import { Site } from "../../../../types"
import { FC } from "react";
import { TOOLTIP_TEXTS } from "../../../../constants";

interface ITooltipProps {
  site: Site;
  selectedFromId: number | null;
  isOrigin: boolean;
  costRec:{
    cost: number;
    iwait: number;
    inveht: number;
    xnum: number;
    xpen: number;
} | undefined
}
/**
 * Тултип на точке остановки
 */
export const Tooltip: FC<ITooltipProps> = ({ site, costRec, isOrigin, selectedFromId }) => {
  return (
    <LeafletTooltip
    direction="top"
    offset={[0, -8]}
    opacity={1}
    permanent={false}
    sticky
  >
    <div>
      <div>
        <strong>#{site.site_id}</strong> — {site.site_name}
      </div>

      {selectedFromId !== null && !isOrigin && (
        <div style={{ marginTop: 6 }}>
          <hr />

          {costRec ? (
            <div style={{ fontSize: 12, lineHeight: 1.3 }}>
              <div>
                <strong>{TOOLTIP_TEXTS.COST}</strong>: {costRec.cost.toFixed(2)} мин
              </div>

              <div>
                <strong>{TOOLTIP_TEXTS.IWAIT}</strong>: {costRec.iwait.toFixed(2)} мин
              </div>

              <div>
                <strong>{TOOLTIP_TEXTS.INVEHT}</strong>: {costRec.inveht.toFixed(2)}{" "}
                мин
              </div>

              <div>
                <strong>{TOOLTIP_TEXTS.XNUM}</strong>: {costRec.xnum}
              </div>

              <div>
                <strong>{TOOLTIP_TEXTS.XPEN}</strong>: {costRec.xpen.toFixed(2)} мин
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 12, lineHeight: 1.3 }}>
              {TOOLTIP_TEXTS.NOT_SUPPORTED}
            </div>
          )}
        </div>
      )}
    </div>
  </LeafletTooltip>
  )
}