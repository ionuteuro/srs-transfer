import { describe, it, expect, vi } from 'vitest'

const sendMail = vi.hoisted(() => vi.fn())
vi.mock('nodemailer', () => ({ default: { createTransport: () => ({ sendMail }) } }))

import {
  appointmentText,
  sendEmail,
  sendSms,
  notifyNewAppointment,
  notifyClient,
  notifyStatusChange,
  notifyReschedule,
} from './notifications.js'

const appt = {
  name: 'Maria',
  phone: '0711',
  email: 'm@x.ro',
  vehicle: 'corolla',
  trip: 'dusIntors',
  seats: 2,
  departDate: '2026-09-01',
  departTime: '10:00',
  returnDate: '2026-09-10',
  returnTime: '18:00',
  pickup: 'Bucuresti',
  amount: 199,
  orderId: 'SRS-1',
}

describe('appointmentText', () => {
  it('include detaliile programării', () => {
    const t = appointmentText(appt)
    expect(t).toContain('Maria')
    expect(t).toContain('199 RON')
    expect(t).toContain('corolla')
  })
})

describe('sendEmail', () => {
  it('fără SMTP => mock + log', async () => {
    delete process.env.SMTP_HOST
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const r = await sendEmail({ to: 'a@b.c', subject: 'x', text: 'hello' })
    expect(r).toEqual({ mock: true })
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('cu SMTP => trimite prin transport', async () => {
    process.env.SMTP_HOST = 'smtp.test'
    process.env.SMTP_FROM = 'from@x.ro'
    sendMail.mockResolvedValue({ messageId: 'abc' })
    const r = await sendEmail({ to: 'a@b.c', subject: 'sub', text: 'txt' })
    expect(r.id).toBe('abc')
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'a@b.c', subject: 'sub', text: 'txt', from: 'from@x.ro' })
    )
    delete process.env.SMTP_HOST
  })
})

describe('sendSms', () => {
  it('fără Twilio => mock + log', async () => {
    delete process.env.TWILIO_ACCOUNT_SID
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const r = await sendSms({ to: '+40711', text: 'hi' })
    expect(r).toEqual({ mock: true })
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
})

describe('notifyNewAppointment', () => {
  it('cu ADMIN_EMAIL trimite notificare (mock)', async () => {
    process.env.ADMIN_EMAIL = 'admin@x.ro'
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
    await notifyNewAppointment(appt)
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
    delete process.env.ADMIN_EMAIL
  })

  it('fără config nu aruncă eroare', async () => {
    delete process.env.ADMIN_EMAIL
    delete process.env.ADMIN_PHONE
    await expect(notifyNewAppointment(appt)).resolves.toBeUndefined()
  })
})

describe('notifyReschedule', () => {
  it('notifică clientul la reprogramare (mock)', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
    await notifyReschedule(appt)
    expect(spy).toHaveBeenCalled()
    const log = spy.mock.calls.map((c) => c.join(' ')).join('\n')
    expect(log).toContain('reprogramată')
    spy.mockRestore()
  })
})

describe('notifyStatusChange', () => {
  it('notifică clientul la schimbarea statusului (mock)', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
    await notifyStatusChange(appt, 'confirmat')
    expect(spy).toHaveBeenCalled()
    const log = spy.mock.calls.map((c) => c.join(' ')).join('\n')
    expect(log).toContain('confirmată')
    spy.mockRestore()
  })
})

describe('notifyClient', () => {
  it('cu email trimite confirmare (mock)', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
    await notifyClient(appt)
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
})
