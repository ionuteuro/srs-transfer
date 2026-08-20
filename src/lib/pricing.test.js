import { describe, it, expect } from 'vitest'
import { priceFor } from './pricing.js'

describe('priceFor', () => {
  it('Logan dus = 800', () => {
    expect(priceFor('logan', 'dus', 1).total).toBe(800)
  })
  it('Logan dus-întors = 1600', () => {
    const r = priceFor('logan', 'dusIntors', 1)
    expect(r.base).toBe(1600)
    expect(r.total).toBe(1600)
  })
  it('Corolla dus-întors = 1600', () => {
    expect(priceFor('corolla', 'dusIntors', 1).total).toBe(1600)
  })
  it('locul 5 adaugă 10 RON', () => {
    expect(priceFor('logan', 'dus', 5).total).toBe(810)
  })
  it('id necunoscut revine la prima mașină', () => {
    expect(priceFor('xyz', 'dus', 1).total).toBe(800)
  })
})
