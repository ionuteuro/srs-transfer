import 'dotenv/config'
import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  isConfigured,
  encryptRequest,
  decryptResponse,
  paymentUrl,
} from './netopia.js'
import {
  listAppointments,
  addAppointment,
  updateStatus,
  updateAppointment,
} from './store.js'
import { getAnswer } from '../src/lib/faq.js'
import {
  notifyNewAppointment,
  notifyClient,
  notifyStatusChange,
  notifyReschedule,
} from './notifications.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 3001
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'srs-admin'
if (!process.env.ADMIN_TOKEN) {
  console.warn('ADMIN_TOKEN nu e setat → folosesc valoarea demo "srs-admin"')
}

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

function baseUrl(req) {
  if (process.env.PUBLIC_BASE) return process.env.PUBLIC_BASE.replace(/\/$/, '')
  return `${req.protocol}://${req.get('host')}`
}

function adminAuth(req, res, next) {
  const token = req.query.token || req.headers['x-admin-token']
  if (token !== ADMIN_TOKEN) return res.status(401).json({ error: 'Neautorizat' })
  next()
}

app.post('/api/create-payment', (req, res) => {
  const b = req.body
  const amount = Number(b.amount)
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Sumă invalidă' })
  }

  if (!isConfigured()) {
    return res.json({ mock: true })
  }

  const order = {
    orderId: b.orderId || `SRS-${Date.now()}`,
    signature: process.env.NETOPIA_SIGNATURE,
    amount: amount.toFixed(2),
    clientName: b.clientName || 'Client SRS',
    clientPhone: b.clientPhone || '',
    clientEmail: b.clientEmail || '',
    details: b.details || 'Transfer aeroport Otopeni',
    returnUrl: `${baseUrl(req)}/?status=success&order=${b.orderId || ''}`,
    confirmUrl: `${baseUrl(req)}/api/ipn`,
  }

  try {
    const payment = encryptRequest(order)
    res.json(payment)
  } catch (err) {
    console.error('Eroare criptare Netopia:', err)
    res.status(500).json({ error: 'Nu s-a putut iniția plata' })
  }
})

app.post('/api/appointments', async (req, res) => {
  try {
    const rec = addAppointment(req.body || {})
    notifyNewAppointment(rec).catch((e) => console.error('notif admin:', e))
    notifyClient(rec).catch((e) => console.error('notif client:', e))
    res.json(rec)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Nu s-a putut salva programarea' })
  }
})

app.get('/api/appointments', adminAuth, (req, res) => {
  res.json(listAppointments())
})

app.put('/api/appointments/:id', adminAuth, (req, res) => {
  if (!req.body.status) return res.status(400).json({ error: 'Status lipsă' })
  const rec = updateStatus(req.params.id, req.body.status)
  if (!rec) return res.status(404).json({ error: 'Nu s-a găsit' })
  notifyStatusChange(rec, req.body.status).catch((e) =>
    console.error('notif status:', e)
  )
  res.json(rec)
})

app.patch('/api/appointments/:id', adminAuth, (req, res) => {
  const rec = updateAppointment(req.params.id, req.body || {})
  if (!rec) return res.status(404).json({ error: 'Nu s-a găsit' })
  notifyReschedule(rec).catch((e) => console.error('notif reschedule:', e))
  res.json(rec)
})

app.post('/api/ipn', (req, res) => {
  const envKey = req.body.env_key
  const data = req.body.data
  if (!envKey || !data) {
    return res.status(400).send('ERR')
  }
  try {
    const xml = decryptResponse(envKey, data)
    console.log('IPN Netopia primit:', xml)
    const id = /id="([^"]+)"/.exec(xml)?.[1]
    if (id) updateStatus(id, 'platit')
    res.set('Content-Type', 'application/xml')
    res.send(
      `<?xml version="1.0" encoding="utf-8"?><crc>${process.env.NETOPIA_SIGNATURE}</crc>`
    )
  } catch (err) {
    console.error('Eroare decriptare IPN:', err)
    res.status(500).send('ERR')
  }
})

app.get('/api/return', (req, res) => {
  const status = req.query.status
  const order = req.query.order
  res.redirect(`/?status=${status || 'unknown'}&order=${order || ''}`)
})

app.post('/api/agent', async (req, res) => {
  const message = (req.body.message || '').toString()
  if (process.env.OPENAI_API_KEY) {
    try {
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content:
                'Ești asistentul virtual al SRS Transfer, o firmă de transfer aeroport Otopeni dus-întors (București/Ilfov). Răspunde scurt și politicos în română despre prețuri (Dacia Logan 89/159 RON, Toyota Corolla 119/199 RON), mașini, plată cu cardul prin Netopia, rambursare (100% la 24h, 50% la 12-24h) și program 24/7.',
            },
            { role: 'user', content: message },
          ],
        }),
      })
      const j = await r.json()
      if (j.choices?.[0]?.message?.content) {
        return res.json({ reply: j.choices[0].message.content, source: 'llm' })
      }
    } catch (err) {
      console.error('Eroare LLM:', err)
    }
  }
  res.json({ reply: getAnswer(message), source: 'faq' })
})

const dist = path.join(__dirname, '..', 'dist')
if (fs.existsSync(dist)) {
  app.use(express.static(dist))
  app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')))
}

app.listen(PORT, () => {
  console.log(`SRS Transfer server pe http://localhost:${PORT}`)
  console.log(
    isConfigured()
      ? `Netopia CONFIGURAT (${paymentUrl()})`
      : 'Netopia NEconfigurat → mod mock (plata simulată)'
  )
  console.log(
    process.env.OPENAI_API_KEY
      ? 'Agent AI: LLM activat'
      : 'Agent AI: mod FAQ (fără cheie LLM)'
  )
})
