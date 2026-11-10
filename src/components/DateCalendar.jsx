import { useEffect, useState } from 'react'

const weekdays = ['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ', 'Du']

function dateFromKey(key) {
  if (!key) return null
  const parts = key.split('-').map(Number)
  return new Date(parts[0], parts[1] - 1, parts[2], 12)
}

function keyFromDate(date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-')
}

function monthTitle(date) {
  return new Intl.DateTimeFormat('ro-RO', { month: 'long', year: 'numeric' }).format(date)
}

export function formatDate(key) {
  const date = dateFromKey(key)
  return date ? new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' }).format(date) : ''
}

export default function DateCalendar({ trip, departDate, returnDate, onSelect }) {
  const [month, setMonth] = useState(() => {
    const chosen = dateFromKey(departDate)
    return chosen ? new Date(chosen.getFullYear(), chosen.getMonth(), 1, 12) : new Date(new Date().getFullYear(), new Date().getMonth(), 1, 12)
  })
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  useEffect(() => {
    const chosen = dateFromKey(departDate)
    if (chosen) setMonth(new Date(chosen.getFullYear(), chosen.getMonth(), 1, 12))
  }, [departDate])

  const first = new Date(month.getFullYear(), month.getMonth(), 1, 12)
  const mondayOffset = (first.getDay() + 6) % 7
  const gridStart = new Date(first)
  gridStart.setDate(first.getDate() - mondayOffset)
  const days = Array.from({ length: 42 }, (_, i) => {
    const date = new Date(gridStart)
    date.setDate(gridStart.getDate() + i)
    return date
  })
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1, 12)
  const canGoBack = month > thisMonth

  const choose = (date) => {
    const key = keyFromDate(date)
    if (trip !== 'dusIntors') {
      onSelect(key, '')
      return
    }
    if (!departDate || returnDate || key < departDate) {
      onSelect(key, '')
      return
    }
    onSelect(departDate, key)
  }

  const previousMonth = () => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1, 12))
  const nextMonth = () => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1, 12))

  return (
    <div className="date-calendar" aria-label="Alege data cursei">
      <div className="date-calendar__head">
        <div>
          <span className="eyebrow">Calendar cursă</span>
          <h3>{monthTitle(month)}</h3>
        </div>
        <div className="date-calendar__nav">
          <button type="button" onClick={previousMonth} disabled={!canGoBack} aria-label="Luna precedentă">←</button>
          <button type="button" onClick={nextMonth} aria-label="Luna următoare">→</button>
        </div>
      </div>
      <div className="date-calendar__grid date-calendar__weekdays" aria-hidden="true">
        {weekdays.map((day) => <span key={day}>{day}</span>)}
      </div>
      <div className="date-calendar__grid">
        {days.map((date) => {
          const key = keyFromDate(date)
          const isPast = date < today
          const isOutside = date.getMonth() !== month.getMonth()
          const isDepart = key === departDate
          const isReturn = key === returnDate
          const between = Boolean(departDate && returnDate && key > departDate && key < returnDate)
          const classes = [
            'date-calendar__day',
            isOutside ? 'is-outside' : '',
            isPast ? 'is-past' : '',
            isDepart ? 'is-depart' : '',
            isReturn ? 'is-return' : '',
            between ? 'is-between' : '',
          ].filter(Boolean).join(' ')
          return (
            <button
              type="button"
              key={key}
              className={classes}
              disabled={isPast}
              onClick={() => choose(date)}
              aria-pressed={isDepart || isReturn}
              aria-label={formatDate(key)}
            >
              <span>{date.getDate()}</span>
              {isDepart && <small>Plecare</small>}
              {isReturn && <small>Retur</small>}
            </button>
          )
        })}
      </div>
      <div className="date-calendar__legend">
        <span><i className="legend-dot legend-dot--depart" />Plecare</span>
        {trip === 'dusIntors' && <span><i className="legend-dot legend-dot--return" />Retur</span>}
      </div>
      <p className="date-calendar__hint">
        {trip === 'dusIntors'
          ? returnDate ? 'Selectează din nou o zi pentru a schimba plecarea.' : departDate ? 'Acum selectează ziua întoarcerii.' : 'Alege ziua plecării, apoi ziua întoarcerii.'
          : 'Alege ziua plecării.'}
      </p>
    </div>
  )
}
