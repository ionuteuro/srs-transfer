import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const dbDir = fs.mkdtempSync(path.join(os.tmpdir(), 'srsdb-'))
process.env.DB_PATH = path.join(dbDir, 'test.db')

let store
beforeAll(async () => {
  store = await import('./store.js')
})

afterAll(() => {
  try {
    fs.rmSync(dbDir, { recursive: true, force: true })
  } catch {
    /* ignore */
  }
})

describe('store (SQLite)', () => {
  it('adaugă și listează o programare', () => {
    const rec = store.addAppointment({
      name: 'Tester',
      phone: '0700000000',
      vehicle: 'logan',
      trip: 'dusIntors',
      seats: 2,
      amount: 159,
      orderId: 'SRS-DB',
    })
    expect(rec.id).toBeTruthy()
    expect(rec.status).toBe('in_asteptare')
    const all = store.listAppointments()
    expect(all.some((a) => a.orderId === 'SRS-DB')).toBe(true)
  })

  it('actualizează statusul', () => {
    const updated = store.updateStatus('SRS-DB', 'confirmat')
    expect(updated).not.toBeNull()
    expect(updated.status).toBe('confirmat')
  })

  it('reprogramează (updateAppointment)', () => {
    const updated = store.updateAppointment('SRS-DB', {
      departDate: '2026-10-01',
      departTime: '08:30',
    })
    expect(updated.departDate).toBe('2026-10-01')
    expect(updated.departTime).toBe('08:30')
  })

  it('returnează null pentru id inexistent', () => {
    expect(store.updateStatus('SRS-NU-EXISTA', 'confirmat')).toBeNull()
  })
})
