import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { dataReducer } from "./dataSlice";
import { uiReducer } from "./uiSlice";

/**
 * Корневое Redux‑хранилище.
 * Объединяет доменные данные (CSV) и состояние интерфейса (выбор пользователя).
 */
export const store = configureStore({
  reducer: {
    data: dataReducer,
    ui: uiReducer,
  },
});

/** Тип корневого состояния, выведенный из стора. */
export type RootState = ReturnType<typeof store.getState>;

/** Тип диспетчера приложения. */
export type AppDispatch = typeof store.dispatch;

/**
* Типизированный вариант `useDispatch`.
*/
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
* Типизированный вариант `useSelector`.
*/
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;