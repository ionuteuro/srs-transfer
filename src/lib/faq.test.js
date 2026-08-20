import { describe, it, expect } from 'vitest'
import { getAnswer } from './faq.js'

describe('getAnswer (agent FAQ)', () => {
  it('răspunde la preț', () => {
    expect(getAnswer('cât costă o cursă?')).toMatch(/800/)
  })
  it('răspunde la mașini', () => {
    expect(getAnswer('aveți un Logan?')).toMatch(/Logan/)
  })
  it('răspunde la rambursare', () => {
    expect(getAnswer('pot returna banii?')).toMatch(/24h/)
  })
  it('răspunde default la întrebări necunoscute', () => {
    expect(getAnswer('salut')).toMatch(/asistentul SRS/)
  })
})
