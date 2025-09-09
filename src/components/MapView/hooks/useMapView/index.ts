import { useState, useEffect, useMemo, useCallback } from "react";
import { getBounds } from "../../../../utils/geo";
import { Map } from "leaflet";
import { Site } from "../../../../types";

interface IUseMapViewParams {
  sites: Site[];
  onSelect: (siteId: number | null) => void;
}

/**
 * Хук для подготовки данных компонента MapView
 */
export const useMapView = ({ onSelect, sites}: IUseMapViewParams) => {
  const [map, setMap] = useState<Map | null>(null)

  /** Сброс точки при клике на карту вне точек */
  useEffect(() => {
    if (map) {
      map.on("click", () => onSelect(null));
    }
  }, [map])

  /** Считаем bounds один раз по данным и используем ТОЛЬКО для стартового вью */ 
  const initialBounds = useMemo(() => {
    if (!sites.length) return null

    return getBounds(sites)
  }, [sites]);

  /** Сброс выбранной точки */
  const handleResent = useCallback(() => {
    onSelect(null)
  }, [onSelect])

  return {
    initialBounds,
    setMap,
    handleResent
  }
}