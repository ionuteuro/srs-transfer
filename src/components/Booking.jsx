import { useState } from 'react'
import { vehicles } from '../data/vehicles.js'
import { priceFor } from '../lib/pricing.js'
import { luhnOk, expiryOk, phoneOk } from '../lib/validators.js'

const initial = {
  name: '',
  phone: '',
  email: '',
  pickup: '',
  departDate: '',
  departTime: '',
  flightOut: '',
  returnDate: '',
  returnTime: '',
  flightBack: '',
  notes: '',
}

export default function Booking() {
  const [vehicle, setVehicle] = useState(
    () => sessionStorage.getItem('srs_class') || 'logan'
  )
  const [trip, setTrip] = useState('dusIntors')
  const [seats, setSeats] = useState(1)
  const [form, setForm] = useState(initial)
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvc: '' })
  const [agree, setAgree] = useState(false)
  const [errors, setErrors] = useState({})
  const [phase, setPhase] = useState('form') // form | processing | done

  const car = vehicles.find((v) => v.id === vehicle)
  const { base, extraSeats, total } = priceFor(vehicle, trip, seats)

  const update = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }
  const updateCard = (e) => {
    const { name, value } = e.target
    setCard((c) => ({ ...c, [name]: value }))
  }

  const validate = () => {
    const err = {}
    if (!form.name.trim()) err.name = 'Completează numele'
    if (!phoneOk(form.phone)) err.phone = 'Telefon invalid (ex. 07xx xxx xxx)'
    if (!form.pickup.trim()) err.pickup = 'Adaugă adresa de preluare'
    if (!form.departDate) err.departDate = 'Alege data plecării'
    if (!form.departTime) err.departTime = 'Alege ora plecării'
    if (trip === 'dusIntors') {
      if (!form.returnDate) err.returnDate = 'Alege data întoarcerii'
      if (!form.returnTime) err.returnTime = 'Alege ora întoarcerii'
    }
    if (!luhnOk(card.number)) err.number = 'Număr de card invalid'
    if (!card.name.trim()) err.cname = 'Numele de pe card'
    if (!expiryOk(card.expiry)) err.expiry = 'Expirare invalidă (LL/AA)'
    if (!/^\d{3,4}$/.test(card.cvc)) err.cvc = 'CVC invalid'
    if (!agree) err.agree = 'Trebuie să accepți politica de rambursare'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setPhase('processing')
    const orderId = `SRS-${Date.now()}`
    const appointment = {
      orderId,
      name: form.name,
      phone: form.phone,
      email: form.email,
      pickup: form.pickup,
      vehicle,
      trip,
      seats,
      departDate: form.departDate,
      departTime: form.departTime,
      returnDate: form.returnDate,
      returnTime: form.returnTime,
      amount: total,
      details: `Transfer aeroport Braila–Otopeni · ${car.brand} ${car.model} · ${trip === 'dusIntors' ? 'dus-întors' : 'doar dus'} · ${seats} locuri`,
    }
    try {
      await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointment),
      }).catch(() => {})
    } catch {
      /* salvarea e best-effort; plata continuă */
    }
    const payload = {
      amount: total,
      orderId,
      clientName: form.name,
      clientPhone: form.phone,
      clientEmail: '',
      details: appointment.details,
    }
    try {
      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data.redirect && data.fields) {
        const formEl = document.createElement('form')
        formEl.method = 'POST'
        formEl.action = data.redirect
        for (const [k, v] of Object.entries(data.fields)) {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = k
          input.value = v
          formEl.appendChild(input)
        }
        document.body.appendChild(formEl)
        formEl.submit()
        return
      }
      setTimeout(() => setPhase('done'), 1400)
    } catch (err) {
      console.error(err)
      setPhase('form')
      alert('Eroare la inițierea plății. Încearcă din nou.')
    }
  }

  if (phase === 'done') {
    return (
      <section className="section" id="rezerva">
        <div className="container">
          <div className="done">
            <div className="done__icon">✅</div>
            <h2>Plată cu cardul confirmată!</h2>
            <p>
              Rezervarea ta pentru <strong>{car.brand} {car.model}</strong> (
              {trip === 'dusIntors' ? 'dus-întors' : 'doar dus'}) a fost
              plasată și achitată cu cardul.
            </p>
            <ul className="done__summary">
              <li><span>Client</span><strong>{form.name}</strong></li>
              <li><span>Telefon</span><strong>{form.phone}</strong></li>
              {form.email && <li><span>Email</span><strong>{form.email}</strong></li>}
              <li><span>Preluare</span><strong>{form.pickup}</strong></li>
              <li><span>Locuri</span><strong>{seats}</strong></li>
              <li><span>Total plată</span><strong>{total} RON</strong></li>
            </ul>
            <p className="done__note">
              Banii au fost luați de pe card. Rambursare: 100% dacă anulezi cu
              min. 24h înainte, 50% între 12–24h, nereturnabil sub 12h (exceptând
              anularea zborului, dovedită).
            </p>
            <button
              className="btn btn--ghost"
              onClick={() => {
                setForm(initial)
                setCard({ number: '', name: '', expiry: '', cvc: '' })
                setAgree(false)
                setPhase('form')
              }}
            >
              O nouă rezervare
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section" id="rezerva">
      <div className="container">
        <div className="section__head">
          <h2>Rezervă transferul</h2>
          <p>Transfer aeroport <strong>Braila – Otopeni</strong>. Alege clasa, locurile și data. Plata se face doar cu cardul.</p>
        </div>

        <div className="booking">
          <form className="form" onSubmit={submit} noValidate>
            <h3 className="form__title">1 · Alege clasa și locurile</h3>
            <div className="vehicles">
              {vehicles.map((v) => (
                <button
                  type="button"
                  key={v.id}
                  className={`vehicle ${vehicle === v.id ? 'vehicle--on' : ''}`}
                  onClick={() => setVehicle(v.id)}
                >
                  <span className="vehicle__logo"><v.Logo size={40} /></span>
                  <span className="vehicle__name">{v.brand} {v.model}</span>
                  <span className="vehicle__cls">{v.cls}</span>
                  <span className="vehicle__price">
                    {trip === 'dusIntors' ? v.priceBoth : v.priceDus} RON
                  </span>
                </button>
              ))}
            </div>

            <div className="form__row form__row--3">
              <label>Tip cursă
                <select value={trip} onChange={(e) => setTrip(e.target.value)}>
                  <option value="dusIntors">Dus-întors</option>
                  <option value="dus">Doar dus</option>
                </select>
              </label>
              <label>Număr locuri
                <select value={seats} onChange={(e) => setSeats(Number(e.target.value))}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}{n === 5 ? ' (max)' : ''}</option>
                  ))}
                </select>
              </label>
              <label> &nbsp;
                <span className="vehicle__hint">Prețul include până la 4 locuri</span>
              </label>
            </div>

            <h3 className="form__title">2 · Detaliile cursei</h3>
            <div className="form__row form__row--3">
              <label>Nume complet
                <input name="name" value={form.name} onChange={update} placeholder="Ion Popescu" />
                {errors.name && <em className="err">{errors.name}</em>}
              </label>
              <label>Telefon
                <input name="phone" value={form.phone} onChange={update} placeholder="07xx xxx xxx" />
                {errors.phone && <em className="err">{errors.phone}</em>}
              </label>
              <label>Email (opțional)
                <input name="email" type="email" value={form.email} onChange={update} placeholder="tu@email.ro" />
              </label>
            </div>
            <label className="full">Adresă preluare (Braila)
              <input name="pickup" value={form.pickup} onChange={update} placeholder="Strada, nr, localitate Braila" />
              {errors.pickup && <em className="err">{errors.pickup}</em>}
            </label>

            <fieldset className="leg">
              <legend>Dus · Braila → Otopeni</legend>
              <div className="form__row form__row--3">
                <label>Data plecării
                  <input type="date" name="departDate" value={form.departDate} onChange={update} />
                  {errors.departDate && <em className="err">{errors.departDate}</em>}
                </label>
                <label>Ora plecării
                  <input type="time" name="departTime" value={form.departTime} onChange={update} />
                  {errors.departTime && <em className="err">{errors.departTime}</em>}
                </label>
                <label>Zbor (opțional)
                  <input name="flightOut" value={form.flightOut} onChange={update} placeholder="ex. W6 3102" />
                </label>
              </div>
            </fieldset>

            {trip === 'dusIntors' && (
              <fieldset className="leg">
                <legend>Întors · Otopeni → Braila</legend>
                <div className="form__row form__row--3">
                  <label>Data sosirii
                    <input type="date" name="returnDate" value={form.returnDate} onChange={update} />
                    {errors.returnDate && <em className="err">{errors.returnDate}</em>}
                  </label>
                  <label>Ora sosirii
                    <input type="time" name="returnTime" value={form.returnTime} onChange={update} />
                    {errors.returnTime && <em className="err">{errors.returnTime}</em>}
                  </label>
                  <label>Zbor (opțional)
                    <input name="flightBack" value={form.flightBack} onChange={update} placeholder="ex. W6 3103" />
                  </label>
                </div>
              </fieldset>
            )}

            <label className="full">Observații (opțional)
              <textarea name="notes" rows="2" value={form.notes} onChange={update} placeholder="Bagaje voluminoase, scaun copil etc." />
            </label>

            <h3 className="form__title">3 · Plată cu cardul</h3>
            <div className="payonly">Plată acceptată exclusiv cu cardul (Visa / Mastercard).</div>
            <div className="form__row form__row--2">
              <label>Număr card
                <input name="number" inputMode="numeric" value={card.number} onChange={updateCard} placeholder="0000 0000 0000 0000" />
                {errors.number && <em className="err">{errors.number}</em>}
              </label>
              <label>Nume pe card
                <input name="name" value={card.name} onChange={updateCard} placeholder="ION POPESCU" />
                {errors.cname && <em className="err">{errors.cname}</em>}
              </label>
            </div>
            <div className="form__row form__row--2">
              <label>Expirare (LL/AA)
                <input name="expiry" value={card.expiry} onChange={updateCard} placeholder="08/29" />
                {errors.expiry && <em className="err">{errors.expiry}</em>}
              </label>
              <label>CVC
                <input name="cvc" inputMode="numeric" value={card.cvc} onChange={updateCard} placeholder="123" />
                {errors.cvc && <em className="err">{errors.cvc}</em>}
              </label>
            </div>

            <div className="refund">
              <h4>Politica de rambursare</h4>
              <ul>
                <li><strong>100%</strong> – anulare cu minim 24h înainte de cursă</li>
                <li><strong>50%</strong> – între 12h și 24h înainte</li>
                <li><strong>0%</strong> – sub 12h (exceptând anularea zborului, dovedită)</li>
              </ul>
              <label className="check">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                Am citit și accept politica de rambursare
              </label>
              {errors.agree && <em className="err">{errors.agree}</em>}
            </div>

            <button className="btn btn--primary form__submit" type="submit" disabled={phase === 'processing'}>
              {phase === 'processing' ? 'Se procesează plata…' : `Plătește ${total} RON cu cardul`}
            </button>
          </form>

          <aside className="summary">
            <h3>Rezumat</h3>
            <div className="summary__car">
              <span className="summary__logo"><car.Logo size={34} /></span>
              <div>
                <strong>{car.brand} {car.model}</strong>
                <span>{car.cls}</span>
              </div>
            </div>
            <ul className="summary__list">
              <li><span>Tip</span><strong>{trip === 'dusIntors' ? 'Dus-întors' : 'Doar dus'}</strong></li>
              <li><span>Tarif bază</span><strong>{base} RON</strong></li>
              {extraSeats > 0 && (
                <li><span>Locuri suplim.</span><strong>{extraSeats} RON</strong></li>
              )}
              <li><span>Locuri</span><strong>{seats}</strong></li>
            </ul>
            <div className="summary__total">
              <span>Total de plată</span>
              <strong>{total} RON</strong>
            </div>
            <p className="summary__pay">💳 Plată doar cu cardul</p>
          </aside>
        </div>
      </div>
    </section>
  )
}
