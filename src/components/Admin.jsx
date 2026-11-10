import { useEffect, useMemo, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import roLocale from '@fullcalendar/core/locales/ro'
import { vehicles } from '../data/vehicles.js'

const STATUSES = ['in_asteptare', 'confirmat', 'platit', 'anulat']
const LABELS = {
  in_asteptare: 'În așteptare',
  confirmat: 'Confirmat',
  platit: 'Plătit',
  anulat: 'Anulat',
}

export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem('srs_admin_token') || '')
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('toate')
  const [view, setView] = useState('calendar')
  const [edit, setEdit] = useState(null)
  const [busy, setBusy] = useState(false)

  const load = async () => {
    if (!token) {
      setError('Introdu tokenul de administrare pentru a încărca programările.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/appointments', { headers: { 'x-admin-token': token } })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Token nevalid.')
      setItems(data)
      sessionStorage.setItem('srs_admin_token', token)
    } catch (loadError) {
      setItems([])
      setError(loadError.message || 'Nu am putut încărca programările.')
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    if (token) load()
    // Load once when an existing session token is present.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateStatus = async (id, status) => {
    setError('')
    try {
      const response = await fetch('/api/appointments/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
        body: JSON.stringify({ status }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Nu am putut actualiza statusul.')
      await load()
    } catch (updateError) {
      setError(updateError.message || 'Nu am putut actualiza statusul.')
    }
  }

  const openEdit = (appointment) => {
    if (!appointment) return
    setEdit({
      id: appointment.id,
      departDate: appointment.departDate || '',
      departTime: appointment.departTime || '',
      returnDate: appointment.returnDate || '',
      returnTime: appointment.returnTime || '',
      vehicle: appointment.vehicle || 'logan',
      seats: appointment.seats || 1,
      pickup: appointment.pickup || '',
      flightOut: appointment.flightOut || '',
      flightBack: appointment.flightBack || '',
      notes: appointment.notes || '',
    })
  }

  const saveEdit = async () => {
    if (!edit) return
    setError('')
    try {
      const response = await fetch('/api/appointments/' + edit.id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
        body: JSON.stringify({
          departDate: edit.departDate,
          departTime: edit.departTime,
          returnDate: edit.returnDate,
          returnTime: edit.returnTime,
          vehicle: edit.vehicle,
          seats: Number(edit.seats),
          pickup: edit.pickup,
          flightOut: edit.flightOut,
          flightBack: edit.flightBack,
          notes: edit.notes,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Nu am putut salva modificările.')
      setEdit(null)
      await load()
    } catch (saveError) {
      setError(saveError.message || 'Nu am putut salva modificările.')
    }
  }

  const shown = filter === 'toate' ? items : items.filter((item) => item.status === filter)
  const stats = {
    total: items.length,
    pending: items.filter((item) => item.status === 'in_asteptare').length,
    confirmed: items.filter((item) => item.status === 'confirmat').length,
    paid: items.filter((item) => item.status === 'platit').reduce((sum, item) => sum + Number(item.amount || 0), 0),
  }

  const events = useMemo(() => shown.flatMap((appointment) => {
    const result = []
    if (appointment.departDate) {
      result.push({
        title: (appointment.departTime ? appointment.departTime + ' · ' : '') + appointment.name + ' · ' + appointment.vehicle + ' · plecare',
        start: appointment.departDate + (appointment.departTime ? 'T' + appointment.departTime : ''),
        classNames: ['calendar-event--' + appointment.status],
        extendedProps: { id: appointment.id },
      })
    }
    if (appointment.returnDate) {
      result.push({
        title: (appointment.returnTime ? appointment.returnTime + ' · ' : '') + appointment.name + ' · retur',
        start: appointment.returnDate + (appointment.returnTime ? 'T' + appointment.returnTime : ''),
        classNames: ['calendar-event--' + appointment.status],
        extendedProps: { id: appointment.id },
      })
    }
    return result
  }), [shown])

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="container admin-topbar__inner">
          <a className="brand" href="/"><span className="brand__mark">S</span><span className="brand__name">SRS <small>TRANSFER</small></span></a>
          <div className="admin-topbar__right"><span className="admin-topbar__status"><i /> Panou de administrare</span><a href="/">Înapoi la site <span aria-hidden="true">↗</span></a></div>
        </div>
      </header>

      <main className="admin-main container">
        <div className="admin-heading">
          <div><p className="eyebrow">Programări și curse</p><h1>Calendarul <em>tău.</em></h1><p>Urmărește solicitările, datele curselor și confirmările într-un singur loc.</p></div>
          <div className="admin-auth"><label htmlFor="admin-token">Token administrare</label><div><input id="admin-token" type="password" value={token} onChange={(event) => setToken(event.target.value)} placeholder="Introdu tokenul" /><button className="button button--dark button--small" type="button" onClick={load} disabled={busy}>{busy ? 'Se încarcă…' : 'Încarcă'}</button></div></div>
        </div>

        <div className="admin-stats">
          <article><span>Total solicitări</span><strong>{stats.total}</strong><small>înregistrate</small></article>
          <article><span>În așteptare</span><strong>{stats.pending}</strong><small>necesită confirmare</small></article>
          <article><span>Confirmate</span><strong>{stats.confirmed}</strong><small>curse confirmate</small></article>
          <article><span>Marcate ca plătite</span><strong>{stats.paid.toLocaleString('ro-RO')} <small>RON</small></strong><small>valoare cumulată</small></article>
        </div>

        {error && <p className="admin-alert" role="alert">{error}</p>}

        <section className="admin-calendar-panel">
          <div className="admin-calendar-panel__head">
            <div><p className="eyebrow">Planificare</p><h2>Cursele tale</h2></div>
            <div className="admin-controls">
              <select aria-label="Filtrează după status" value={filter} onChange={(event) => setFilter(event.target.value)}><option value="toate">Toate statusurile</option>{STATUSES.map((status) => <option key={status} value={status}>{LABELS[status]}</option>)}</select>
              <div className="view-switch"><button className={view === 'calendar' ? 'is-active' : ''} type="button" onClick={() => setView('calendar')}>Calendar</button><button className={view === 'tabel' ? 'is-active' : ''} type="button" onClick={() => setView('tabel')}>Listă</button></div>
            </div>
          </div>

          {view === 'calendar' ? (
            <div className="admin-calendar">
              <FullCalendar
                plugins={[dayGridPlugin, listPlugin]}
                locales={[roLocale]}
                initialView="dayGridMonth"
                headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,listMonth' }}
                locale="ro"
                height="auto"
                events={events}
                eventClick={(info) => openEdit(items.find((item) => String(item.id) === String(info.event.extendedProps.id)))}
              />
              <div className="calendar-legend"><span><i className="status-dot status-dot--in_asteptare" />În așteptare</span><span><i className="status-dot status-dot--confirmat" />Confirmat</span><span><i className="status-dot status-dot--platit" />Plătit</span><span><i className="status-dot status-dot--anulat" />Anulat</span></div>
            </div>
          ) : (
            <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Plecare</th><th>Client</th><th>Rută / preluare</th><th>Mașină</th><th>Total</th><th>Status</th><th>Acțiuni</th></tr></thead><tbody>
              {shown.map((appointment) => <tr key={appointment.id}><td><strong>{appointment.departDate || '—'}</strong><small>{appointment.departTime || ''}</small></td><td><strong>{appointment.name}</strong><small>{appointment.phone}</small></td><td><strong>Brăila → Otopeni</strong><small>{appointment.pickup}</small></td><td>{appointment.vehicle} · {appointment.seats} locuri</td><td>{appointment.amount} RON</td><td><span className={'status-pill status-pill--' + appointment.status}>{LABELS[appointment.status] || appointment.status}</span></td><td><select aria-label="Schimbă statusul" value={appointment.status} onChange={(event) => updateStatus(appointment.id, event.target.value)}>{STATUSES.map((status) => <option key={status} value={status}>{LABELS[status]}</option>)}</select><button className="table-edit" type="button" onClick={() => openEdit(appointment)}>Editează</button></td></tr>)}
              {shown.length === 0 && <tr><td colSpan="7" className="admin-empty">{items.length ? 'Nu sunt curse pentru acest filtru.' : 'Programările vor apărea aici după ce sunt trimise de pe site.'}</td></tr>}
            </tbody></table></div>
          )}
        </section>
      </main>

      {edit && <div className="modal" onClick={() => setEdit(null)}><div className="modal__box" onClick={(event) => event.stopPropagation()}><div className="modal__head"><div><p className="eyebrow">Detalii cursă</p><h2>Editează programarea</h2></div><button type="button" aria-label="Închide" onClick={() => setEdit(null)}>×</button></div><div className="modal__grid">
        <label className="field"><span>Data plecării</span><input type="date" value={edit.departDate} onChange={(event) => setEdit({ ...edit, departDate: event.target.value })} /></label>
        <label className="field"><span>Ora plecării</span><input type="time" value={edit.departTime} onChange={(event) => setEdit({ ...edit, departTime: event.target.value })} /></label>
        <label className="field"><span>Data întoarcerii</span><input type="date" value={edit.returnDate} onChange={(event) => setEdit({ ...edit, returnDate: event.target.value })} /></label>
        <label className="field"><span>Ora întoarcerii</span><input type="time" value={edit.returnTime} onChange={(event) => setEdit({ ...edit, returnTime: event.target.value })} /></label>
        <label className="field"><span>Mașină</span><select value={edit.vehicle} onChange={(event) => setEdit({ ...edit, vehicle: event.target.value })}>{vehicles.map((car) => <option key={car.id} value={car.id}>{car.brand} {car.model}</option>)}</select></label>
        <label className="field"><span>Pasageri</span><select value={edit.seats} onChange={(event) => setEdit({ ...edit, seats: event.target.value })}>{[1, 2, 3, 4, 5].map((number) => <option key={number} value={number}>{number}</option>)}</select></label>
        <label className="field field--wide"><span>Adresă de preluare</span><input value={edit.pickup} onChange={(event) => setEdit({ ...edit, pickup: event.target.value })} /></label>
        <label className="field"><span>Zbor plecare</span><input value={edit.flightOut} onChange={(event) => setEdit({ ...edit, flightOut: event.target.value })} /></label>
        <label className="field"><span>Zbor întoarcere</span><input value={edit.flightBack} onChange={(event) => setEdit({ ...edit, flightBack: event.target.value })} /></label>
        <label className="field field--wide"><span>Observații</span><textarea rows="3" value={edit.notes} onChange={(event) => setEdit({ ...edit, notes: event.target.value })} /></label>
      </div><div className="modal__actions"><button className="button button--outline" type="button" onClick={() => setEdit(null)}>Anulează</button><button className="button button--dark" type="button" onClick={saveEdit}>Salvează modificările</button></div></div></div>}
    </div>
  )
}
