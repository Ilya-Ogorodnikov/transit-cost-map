import { useEffect } from "react";
import { MapView } from "./components/MapView";
import { Loading } from "./components/Loading";
import { useAppDispatch, useAppSelector } from "./store";
import { loadData } from "./store/dataSlice";
import { selectStatus, selectSites, selectCostsFrom } from "./store/dataSlice/selectors";
import { selectFrom } from "./store/uiSlice";
import { selectFromIdSite } from "./store/uiSlice/selectors";
import { Sidebar } from "./components/Sidebar";

/**
* Корневая компоновка UI: загружает данные, подключает селекторы и рендерит карту + сайдбар.
*/
export const App = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);
  const sites = useAppSelector(selectSites);
  const selectedFromId = useAppSelector(selectFromIdSite);
  const costsFrom = useAppSelector(selectCostsFrom(selectedFromId));

  /** Запускаем загрузку CSV при маунте */
  useEffect(() => {
    dispatch(loadData());
  }, [dispatch]);

  return (
    <div className="app">
      <div style={{ position: "relative" }}>
        {status !== "ready" ? (
          <Loading />
        ) : (
          <MapView
            sites={sites}
            selectedFromId={selectedFromId}
            costsFrom={costsFrom}
            onSelect={(id) => dispatch(selectFrom(id))}
          />
        )}
      </div>

      <Sidebar />
    </div>
  );
}
