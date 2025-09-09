import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "..";

/** Стейт с UI */
const selectUiState = (state: RootState) => state.ui;

/** Селектор выборки текущей выбранной остановки */
export const selectFromIdSite = createSelector(selectUiState, state => state.selectedFromId);