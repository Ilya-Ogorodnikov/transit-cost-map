import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/** UI‑срез: хранит выбранную исходную остановку. */
export type UIState = {
  /** Выбранная исходная остановка (id). `null` — выбора нет. */
  selectedFromId: number | null;
};

const initialState: UIState = { selectedFromId: null };

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    /** Устанавливает/сбрасывает выбранную исходную остановку. */
    selectFrom(state, action: PayloadAction<number | null>) {
      state.selectedFromId = action.payload;
    },
  },
});

export const { selectFrom } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
