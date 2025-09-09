/**
* Данные об остановке общественного транспорта из `sites.csv`.
*/
export type Site = {
  /** Уникальный числовой идентификатор остановки */
  site_id: number;

  /** Название остановки */
  site_name: string;

  /** Долгота */
  longitude: number;

  /** Широта */
  latitude: number;
};

/**
* Метрики для направленной пары «из → в» из `costs.csv`.
* Все величины времени — в **минутах**.
*/
export type CostRow = {
  /** Идентификатор начальной остановки */
  site_id_from: number;

  /** Идентификатор конечной остановки */
  site_id_to: number;

  /** Время ожидания (мин) */
  iwait: number;

  /** Время в пути (мин) */
  inveht: number;

  /** Штраф за пересадки (мин) */
  xpen: number;

  /** Количество пересадок (шт) */
  xnum: number;

  /** Обобщённая «стоимость» (мин), используется для раскраски */
  cost: number;
};

/**
* Вложенная структура для O(1)-доступа к стоимости любой пары.
* Использование: `costsByFrom[fromId][toId] -> CostRow`.
*/
export type CostsByFrom = Record<number, Record<number, CostRow>>;
