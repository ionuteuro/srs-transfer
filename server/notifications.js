import nodemailer from 'nodemailer'

function detailLines(a) {
  return [
    `Client: ${a.name}`,
    `Telefon: ${a.phone}`,
    a.email ? `Email: ${a.email}` : null,
    `Mașină: ${a.vehicle}`,
    `Tip: ${a.trip === 'dusIntors' ? 'Dus-întors' : 'Doar dus'}`,
    `Locuri: ${a.seats}`,
    `Plecare: ${a.departDate || '?'} ${a.departTime || ''}`.trim(),
    a.flightOut ? `Zbor plecare: ${a.flightOut}` : null,
    a.returnDate ? `Întoarcere: ${a.returnDate} ${a.returnTime}` : null,
    a.flightBack ? `Zbor retur: ${a.flightBack}` : null,
    `Preluare: ${a.pickup}`,
    a.notes ? `Observații: ${a.notes}` : null,
    `Total: ${a.amount} RON`,
  ]
    .filter(Boolean)
    .join('\n')
}

export function appointmentText(a) {
  return `Solicitare nouă SRS Transfer\n${detailLines(a)}`
}

export function appointmentHtml(a) {
  const safe = detailLines(a).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
  return `<h3>Solicitare nouă SRS Transfer</h3><pre>${safe}</pre>`
}

let transporter
function getTransporter() {
  if (transporter) return transporter
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  })
  return transporter
}

export async function sendEmail({ to, subject, text, html }) {
  if (!process.env.SMTP_HOST) {
    console.log('[NOTIF email mock]', to, '|', subject, '\n' + text)
    return { mock: true }
  }
  const info = await getTransporter().sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  })
  return { id: info.messageId }
}

export async function sendSms({ to, text }) {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM } = process.env
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM) {
    console.log('[NOTIF sms mock]', to, '\n' + text)
    return { mock: true }
  }
  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`
  const body = new URLSearchParams({ To: to, From: TWILIO_FROM, Body: text })
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64'),
    },
    body,
  })
  if (!res.ok) throw new Error('Twilio error ' + res.status)
  return await res.json()
}

export async function notifyNewAppointment(a) {
  const text = appointmentText(a)
  const tasks = []
  if (process.env.ADMIN_EMAIL) {
    tasks.push(
      sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: 'Solicitare nouă SRS Transfer',
        text,
        html: appointmentHtml(a),
      }).catch((e) => console.error('email admin:', e))
    )
  }
  if (process.env.ADMIN_PHONE) {
    tasks.push(
      sendSms({ to: process.env.ADMIN_PHONE, text }).catch((e) =>
        console.error('sms admin:', e)
      )
    )
  }
  await Promise.all(tasks)
}

export async function notifyClient(a) {
  const text = `SRS Transfer: am primit solicitarea ta pentru ${
    a.trip === 'dusIntors' ? 'dus-întors' : 'o cursă dus'
  } cu ${a.vehicle}. Estimare ${a.amount} RON. Ora se confirmă după verificarea disponibilității.`
  const tasks = []
  if (a.email) {
    tasks.push(
      sendEmail({
        to: a.email,
        subject: 'Confirmare SRS Transfer',
        text,
        html: `<p>${text}</p>`,
      }).catch((e) => console.error('email client:', e))
    )
  }
  if (a.phone) {
    tasks.push(
      sendSms({ to: a.phone, text }).catch((e) => console.error('sms client:', e))
    )
  }
  await Promise.all(tasks)
}

const STATUS_LABELS = {
  platit: 'confirmată și plătită',
  confirmat: 'confirmată',
  anulat: 'anulată',
  in_asteptare: 'pusă în așteptare',
}

export async function notifyStatusChange(a, status) {
  const label = STATUS_LABELS[status] || status
  const text = `SRS Transfer: programarea ta (${a.vehicle}, ${
    a.trip === 'dusIntors' ? 'dus-întors' : 'dus'
  }) a fost ${label}.`
  const tasks = []
  if (a.email) {
    tasks.push(
      sendEmail({
        to: a.email,
        subject: 'Actualizare SRS Transfer',
        text,
        html: `<p>${text}</p>`,
      }).catch((e) => console.error('email status:', e))
    )
  }
  if (a.phone) {
    tasks.push(
      sendSms({ to: a.phone, text }).catch((e) => console.error('sms status:', e))
    )
  }
  await Promise.all(tasks)
}

export async function notifyReschedule(a) {
  const when =
    `Plecare: ${a.departDate || '?'} ${a.departTime || ''}`.trim() +
    (a.returnDate ? `, întoarcere: ${a.returnDate} ${a.returnTime || ''}`.trim() : '')
  const text = `SRS Transfer: programarea ta (${a.vehicle}) a fost reprogramată. ${when}.`
  const tasks = []
  if (a.email) {
    tasks.push(
      sendEmail({
        to: a.email,
        subject: 'Reprogramare SRS Transfer',
        text,
        html: `<p>${text}</p>`,
      }).catch((e) => console.error('email reschedule:', e))
    )
  }
  if (a.phone) {
    tasks.push(
      sendSms({ to: a.phone, text }).catch((e) => console.error('sms reschedule:', e))
    )
  }
  await Promise.all(tasks)
}
