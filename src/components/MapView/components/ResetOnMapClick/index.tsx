import { useMapEvents } from "react-leaflet"

/**
* Компонент подписки на клик по «фону» карты для сброса выбора.
* Используем `useMapEvents`, чтобы не зависеть от пропсы `whenCreated` и версий React‑Leaflet.
*/
export const ResetOnMapClick = ({ onReset }: { onReset: () => void }) => {
  useMapEvents({
    click: () => onReset(),
  })
  return null
}