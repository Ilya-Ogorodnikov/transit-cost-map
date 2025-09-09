import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Papa from "papaparse";
import { z } from "zod";
import type { Site, CostRow, CostsByFrom } from "../../types";

/** Zod‑схема строки `sites.csv`. */
const siteSchema = z.object({
  site_id: z.coerce.number(),
  site_name: z.string(),
  longitude: z.coerce.number(),
  latitude: z.coerce.number(),
});

/** Zod‑схема строки `costs.csv`. */
const costSchema = z.object({
  site_id_from: z.coerce.number(),
  site_id_to: z.coerce.number(),
  iwait: z.coerce.number(),
  inveht: z.coerce.number(),
  xpen: z.coerce.number(),
  xnum: z.coerce.number(),
  cost: z.coerce.number(),
});

/**
* Загружает CSV из `/data`  и преобразует их в строготипизированные структуры
*
* - Парсинг через PapaParse
* - Валидация каждой строки через `zod`
* - Сборка справочника `costsByFrom[fromId][toId] = CostRow` для быстрых поисков
*/
export const loadData = createAsyncThunk("data/load", async (_, { rejectWithValue }) => {
  try {
    const [sitesCsv, costsCsv] = await Promise.all([
      fetch(`${import.meta.env.BASE_URL}data/sites.csv`).then((r) => r.text()),
      fetch(`${import.meta.env.BASE_URL}data/costs.csv`).then((r) => r.text()),
    ]);
  
    const sitesParsed = Papa.parse<Record<string, string>>(sitesCsv, {
      delimiter: ";",
      header: true,
      skipEmptyLines: true,
    });
  
    const costsParsed = Papa.parse<Record<string, string>>(costsCsv, {
      delimiter: ";",
      header: true,
      skipEmptyLines: true,
    });
  
    const sites: Site[] = sitesParsed.data.map((r, _) => siteSchema.parse(r));
    const costs: CostRow[] = costsParsed.data.map((r) => costSchema.parse(r));
  
    const byFrom = costs.reduce<CostsByFrom>((acc, row) => {
      (acc[row.site_id_from] ??= {})[row.site_id_to] = row
      return acc
    }, {})
  
    return { sites, costsByFrom: byFrom };
    
  } catch (error) {
    return rejectWithValue(error)
  }
});

/**
* Срез данных
*/
export type DataState = {
  /** Список остановок из `sites.csv` */
  sites: Site[];

  /** Вложенная карта стоимостей из `costs.csv` */
  costsByFrom: CostsByFrom;

  /** Статус загрузки */
  status: "idle" | "loading" | "ready" | "error";

  /** Сообщение об ошибке (если есть) */
  error?: string;
};

const initialState: DataState = {
  sites: [],
  costsByFrom: {},
  status: "idle",
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadData.fulfilled, (state, action) => {
        state.sites = action.payload.sites;
        state.costsByFrom = action.payload.costsByFrom;
        state.status = "ready";
      })
      .addCase(loadData.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message
      });
  },
});

export const dataReducer = dataSlice.reducer;
