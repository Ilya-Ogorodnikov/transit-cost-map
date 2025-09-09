import { memo } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { selectFromIdSite } from "../../store/uiSlice/selectors";
import { selectFrom } from "../../store/uiSlice";
import { Legend } from "../Legend";
import { SIDEBAR_TEXTS } from "../../constants";
import styles from './Sidebar.module.css';

/**
 * Сайдбар с легендой и кнопкой сброса выбранной остановки
 */
export const Sidebar = memo(() => {
  const dispatch = useAppDispatch();
  const selectedFromId = useAppSelector(selectFromIdSite);

  return (
    <aside className={styles.sidebar}>
      <h1>{SIDEBAR_TEXTS.TITLE}</h1>

      <div className={styles.info}>{SIDEBAR_TEXTS.INFO}</div>

      <div className={styles.controls}>
        <button
          className={styles.ghost}
          onClick={() => dispatch(selectFrom(null))}
          disabled={selectedFromId == null}
        >
          {SIDEBAR_TEXTS.BUTTON_TITLE}
        </button>
      </div>

      <h2 className={styles.legendTitle}>{SIDEBAR_TEXTS.LEGEND_TITLE}</h2>

      <Legend />

      <div className={styles.info}>{SIDEBAR_TEXTS.DATA_INFO}</div>
    </aside>
  );
});
