import { describe, it, expect, vi } from 'vitest'
import { act } from 'react'
import { renderHook, waitFor } from '@testing-library/react'

// 1) Объявляем мок заранее, «поднятый» Vitest'ом
const { getBoundsMock } = vi.hoisted(() => ({
  getBoundsMock: vi.fn(() => [[55.7, 37.5], [55.8, 37.7]] as const),
}))

// 2) Мокаем модуль utils/geo, возвращая наш поднятый мок
vi.mock('../../../../utils/geo', () => ({
  getBounds: getBoundsMock,
}))

// Теперь импортируем хук (он подтянет замоканный getBounds)
import { useMapView } from '.'
import type { Site } from '../../../../types'

// Хелпер для создания Site
const mkSite = (id: number, name: string, lon = 37.6, lat = 55.76): Site => ({
  site_id: id,
  site_name: name,
  longitude: lon,
  latitude: lat,
})

describe('useMapView', () => {
  it('initialBounds: null при пустом списке; рассчитывается при наличии данных', () => {
    const onSelect = vi.fn()
    const { result, rerender } = renderHook(
      ({ sites }) => useMapView({ sites, onSelect }),
      { initialProps: { sites: [] as Site[] } },
    )

    expect(result.current.initialBounds).toBeNull()
    expect(getBoundsMock).not.toHaveBeenCalled()

    getBoundsMock.mockClear()
    const sites = [mkSite(1, 'A'), mkSite(2, 'B')]
    rerender({ sites })
    expect(getBoundsMock).toHaveBeenCalledWith(sites)
    expect(result.current.initialBounds).toEqual([[55.7, 37.5], [55.8, 37.7]])
  })

  it('привязывает обработчик клика к карте через setMap и вызывает onSelect(null)', async () => {
    const onSelect = vi.fn()
    const { result } = renderHook(() => useMapView({ sites: [mkSite(1, 'A')], onSelect }))

    // Минимальный мок карты: метод .on(event, handler)
    const handlers: Record<string, Function[]> = {}
    const mockMap = {
      on: (evt: string, cb: Function) => {
        ;(handlers[evt] ||= []).push(cb)
      },
    } as unknown as import('leaflet').Map

    // Обновляем карту в хуке
    act(() => {
      result.current.setMap(mockMap)
    })

    // Дожидаемся, пока useEffect повесит обработчик
    await waitFor(() => {
      expect((handlers.click || []).length).toBeGreaterThan(0)
    })

    // Симулируем клик по карте
    for (const cb of handlers.click!) cb()

    expect(onSelect).toHaveBeenCalledWith(null)
  })


  it('handleResent вызывает onSelect(null)', () => {
    const onSelect = vi.fn()
    const { result } = renderHook(() => useMapView({ sites: [mkSite(1, 'A')], onSelect }))

    act(() => result.current.handleResent())
    expect(onSelect).toHaveBeenCalledWith(null)
  })

})
