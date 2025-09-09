import { describe, it, expect } from 'vitest'
import { getMarkerProps } from './'
import { colorForCost } from '../colors'
import { COLORS } from '../../constants'
import type { Site } from '../../types'

const mkSite = (id: number, name: string, lon = 37.6, lat = 55.75): Site => ({
  site_id: id,
  site_name: name,
  longitude: lon,
  latitude: lat,
})

describe('getMarkerProps', () => {
  it('возвращает нейтральный цвет и стандартные размеры, когда выбор не задан', () => {
    const site = mkSite(1, 'A')
    const res = getMarkerProps({ site, selectedFromId: null, costsFrom: null })

    expect(res.isOrigin).toBe(false)
    expect(res.radius).toBe(6)
    expect(res.weight).toBe(1)
    expect(res.color).toBe(COLORS.neutral)
    expect(res.costRec).toBeUndefined()
    expect(res.cost).toBeUndefined()
  })

  it('помечает выбранную исходную точку: увеличенный маркер и цвет origin', () => {
    const site = mkSite(1, 'A')
    const res = getMarkerProps({ site, selectedFromId: 1, costsFrom: {} })

    expect(res.isOrigin).toBe(true)
    expect(res.radius).toBe(10)
    expect(res.weight).toBe(2)
    expect(res.color).toBe(COLORS.origin)
    // даже если costsFrom передан, для origin не подтягиваем стоимость
    expect(res.costRec).toBeUndefined()
    expect(res.cost).toBeUndefined()
  })

  it('для другой точки берёт цвет из colorForCost, если есть запись в costsFrom', () => {
    const fromId = 1
    const siteB = mkSite(2, 'B')
    const costsFrom = {
      [siteB.site_id]: { cost: 6, iwait: 1, inveht: 4, xnum: 0, xpen: 0 },
    }

    const res = getMarkerProps({ site: siteB, selectedFromId: fromId, costsFrom })

    expect(res.isOrigin).toBe(false)
    expect(res.costRec).toEqual(costsFrom[siteB.site_id])
    expect(res.cost).toBe(6)
    expect(res.color).toBe(colorForCost(6))
    expect(res.radius).toBe(6)
    expect(res.weight).toBe(1)
  })

  it('если записи в costsFrom нет — цвет чёрный (недостижимо)', () => {
    const fromId = 1
    const siteC = mkSite(3, 'C')
    const costsFrom = {
      // нет записи для id 3
    } as Record<number, { cost: number; iwait: number; inveht: number; xnum: number; xpen: number }>

    const res = getMarkerProps({ site: siteC, selectedFromId: fromId, costsFrom })

    expect(res.isOrigin).toBe(false)
    expect(res.costRec).toBeUndefined()
    expect(res.cost).toBeUndefined()
    expect(res.color).toBe(COLORS.black)
  })
})
