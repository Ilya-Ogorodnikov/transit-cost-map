import type { LatLngBoundsExpression } from "leaflet";
import type { Site } from "../../types";

/**
* Вычисляет географические границы (min/max) для набора остановок.
* Возвращает кортеж, совместимый с Leaflet: `[[minLat, minLon], [maxLat, maxLon]]`.
*/
export const getBounds = (sites: Site[]): LatLngBoundsExpression => {
  let minLon = Infinity,
    minLat = Infinity,
    maxLon = -Infinity,
    maxLat = -Infinity;

  for (const site of sites) {
    if (site.longitude < minLon) minLon = site.longitude;
    if (site.latitude < minLat) minLat = site.latitude;
    if (site.longitude > maxLon) maxLon = site.longitude;
    if (site.latitude > maxLat) maxLat = site.latitude;
  }

  return [
    [minLat, minLon],
    [maxLat, maxLon],
  ];
}
