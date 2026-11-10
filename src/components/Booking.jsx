import { useState } from 'react'
import DateCalendar, { formatDate } from './DateCalendar.jsx'
import { vehicles } from '../data/vehicles.js'
import { priceFor } from '../lib/pricing.js'
import { phoneOk } from '../lib/validators.js'

const initialForm = {
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
  const [vehicle, setVehicle] = useState(() => sessionStorage.getItem('srs_class') || 'logan')
  const [trip, setTrip] = useState('dusIntors')
  const [seats, setSeats] = useState(1)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [phase, setPhase] = useState('form')
  const [request, setRequest] = useState(null)
  const [submitError, setSubmitError] = useState('')

  const car = vehicles.find((item) => item.id === vehicle) || vehicles[0]
  const { base, extraSeats, total } = priceFor(vehicle, trip, seats)

  const update = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const updateTrip = (value) => {
    setTrip(value)
    if (value === 'dus') {
      setForm((current) => ({ ...current, returnDate: '', returnTime: '', flightBack: '' }))
      setErrors((current) => ({ ...current, returnDate: '', returnTime: '' }))
    }
  }

  const updateDates = (departDate, returnDate) => {
    setForm((current) => ({ ...current, departDate, returnDate, returnTime: returnDate ? current.returnTime : '', flightBack: returnDate ? current.flightBack : '' }))
    setErrors((current) => ({ ...current, departDate: '', returnDate: '' }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Completează numele.'
    if (!phoneOk(form.phone)) next.phone = 'Introdu un număr de telefon valid.'
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Verifică adresa de email.'
    if (!form.pickup.trim()) next.pickup = 'Adaugă adresa de preluare.'
    if (!form.departDate) next.departDate = 'Selectează data plecării din calendar.'
    if (!form.departTime) next.departTime = 'Alege ora plecării.'
    if (trip === 'dusIntors') {
      if (!form.returnDate) next.returnDate = 'Selectează data întoarcerii din calendar.'
      if (!form.returnTime) next.returnTime = 'Alege ora întoarcerii.'
      if (form.departDate && form.returnDate && form.returnDate < form.departDate) next.returnDate = 'Întoarcerea trebuie să fie după plecare.'
      if (form.departDate && form.returnDate === form.departDate && form.departTime && form.returnTime && form.returnTime <= form.departTime) next.returnTime = 'Ora întoarcerii trebuie să fie după plecare.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = async (event) => {
    event.preventDefault()
    setSubmitError('')
    if (!validate()) return
    setPhase('sending')
    const appointment = {
      ...form,
      vehicle,
      trip,
      seats,
      amount: total,
      details: 'Transfer Brăila–Otopeni · ' + car.brand + ' ' + car.model + ' · ' + (trip === 'dusIntors' ? 'dus-întors' : 'doar dus'),
    }
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointment),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Nu am putut trimite solicitarea.')
      setRequest(data)
      setPhase('sent')
    } catch (error) {
      setSubmitError(error.message || 'Eroare la trimitere. Încearcă din nou.')
      setPhase('form')
    }
  }

  if (phase === 'sent' && request) {
    return (
      <section className="section booking-section" id="rezerva">
        <div className="container">
          <div className="booking-success">
            <div className="booking-success__mark">✓</div>
            <p className="eyebrow">Solicitare trimisă</p>
            <h2>Am primit detaliile <em>călătoriei.</em></h2>
            <p className="booking-success__lead">Cererea <strong>{request.orderId}</strong> a fost adăugată. Ora cursei se confirmă după verificarea disponibilității.</p>
            <div className="booking-success__summary">
              <span>{trip === 'dusIntors' ? 'Dus-întors' : 'Doar dus'}</span>
              <strong>{formatDate(form.departDate)}{trip === 'dusIntors' ? ' — ' + formatDate(form.returnDate) : ''}</strong>
              <span>{car.brand} {car.model} · {seats} {seats === 1 ? 'pasager' : 'pasageri'}</span>
              <strong>{total} RON</strong>
            </div>
            <p className="booking-success__note">Nu s-a efectuat nicio plată online prin acest formular.</p>
            <button className="button button--dark" type="button" onClick={() => { setRequest(null); setForm(initialForm); setPhase('form') }}>Solicită alt transfer <span aria-hidden="true">↗</span></button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section booking-section" id="rezerva">
      <div className="container">
        <div className="section-heading section-heading--booking">
          <div><p className="eyebrow">Planifică transferul</p><h2>Începem cu <em>data.</em></h2></div>
          <p>Alege zilele din calendar, completează detaliile cursei și trimite solicitarea. Tariful estimat este vizibil înainte de trimitere.</p>
        </div>

        <form className="booking-layout" onSubmit={submit} noValidate>
          <div className="booking-main">
            <section className="booking-panel">
              <div className="booking-panel__heading"><span className="step-index">01</span><div><h3>Tipul cursei</h3><p>O singură direcție sau dus-întors.</p></div></div>
              <div className="trip-switch" role="group" aria-label="Tipul cursei">
                <button className={trip === 'dusIntors' ? 'is-active' : ''} type="button" onClick={() => updateTrip('dusIntors')}><span>↔</span><span><strong>Dus-întors</strong><small>Brăila · Otopeni · Brăila</small></span></button>
                <button className={trip === 'dus' ? 'is-active' : ''} type="button" onClick={() => updateTrip('dus')}><span>→</span><span><strong>Doar dus</strong><small>Brăila către Otopeni</small></span></button>
              </div>
            </section>

            <section className="booking-panel">
              <div className="booking-panel__heading"><span className="step-index">02</span><div><h3>Alege data</h3><p>{trip === 'dusIntors' ? 'Selectează plecarea, apoi întoarcerea.' : 'Selectează ziua plecării.'}</p></div></div>
              <DateCalendar trip={trip} departDate={form.departDate} returnDate={form.returnDate} onSelect={updateDates} />
              {(errors.departDate || errors.returnDate) && <p className="field-error">{errors.departDate || errors.returnDate}</p>}
              <div className="date-times">
                <label className="field"><span>Ora plecării <b>*</b></span><input type="time" name="departTime" value={form.departTime} onChange={update} />{errors.departTime && <small className="field-error">{errors.departTime}</small>}</label>
                {trip === 'dusIntors' && <label className="field"><span>Ora întoarcerii <b>*</b></span><input type="time" name="returnTime" value={form.returnTime} onChange={update} />{errors.returnTime && <small className="field-error">{errors.returnTime}</small>}</label>}
              </div>
            </section>

            <section className="booking-panel">
              <div className="booking-panel__heading"><span className="step-index">03</span><div><h3>Alege mașina și pasagerii</h3><p>Ambele mașini au maximum 5 locuri.</p></div></div>
              <div className="vehicle-picker">
                {vehicles.map((item) => (
                  <button type="button" key={item.id} className={'vehicle-option' + (vehicle === item.id ? ' is-active' : '')} onClick={() => { setVehicle(item.id); sessionStorage.setItem('srs_class', item.id) }}>
                    <span className="vehicle-option__logo"><img src={item.logo} alt="" /></span>
                    <span className="vehicle-option__text"><strong>{item.brand} {item.model}</strong><small>{item.cls} · {item.seats} locuri</small></span>
                    <span className="vehicle-option__price">{trip === 'dusIntors' ? item.priceBoth : item.priceDus}<small> RON</small></span>
                    <span className="vehicle-option__check">✓</span>
                  </button>
                ))}
              </div>
              <label className="field field--passengers"><span>Număr pasageri</span><select value={seats} onChange={(event) => setSeats(Number(event.target.value))}>{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} {n === 1 ? 'pasager' : 'pasageri'}</option>)}</select></label>
            </section>

            <section className="booking-panel">
              <div className="booking-panel__heading"><span className="step-index">04</span><div><h3>Detaliile tale</h3><p>Unde te preluăm și cum te contactăm?</p></div></div>
              <div className="fields-grid">
                <label className="field"><span>Nume complet <b>*</b></span><input name="name" autoComplete="name" value={form.name} onChange={update} placeholder="Numele tău" />{errors.name && <small className="field-error">{errors.name}</small>}</label>
                <label className="field"><span>Telefon <b>*</b></span><input name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={update} placeholder="07xx xxx xxx" />{errors.phone && <small className="field-error">{errors.phone}</small>}</label>
                <label className="field"><span>Email <small>opțional</small></span><input name="email" type="email" autoComplete="email" value={form.email} onChange={update} placeholder="nume@email.ro" />{errors.email && <small className="field-error">{errors.email}</small>}</label>
                <label className="field"><span>Adresă preluare în Brăila <b>*</b></span><input name="pickup" autoComplete="street-address" value={form.pickup} onChange={update} placeholder="Stradă, număr, localitate" />{errors.pickup && <small className="field-error">{errors.pickup}</small>}</label>
                <label className="field"><span>Zbor la plecare <small>opțional</small></span><input name="flightOut" value={form.flightOut} onChange={update} placeholder="ex. RO 302" /></label>
                {trip === 'dusIntors' && <label className="field"><span>Zbor la întoarcere <small>opțional</small></span><input name="flightBack" value={form.flightBack} onChange={update} placeholder="ex. RO 303" /></label>}
                <label className="field field--wide"><span>Observații <small>opțional</small></span><textarea name="notes" rows="3" value={form.notes} onChange={update} placeholder="Bagaje, scaun copil sau alte detalii" /></label>
              </div>
            </section>
          </div>

          <aside className="booking-summary">
            <div className="booking-summary__eyebrow"><span className="eyebrow__dot" /> Estimare cursă</div>
            <h3>Detaliile<br /><em>călătoriei.</em></h3>
            <div className="summary-route"><span className="summary-route__line" /><div><small>Plecare</small><strong>Brăila</strong><span>{form.departDate ? formatDate(form.departDate) : 'Alege data'}</span></div><div><small>Destinație</small><strong>Otopeni · OTP</strong><span>{trip === 'dusIntors' ? form.returnDate ? formatDate(form.returnDate) : 'Alege întoarcerea' : 'Doar dus'}</span></div></div>
            <div className="summary-car"><img src={car.logo} alt="" /><div><strong>{car.brand} {car.model}</strong><span>{car.cls} · {seats} {seats === 1 ? 'pasager' : 'pasageri'}</span></div></div>
            <div className="summary-price"><span>Tarif de bază</span><strong>{base} RON</strong></div>
            {extraSeats > 0 && <div className="summary-price"><span>Loc suplimentar</span><strong>{extraSeats} RON</strong></div>}
            <div className="summary-total"><span>Estimare totală</span><strong>{total} <small>RON</small></strong></div>
            <p className="booking-summary__note">Solicitarea nu confirmă automat ora cursei și nu încasează o plată. Confirmarea se face după verificarea disponibilității.</p>
            {submitError && <p className="submit-error" role="alert">{submitError}</p>}
            <button className="button button--primary booking-submit" type="submit" disabled={phase === 'sending'}>{phase === 'sending' ? 'Se trimite…' : 'Trimite solicitarea'} <span aria-hidden="true">↗</span></button>
            <p className="booking-summary__foot">Prin trimitere, datele sunt folosite pentru gestionarea solicitării tale.</p>
          </aside>
        </form>
      </div>
    </section>
  )
}
