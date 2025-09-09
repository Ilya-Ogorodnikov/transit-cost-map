/** Палитра цветов для маркеров и легенды. */
export const COLORS = {
  /** cost ≤ 5 */
  green: "#22c55e",

  /** 5 < cost ≤ 15 */
  yellow: "#f59e0b",

  /** 15 < cost ≤ 30 */
  red: "#ef4444",

  /** cost > 30 */
  purple: "#5b21b6",

  /** недостижимо (нет записи в costs.csv) */
  black: "#000000",

  /** нейтральный цвет при отсутствии выбора */
  neutral: "#94a3b8",

  /** подсветка выбранной исходной точки */
  origin: "#00e5ff",
};

/**
 * Объект для контента легенды в боковом меню
 */
export const LEGEND_COLORS: Record<Exclude<keyof typeof COLORS, 'neutral' | 'origin'>, string> = {
  green: '≤ 5 мин',
  yellow: '5–15 мин',
  red: '15–30 мин',
  purple: '> 30 мин',
  black: 'нельзя доехать'
}

/**
 * Текстовые константы для тултипа
 */
export const TOOLTIP_TEXTS = {
  COST: 'Агрегированные затраты',
  IWAIT: 'Время ожидания',
  INVEHT: 'Время в салоне',
  XNUM: 'Число пересадок',
  XPEN: 'Штраф за пересадки',
  NOT_SUPPORTED: 'Недостижимо',
}

/**
 * Текстовые константы для сайдбара
 */
export const SIDEBAR_TEXTS = {
  TITLE: 'Transit Costs Map',
  INFO: 'Выберите начальную остановку — остальные окрасим по значению cost. Клик по фону очистит выбор.',
  BUTTON_TITLE: 'Сбросить выбор',
  LEGEND_TITLE: 'Легенда',
  DATA_INFO: 'Данные — локальные CSV',
}