import { memo } from "react";
import { COLORS, LEGEND_COLORS } from "../../constants";
import styles from './Legend.module.css'


/**
 * Компонент легенды по цветам и времени в пути в боковом меню
 */
export const Legend = memo(() => {
  return (
    <div className={styles.legend}>
      {Object.entries(LEGEND_COLORS).map(([color, timeToPoint]) => (
        <div key={color} className={styles.row}>
          <span className={styles.swatch} style={{ background: COLORS[color as keyof typeof COLORS] }} />{timeToPoint}
        </div>
      ))}
    </div>
  );
});
