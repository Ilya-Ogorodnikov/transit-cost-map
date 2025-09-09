import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "..";

/** Стейт с остановками */
export const selectSitesState = (state: RootState) => state.data;

/** Селектор выборки всех остановок */
export const selectSites = createSelector(selectSitesState, state => state.sites);

/** Селектор выборки вложенной карты стоимостей */
export const selectCostsByFrom = createSelector(selectSitesState, state => state.costsByFrom);

/** Селектор выборки статуса загрузки данных */
export const selectStatus = createSelector(selectSitesState, state => state.status);

/**
* Фабрика селектора: по `fromId` возвращает все стоимости для данной исходной остановки.
*
* @param fromId Идентификатор начальной остановки или `null`.
* @returns Словарь `toId -> CostRow`, либо `null`, если исходная не выбрана.
*/
export const selectCostsFrom =
  (fromId: number | null) =>
  createSelector(selectSitesState, state => {
    if (fromId == null) return null;
    return state.costsByFrom[fromId] || null;
  });
