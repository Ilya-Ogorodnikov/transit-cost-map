// src/utils/geo.test.ts
import { describe, it, expect } from 'vitest'
import { getBounds } from './'
import type { Site } from '../../types'

/**
 * Хелпер: быстро создать Site
 */
const mk = (id: number, name: string, lon: number, lat: number): Site => ({
  site_id: id,
  site_name: name,
  longitude: lon,
  latitude: lat,
})

describe('getBounds', () => {
  it('возвращает одинаковые углы для одной точки', () => {
    const a = mk(1, 'A', 37.6, 55.77)
    const bounds = getBounds([a])

    expect(bounds).toEqual([
      [55.77, 37.6],
      [55.77, 37.6],
    ])
  })

  it('корректно считает min/max по широте и долготе для нескольких точек', () => {
    const a = mk(1, 'A', 37.6, 55.77)
    const b = mk(2, 'B', 37.59, 55.79)
    const c = mk(3, 'C', 37.61, 55.76)

    const bounds = getBounds([a, b, c])

    // ожидаем [[minLat, minLon], [maxLat, maxLon]]
    expect(bounds).toEqual([
      [55.76, 37.59],
      [55.79, 37.61],
    ])
  })

  it('сохраняет порядок Leaflet: [lat, lon]', () => {
    const sf = mk(1, 'SF', -122.4194, 37.7749)
    const lon = mk(2, 'London', -0.1278, 51.5074)

    // @ts-expect-error для моков
    const [[minLat, minLon], [maxLat, maxLon]] = getBounds([sf, lon])

    // Проверяем именно порядок: сначала широта, потом долгота
    expect(minLat).toBeCloseTo(37.7749, 5) // min широта
    expect(minLon).toBeCloseTo(-122.4194, 5) // min долгота
    expect(maxLat).toBeCloseTo(51.5074, 5) // max широта
    expect(maxLon).toBeCloseTo(-0.1278, 5) // max долгота
  })
})
