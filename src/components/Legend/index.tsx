import { memo } from "react";
import { COLORS, LEGEND_COLORS } from "../../constants";

/**
 * Компонент легенды по цветам и времени в пути в боковом меню
 */
export const Legend = memo(() => {
  return (
    <div className="legend">
      {Object.entries(LEGEND_COLORS).map(([color, timeToPoint]) => (
        <div key={color} className="row">
          <span className="swatch" style={{ background: COLORS[color as keyof typeof COLORS] }} />{timeToPoint}
        </div>
      ))}
    </div>
  );
});
