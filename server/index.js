import 'dotenv/config'
import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { listAppointments, addAppointment, updateStatus, updateAppointment } from './store.js'
import { getAnswer } from '../src/lib/faq.js'
import { phoneOk } from '../src/lib/validators.js'
import { priceFor } from '../src/lib/pricing.js'
import { vehicles } from '../src/data/vehicle-catalog.js'
import { notifyNewAppointment, notifyClient, notifyStatusChange, notifyReschedule } from './notifications.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 3001
const ADMIN_TOKEN = process.env.ADMIN_TOKEN
const STATUSES = new Set(['in_asteptare', 'confirmat', 'platit', 'anulat'])

const app = express()
app.use(express.json({ limit: '32kb' }))
app.use(express.urlencoded({ extended: true, limit: '32kb' }))

function adminAuth(req, res, next) {
  if (!ADMIN_TOKEN) return res.status(503).json({ error: 'ADMIN_TOKEN nu este configurat pe server.' })
  if (req.headers['x-admin-token'] !== ADMIN_TOKEN) return res.status(401).json({ error: 'Neautorizat' })
  next()
}

function text(value, limit) {
  return typeof value === 'string' ? value.trim().slice(0, limit) : ''
}

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(value + 'T00:00:00Z')
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
}

function validTime(value) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
}

function bucharestClock() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Bucharest',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date())
  const value = Object.fromEntries(parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]))
  return { date: value.year + '-' + value.month + '-' + value.day, time: value.hour + ':' + value.minute }
}

app.post('/api/appointments', async (req, res) => {
  const body = req.body || {}
  const name = text(body.name, 120)
  const phone = text(body.phone, 24)
  const email = text(body.email, 160)
  const pickup = text(body.pickup, 240)
  const vehicle = text(body.vehicle, 40)
  const trip = body.trip
  const seats = Number(body.seats)
  const departDate = text(body.departDate, 10)
  const departTime = text(body.departTime, 5)
  const returnDate = text(body.returnDate, 10)
  const returnTime = text(body.returnTime, 5)
  const car = vehicles.find((item) => item.id === vehicle)
  const now = bucharestClock()

  if (!name || !phoneOk(phone) || !pickup) return res.status(400).json({ error: 'Completează numele, un telefon valid și adresa de preluare.' })
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Adresa de email nu este validă.' })
  if (!car || !['dus', 'dusIntors'].includes(trip) || !Number.isInteger(seats) || seats < 1 || seats > car.seats) {
    return res.status(400).json({ error: 'Verifică mașina, tipul cursei și numărul de pasageri.' })
  }
  if (!validDate(departDate) || !validTime(departTime) || departDate < now.date || (departDate === now.date && departTime < now.time)) {
    return res.status(400).json({ error: 'Alege o dată și o oră de plecare viitoare.' })
  }
  if (trip === 'dusIntors' && (!validDate(returnDate) || returnDate < departDate || !validTime(returnTime))) {
    return res.status(400).json({ error: 'Verifică data și ora întoarcerii.' })
  }
  if (trip === 'dusIntors' && returnDate === departDate && returnTime <= departTime) {
    return res.status(400).json({ error: 'Ora întoarcerii trebuie să fie după ora plecării.' })
  }

  const appointment = {
    orderId: 'SRS-' + randomUUID().toUpperCase(),
    name,
    phone,
    email,
    pickup,
    vehicle,
    trip,
    seats,
    departDate,
    departTime,
    flightOut: text(body.flightOut, 32),
    returnDate: trip === 'dusIntors' ? returnDate : '',
    returnTime: trip === 'dusIntors' ? returnTime : '',
    flightBack: trip === 'dusIntors' ? text(body.flightBack, 32) : '',
    notes: text(body.notes, 1200),
    amount: priceFor(vehicle, trip, seats).total,
    details: 'Transfer privat Brăila–Otopeni · ' + car.brand + ' ' + car.model + ' · ' + (trip === 'dusIntors' ? 'dus-întors' : 'doar dus'),
  }

  try {
    const record = addAppointment(appointment)
    notifyNewAppointment(record).catch((error) => console.error('notif admin:', error))
    notifyClient(record).catch((error) => console.error('notif client:', error))
    res.status(201).json(record)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Nu s-a putut salva solicitarea.' })
  }
})

app.get('/api/appointments', adminAuth, (req, res) => {
  res.json(listAppointments())
})

app.put('/api/appointments/:id', adminAuth, (req, res) => {
  const status = req.body?.status
  if (!STATUSES.has(status)) return res.status(400).json({ error: 'Status invalid.' })
  const record = updateStatus(req.params.id, status)
  if (!record) return res.status(404).json({ error: 'Nu s-a găsit programarea.' })
  notifyStatusChange(record, status).catch((error) => console.error('notif status:', error))
  res.json(record)
})

app.patch('/api/appointments/:id', adminAuth, (req, res) => {
  const record = updateAppointment(req.params.id, req.body || {})
  if (!record) return res.status(404).json({ error: 'Nu s-a găsit programarea.' })
  notifyReschedule(record).catch((error) => console.error('notif reschedule:', error))
  res.json(record)
})

app.post('/api/agent', async (req, res) => {
  const message = text(req.body?.message, 1000)
  if (process.env.OPENAI_API_KEY && message) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + process.env.OPENAI_API_KEY },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Ești asistentul SRS Transfer pentru curse private Brăila–Aeroportul Otopeni. Răspunde scurt, politicos și în română. Tarifele afișate sunt 800 RON pe sens și 1600 RON dus-întors pentru Dacia Logan și Toyota Corolla; al cincilea pasager adaugă 10 RON. Formularul trimite o solicitare, nu încasează plata și nu confirmă automat ora cursei. Nu inventa telefon, disponibilitate sau urmărire live a zborului.' },
            { role: 'user', content: message },
          ],
        }),
      })
      const data = await response.json()
      if (data.choices?.[0]?.message?.content) return res.json({ reply: data.choices[0].message.content, source: 'llm' })
    } catch (error) {
      console.error('Eroare LLM:', error)
    }
  }
  res.json({ reply: getAnswer(message), source: 'faq' })
})

app.use('/api', (req, res) => res.status(404).json({ error: 'Endpoint API inexistent.' }))

const dist = path.join(__dirname, '..', 'dist')
if (fs.existsSync(dist)) {
  app.use(express.static(dist))
  app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')))
}

app.listen(PORT, () => {
  console.log('SRS Transfer server pe http://localhost:' + PORT)
  console.log(process.env.OPENAI_API_KEY ? 'Agent AI: LLM activat' : 'Agent AI: mod FAQ')
  if (!ADMIN_TOKEN) console.warn('ADMIN_TOKEN trebuie configurat pentru accesul la administrare.')
})
