import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { Site } from '../../types'

// hoisted mocks (чтобы не ловить проблемы с hoisting у vi.mock)
const { useMapViewReturn, useMapViewMock, getMarkerPropsMock } = vi.hoisted(() => {
  return {
    useMapViewReturn: {
      initialBounds: null as any,
      setMap: vi.fn(),
      handleResent: vi.fn(),
    },
    useMapViewMock: vi.fn(() => ({})),
    getMarkerPropsMock: vi.fn(() => ({})),
  }
})

// Мокаем хук useMapView (возвращаем объект выше)
vi.mock('./hooks/useMapView', () => ({
  // @ts-expect-error
  useMapView: (...args: any[]) => useMapViewMock(...args),
}))

// Мокаем утилиту getMarkerProps (вернём подготовленные значения ниже)
vi.mock('../../utils/getMarkerProps', () => ({
  // @ts-expect-error
  getMarkerProps: (...args: any[]) => getMarkerPropsMock(...args),
}))

// Мокаем Tooltip (просто помечаем, что он отрендерился, и прокидываем ключевые пропсы)
vi.mock('./components/Tooltip', () => ({
  Tooltip: ({ site, isOrigin }: any) => (
    <span data-testid={`tooltip-${site.site_id}`} data-is-origin={String(!!isOrigin)} />
  ),
}))

// Мокаем ResetOnMapClick — отрисовываем кнопку, которая вызовет onReset при клике
vi.mock('./components/ResetOnMapClick', () => ({
  ResetOnMapClick: ({ onReset }: { onReset: () => void }) => (
    <button data-testid="reset" onClick={() => onReset()} />
  ),
}))

// Мокаем react-leaflet: возвращаем лёгкие «заглушки»
vi.mock('react-leaflet', () => {
  // Важно: используем новый JSX-трансформ, импорт React здесь не нужен
  const MapContainer = ({ children, ...props }: any) => (
    <div
      data-testid="map-container"
      data-bounds={props.bounds ? JSON.stringify(props.bounds) : ''}
      data-center={props.center ? JSON.stringify(props.center) : ''}
      data-zoom={props.zoom ?? ''}
      // ref={setMap} мы в тестах не проверяем — forwardRef не подменяем
    >
      {children}
    </div>
  )

  const TileLayer = (props: any) => (
    <div data-testid="tile-layer" data-url={props.url} />
  )

  // Кружок-маркер рендерим как кнопку с data-* атрибутами; по клику зовём eventHandlers.click
  const CircleMarker = ({ center, radius, pathOptions, eventHandlers, children, ...rest }: any) => (
    <button
      data-testid={`marker-${center?.[0]}-${center?.[1]}`}
      data-center={JSON.stringify(center)}
      data-radius={radius}
      data-color={pathOptions?.color}
      data-weight={pathOptions?.weight ?? rest.weight}
      onClick={() => eventHandlers?.click?.()}
    >
      {children}
    </button>
  )

  return { MapContainer, TileLayer, CircleMarker }
})

// Импортируем тестируемый компонент (после моков)
import { MapView } from './' 

// хелпер
const mkSite = (id: number, name: string, lon = 37.6, lat = 55.76): Site => ({
  site_id: id,
  site_name: name,
  longitude: lon,
  latitude: lat,
})

beforeEach(() => {
  // Сбрасываем моки перед каждым кейсом
  useMapViewReturn.initialBounds = null
  useMapViewReturn.setMap = vi.fn()
  useMapViewReturn.handleResent = vi.fn()
  useMapViewMock.mockReturnValue(useMapViewReturn)

  getMarkerPropsMock.mockReset()
  // @ts-expect-error
  getMarkerPropsMock.mockImplementation(({ site }: any) => ({
    isOrigin: false,
    costRec: undefined,
    cost: undefined,
    radius: 6,
    weight: 1,
    color: '#ff0000',
    site,
  }))
})

describe('<MapView />', () => {
  it('использует bounds, если initialBounds есть', () => {
    useMapViewReturn.initialBounds = [[55.7, 37.5], [55.8, 37.7]]

    render(
      <MapView
        sites={[mkSite(1, 'A')]}
        selectedFromId={null}
        costsFrom={null}
        onSelect={() => {}}
      />
    )

    const container = screen.getByTestId('map-container')
    expect(container.getAttribute('data-bounds')).toBe(JSON.stringify([[55.7, 37.5], [55.8, 37.7]]))
    expect(container.getAttribute('data-center')).toBe('') // center/zoom не должны проставляться
    expect(container.getAttribute('data-zoom')).toBe('')
  })

  it('использует center/zoom по умолчанию, если initialBounds = null', () => {
    useMapViewReturn.initialBounds = null

    render(
      <MapView
        sites={[mkSite(1, 'A')]}
        selectedFromId={null}
        costsFrom={null}
        onSelect={() => {}}
      />
    )

    const container = screen.getByTestId('map-container')
    expect(container.getAttribute('data-bounds')).toBe('')
    expect(container.getAttribute('data-center')).toBe(JSON.stringify([55.75, 37.6]))
    expect(container.getAttribute('data-zoom')).toBe('12')
  })

  it('рендерит маркеры по списку остановок и клики вызывают onSelect с id', () => {
    const sites = [mkSite(1, 'A', 37.6, 55.76), mkSite(2, 'B', 37.61, 55.77)]
    const onSelect = vi.fn()

    render(
      <MapView
        sites={sites}
        selectedFromId={1}
        costsFrom={{}}
        onSelect={onSelect}
      />
    )

    // getMarkerProps должен вызываться для каждой точки
    expect(getMarkerPropsMock).toHaveBeenCalledTimes(sites.length)

    // Проверяем, что маркеры есть и у них «приехали» наши пропсы (color/radius/weight)
    const m1 = screen.getByTestId('marker-55.76-37.6')
    const m2 = screen.getByTestId('marker-55.77-37.61')
    expect(m1.getAttribute('data-radius')).toBe('6')
    expect(m1.getAttribute('data-color')).toBe('#ff0000')

    // Клик по маркеру вызывает onSelect(id)
    fireEvent.click(m1)
    expect(onSelect).toHaveBeenCalledWith(1)

    fireEvent.click(m2)
    expect(onSelect).toHaveBeenCalledWith(2)
  })

  it('Tooltip получает пропсы из getMarkerProps (isOrigin) и отрисовывается', () => {
    // Подменим поведение для первой точки: isOrigin = true
    // @ts-expect-error
    getMarkerPropsMock.mockImplementationOnce(({ site }: any) => ({
      isOrigin: true,
      costRec: undefined,
      cost: undefined,
      radius: 10,
      weight: 2,
      color: '#00e5ff',
      site,
    }))

    const sites = [mkSite(1, 'A'), mkSite(2, 'B')]
    render(
      <MapView
        sites={sites}
        selectedFromId={1}
        costsFrom={{}}
        onSelect={() => {}}
      />
    )

    const tt1 = screen.getByTestId('tooltip-1')
    const tt2 = screen.getByTestId('tooltip-2')
    expect(tt1.getAttribute('data-is-origin')).toBe('true')
    expect(tt2.getAttribute('data-is-origin')).toBe('false')
  })

  it('ResetOnMapClick вызывает handleResent (через onReset)', () => {
    render(
      <MapView
        sites={[mkSite(1, 'A')]}
        selectedFromId={null}
        costsFrom={null}
        onSelect={() => {}}
      />
    )

    fireEvent.click(screen.getByTestId('reset'))
    expect(useMapViewReturn.handleResent).toHaveBeenCalledTimes(1)
  })
})
