import {
  MapContainer,
  TileLayer,
  CircleMarker,
} from "react-leaflet";
import type { Site } from "../../types";
import { ResetOnMapClick } from "./components/ResetOnMapClick";
import { Tooltip } from "./components/Tooltip";
import { useMapView } from "./hooks/useMapView";
import { getMarkerProps } from "../../utils/getMarkerProps";

/** Пропсы интерактивной карты. */
export type MapViewProps = {
  /** Список всех остановок. */
  sites: Site[]
  /** Текущий выбранный origin (id) или `null`. */
  selectedFromId: number | null
  /** Стоимости для текущего origin по ключу id назначения; `null`, если origin не выбран. */
  costsFrom: Record<number, { cost: number; iwait: number; inveht: number; xnum: number; xpen: number }> | null
  /** Колбэк выбора/сброса (передайте id или `null`). */
  onSelect: (siteId: number | null) => void
  }

/**
* Интерактивная карта Leaflet с круговыми маркерами.
*
* - Инициализирует вид по всем точкам через `bounds` только на первом рендере.
* - Клик по карте очищает выбор, клик по маркеру — выбирает origin.
* - Цвет маркеров отражает «стоимость» до выбранного origin; недостижимые — чёрные.
*/
export const MapView = ({
  sites,
  selectedFromId,
  costsFrom,
  onSelect,
}: MapViewProps) => {
  const { initialBounds, setMap, handleResent } = useMapView({ onSelect, sites })

  return (
    <MapContainer
    {...(initialBounds
      ? { bounds: initialBounds }
      : { center: [55.75, 37.6], zoom: 12 })}
      style={{ width: "100%", height: "100%" }}
      ref={setMap}
    >
      {/* Сброс выбора кликом по карте */}
      <ResetOnMapClick onReset={handleResent}/>

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {sites.map((site) => {
        const { color, costRec, isOrigin, radius, weight} = getMarkerProps({ costsFrom, selectedFromId, site })

        return (
          <CircleMarker
            key={site.site_id}
            center={[site.latitude, site.longitude]}
            radius={radius}
            pathOptions={{
              color: color,
              fillColor: color,
              fillOpacity: 0.9,
              weight,
            }}
            /** Запрещаем всплытие клика к карте, чтобы не срабатывал сброс */ 
            bubblingMouseEvents={false}
            eventHandlers={{
              click: () => {
                onSelect(site.site_id);
              },
            }}
          >
            <Tooltip site={site} costRec={costRec} isOrigin={isOrigin} selectedFromId={selectedFromId} />
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
