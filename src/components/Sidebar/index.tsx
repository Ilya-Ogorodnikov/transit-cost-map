import { memo } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { selectFromIdSite } from "../../store/uiSlice/selectors";
import { selectFrom } from "../../store/uiSlice";
import { Legend } from "../Legend";
import { SIDEBAR_TEXTS } from "../../constants";

/**
 * Сайдбар с легендой и кнопкой сброса выбранной остановки
 */
export const Sidebar = memo(() => {
  const dispatch = useAppDispatch();
  const selectedFromId = useAppSelector(selectFromIdSite);

  return (
    <aside className="sidebar">
      <h1>{SIDEBAR_TEXTS.TITLE}</h1>

      <div className="info">{SIDEBAR_TEXTS.INFO}</div>

      <div className="controls">
        <button
          className="ghost"
          onClick={() => dispatch(selectFrom(null))}
          disabled={selectedFromId == null}
        >
          {SIDEBAR_TEXTS.BUTTON_TITLE}
        </button>
      </div>

      <h2 style={{ fontSize: 14, margin: "16px 0 8px" }}>{SIDEBAR_TEXTS.LEGEND_TITLE}</h2>

      <Legend />

      <div style={{ marginTop: 16 }} className="info">
        {SIDEBAR_TEXTS.DATA_INFO}
      </div>
    </aside>
  );
});
