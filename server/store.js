import db from './db.js'

export function listAppointments() {
  return db
    .prepare('SELECT * FROM appointments ORDER BY createdAt DESC, id DESC')
    .all()
}

export function addAppointment(a) {
  const now = new Date().toISOString()
  const info = db
    .prepare(
      `INSERT INTO appointments
        (orderId, name, phone, email, vehicle, trip, seats, departDate, departTime,
         returnDate, returnTime, pickup, amount, details, status, createdAt)
       VALUES
        (@orderId, @name, @phone, @email, @vehicle, @trip, @seats, @departDate, @departTime,
         @returnDate, @returnTime, @pickup, @amount, @details, 'in_asteptare', @createdAt)`
    )
    .run({
      orderId: a.orderId || `SRS-${Date.now()}`,
      name: a.name || '',
      phone: a.phone || '',
      email: a.email || '',
      vehicle: a.vehicle || '',
      trip: a.trip || 'dusIntors',
      seats: a.seats || 1,
      departDate: a.departDate || '',
      departTime: a.departTime || '',
      returnDate: a.returnDate || '',
      returnTime: a.returnTime || '',
      pickup: a.pickup || '',
      amount: a.amount || 0,
      details: a.details || '',
      createdAt: now,
    })
  return db.prepare('SELECT * FROM appointments WHERE id = ?').get(info.lastInsertRowid)
}

export function updateStatus(orderId, status) {
  const rec = db
    .prepare('SELECT * FROM appointments WHERE orderId = ? OR id = CAST(? AS INTEGER)')
    .get(orderId, orderId)
  if (!rec) return null
  db.prepare('UPDATE appointments SET status = ? WHERE id = ?').run(status, rec.id)
  return { ...rec, status }
}

const EDITABLE = [
  'name', 'phone', 'email', 'vehicle', 'trip', 'seats',
  'departDate', 'departTime', 'returnDate', 'returnTime', 'pickup', 'amount', 'details',
]

export function updateAppointment(idOrOrder, patch) {
  const rec = db
    .prepare('SELECT * FROM appointments WHERE orderId = ? OR id = CAST(? AS INTEGER)')
    .get(idOrOrder, idOrOrder)
  if (!rec) return null
  const cols = []
  const vals = []
  for (const k of EDITABLE) {
    if (k in patch) {
      cols.push(`${k} = ?`)
      vals.push(patch[k])
    }
  }
  if (!cols.length) return rec
  vals.push(rec.id)
  db.prepare(`UPDATE appointments SET ${cols.join(', ')} WHERE id = ?`).run(...vals)
  return db.prepare('SELECT * FROM appointments WHERE id = ?').get(rec.id)
}
