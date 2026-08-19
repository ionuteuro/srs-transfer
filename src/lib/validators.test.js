import { describe, it, expect } from 'vitest'
import { luhnOk, expiryOk, phoneOk } from './validators.js'

describe('luhnOk', () => {
  it('acceptă un număr valid (Visa test)', () => {
    expect(luhnOk('4242 4242 4242 4242')).toBe(true)
  })
  it('respinge un număr invalid', () => {
    expect(luhnOk('4242424242424241')).toBe(false)
  })
  it('respinge lungimea greșită', () => {
    expect(luhnOk('1234')).toBe(false)
  })
})

describe('expiryOk', () => {
  it('acceptă o dată viitoare', () => {
    expect(expiryOk('12/30')).toBe(true)
  })
  it('respinge luna invalidă', () => {
    expect(expiryOk('13/30')).toBe(false)
  })
  it('respinge formatul greșit', () => {
    expect(expiryOk('1230')).toBe(false)
  })
})

describe('phoneOk', () => {
  it('acceptă mobil românesc', () => {
    expect(phoneOk('0700123456')).toBe(true)
  })
  it('respinge prea scurt', () => {
    expect(phoneOk('0700')).toBe(false)
  })
})
