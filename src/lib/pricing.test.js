import { describe, it, expect } from 'vitest'
import { priceFor } from './pricing.js'

describe('priceFor', () => {
  it('Logan dus = 89', () => {
    expect(priceFor('logan', 'dus', 1).total).toBe(89)
  })
  it('Logan dus-întors = 159', () => {
    const r = priceFor('logan', 'dusIntors', 1)
    expect(r.base).toBe(159)
    expect(r.total).toBe(159)
  })
  it('Corolla dus-întors = 199', () => {
    expect(priceFor('corolla', 'dusIntors', 1).total).toBe(199)
  })
  it('locul 5 adaugă 10 RON', () => {
    expect(priceFor('logan', 'dus', 5).total).toBe(99)
  })
  it('id necunoscut revine la prima mașină', () => {
    expect(priceFor('xyz', 'dus', 1).total).toBe(89)
  })
})
