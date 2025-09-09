import { describe, it, expect } from 'vitest'
import { colorForCost } from '../colors'
import { COLORS } from '../../constants'

describe('colorForCost', () => {
  it('возвращает чёрный для null/undefined/NaN', () => {
    expect(colorForCost(null)).toBe(COLORS.black)
    expect(colorForCost(undefined)).toBe(COLORS.black)
    expect(colorForCost(Number.NaN)).toBe(COLORS.black)
  })

  it('правильно бинит по порогам', () => {
    expect(colorForCost(0)).toBe(COLORS.green)
    expect(colorForCost(5)).toBe(COLORS.green)
    expect(colorForCost(6)).toBe(COLORS.yellow)
    expect(colorForCost(15)).toBe(COLORS.yellow)
    expect(colorForCost(16)).toBe(COLORS.red)
    expect(colorForCost(30)).toBe(COLORS.red)
    expect(colorForCost(31)).toBe(COLORS.purple)
  })
})
