import { useState, useEffect, useMemo } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import roLocale from '@fullcalendar/core/locales/ro'
import { vehicles } from '../data/vehicles.js'

const STATUSES = ['in_asteptare', 'platit', 'confirmat', 'anulat']
const LABELS = {
  in_asteptare: 'În așteptare',
  platit: 'Plătit',
  confirmat: 'Confirmat',
  anulat: 'Anulat',
}
const COLORS = {
  in_asteptare: '#eab308',
  platit: '#10b981',
  confirmat: '#0ea5e9',
  anulat: '#f43f5e',
}

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('srs_admin_token') || '')
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('toate')
  const [view, setView] = useState('calendar')
  const [edit, setEdit] = useState(null)

  const load = async () => {
    setError('')
    try {
      const res = await fetch(`/api/appointments?token=${encodeURIComponent(token)}`)
      if (!res.ok) {
        setError('Neautorizat. Verifică tokenul (ADMIN_TOKEN).')
        setItems([])
        return
      }
      const data = await res.json()
      setItems(data)
      localStorage.setItem('srs_admin_token', token)
    } catch {
      setError('Eroare la încărcare.')
    }
  }

  useEffect(() => {
    if (token) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const changeStatus = async (id, status) => {
    await fetch(`/api/appointments/${id}?token=${encodeURIComponent(token)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    load()
  }

  const openEdit = (a) => {
    setEdit({
      id: a.id,
      departDate: a.departDate || '',
      departTime: a.departTime || '',
      returnDate: a.returnDate || '',
      returnTime: a.returnTime || '',
      vehicle: a.vehicle || '',
      seats: a.seats || 1,
      pickup: a.pickup || '',
    })
  }

  const saveEdit = async () => {
    if (!edit) return
    await fetch(`/api/appointments/${edit.id}?token=${encodeURIComponent(token)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        departDate: edit.departDate,
        departTime: edit.departTime,
        returnDate: edit.returnDate,
        returnTime: edit.returnTime,
        vehicle: edit.vehicle,
        seats: Number(edit.seats),
        pickup: edit.pickup,
      }),
    })
    setEdit(null)
    load()
  }

  const shown = filter === 'toate' ? items : items.filter((i) => i.status === filter)

  const events = useMemo(() => {
    return shown.flatMap((a) => {
      const evs = []
      if (a.departDate) {
        evs.push({
          title: `${a.name} · ${a.vehicle} (plecare)`,
          start: a.departDate,
          color: COLORS[a.status] || '#64748b',
          id: String(a.id),
          extendedProps: { id: a.id },
        })
      }
      if (a.returnDate && a.returnDate !== a.departDate) {
        evs.push({
          title: `${a.name} (întoarcere)`,
          start: a.returnDate,
          color: COLORS[a.status] || '#64748b',
          id: String(a.id),
          extendedProps: { id: a.id },
        })
      }
      return evs
    })
  }, [shown])

  return (
    <div className="admin">
      <div className="container">
        <h1>Programări · Admin</h1>
        <div className="admin__bar">
          <input
            type="password"
            placeholder="Token admin (ADMIN_TOKEN)"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <button className="btn btn--primary" onClick={load}>Încarcă</button>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="toate">Toate</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{LABELS[s]}</option>
            ))}
          </select>
          <div className="admin__toggle">
            <button className={view === 'calendar' ? 'on' : ''} onClick={() => setView('calendar')}>
              Calendar
            </button>
            <button className={view === 'tabel' ? 'on' : ''} onClick={() => setView('tabel')}>
              Tabel
            </button>
          </div>
        </div>
        {error && <p className="admin__err">{error}</p>}

        {view === 'calendar' ? (
          <div className="admin__calendar">
            <FullCalendar
              plugins={[dayGridPlugin, listPlugin]}
              locales={[roLocale]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,listMonth',
              }}
              locale="ro"
              height="auto"
              events={events}
              eventClick={(info) => {
                const id = info.event.extendedProps.id
                openEdit(items.find((i) => String(i.id) === String(id)))
              }}
            />
          </div>
        ) : (
          <div className="admin__table">
            <table>
              <thead>
                <tr>
                  <th>Data</th><th>Client</th><th>Telefon</th><th>Mașină</th>
                  <th>Tip</th><th>Locuri</th><th>Total</th><th>Status</th><th></th>
                </tr>
              </thead>
              <tbody>
                {shown.map((a) => (
                  <tr key={a.id}>
                    <td>{a.createdAt?.slice(0, 10)}</td>
                    <td>{a.name}</td>
                    <td>{a.phone}</td>
                    <td>{a.vehicle}</td>
                    <td>{a.trip === 'dusIntors' ? 'Dus-întors' : 'Dus'}</td>
                    <td>{a.seats}</td>
                    <td>{a.amount} RON</td>
                    <td><span className={`tag tag--${a.status}`}>{LABELS[a.status]}</span></td>
                    <td className="admin__actions">
                      <select value={a.status} onChange={(e) => changeStatus(a.id, e.target.value)}>
                        {STATUSES.map((s) => <option key={s} value={s}>{LABELS[s]}</option>)}
                      </select>
                      <button className="btn btn--ghost btn--sm" onClick={() => openEdit(a)}>
                        Reprogramează
                      </button>
                    </td>
                  </tr>
                ))}
                {shown.length === 0 && (
                  <tr><td colSpan="9" className="admin__empty">Nicio programare.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <a className="admin__back" href="/">← Înapoi la site</a>
      </div>

      {edit && (
        <div className="modal" onClick={() => setEdit(null)}>
          <div className="modal__box" onClick={(e) => e.stopPropagation()}>
            <h3>Reprogramează programarea</h3>
            <div className="modal__grid">
              <label>Plecare – dată
                <input type="date" value={edit.departDate}
                  onChange={(e) => setEdit({ ...edit, departDate: e.target.value })} />
              </label>
              <label>Plecare – oră
                <input type="time" value={edit.departTime}
                  onChange={(e) => setEdit({ ...edit, departTime: e.target.value })} />
              </label>
              <label>Întoarcere – dată
                <input type="date" value={edit.returnDate}
                  onChange={(e) => setEdit({ ...edit, returnDate: e.target.value })} />
              </label>
              <label>Întoarcere – oră
                <input type="time" value={edit.returnTime}
                  onChange={(e) => setEdit({ ...edit, returnTime: e.target.value })} />
              </label>
              <label>Mașină
                <select value={edit.vehicle}
                  onChange={(e) => setEdit({ ...edit, vehicle: e.target.value })}>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>{v.brand} {v.model}</option>
                  ))}
                </select>
              </label>
              <label>Locuri
                <select value={edit.seats}
                  onChange={(e) => setEdit({ ...edit, seats: e.target.value })}>
                  {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
              <label className="modal__full">Adresă preluare
                <input value={edit.pickup}
                  onChange={(e) => setEdit({ ...edit, pickup: e.target.value })} />
              </label>
            </div>
            <div className="modal__actions">
              <button className="btn btn--ghost" onClick={() => setEdit(null)}>Anulează</button>
              <button className="btn btn--primary" onClick={saveEdit}>Salvează</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
