import { useState, useRef, useEffect } from 'react'
import { getAnswer } from '../lib/faq.js'

export default function Agent() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Bună! Sunt asistentul SRS Transfer. Cu ce te pot ajuta? Întreabă-mă despre prețuri, mașini, plată sau rambursare.' },
  ])
  const listRef = useRef(null)

  useEffect(() => {
    const el = listRef.current
    if (el && el.scrollTo) el.scrollTo({ top: el.scrollHeight })
  }, [messages, open])

  const send = async () => {
    const text = input.trim()
    if (!text) return
    setMessages((m) => [...m, { from: 'user', text }])
    setInput('')
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      const data = await res.json()
      setMessages((m) => [...m, { from: 'bot', text: data.reply }])
    } catch {
      setMessages((m) => [...m, { from: 'bot', text: getAnswer(text) }])
    }
  }

  const quick = ['Cât costă?', 'Ce mașini aveți?', 'Cum rambursez?', 'Programul?']

  return (
    <div className="agent">
      {open && (
        <div className="agent__panel">
          <div className="agent__head">
            <span>🤖 Asistent SRS</span>
            <button onClick={() => setOpen(false)} aria-label="Închide">✕</button>
          </div>
          <div className="agent__list" ref={listRef}>
            {messages.map((m, i) => (
              <div key={i} className={`bubble bubble--${m.from}`}>{m.text}</div>
            ))}
          </div>
          <div className="agent__quick">
            {quick.map((q) => (
              <button key={q} onClick={() => setInput(q)}>{q}</button>
            ))}
          </div>
          <div className="agent__input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Scrie un mesaj…"
            />
            <button onClick={send}>➤</button>
          </div>
        </div>
      )}
      <button className="agent__fab" onClick={() => setOpen((o) => !o)} aria-label="Asistent AI">
        💬
      </button>
    </div>
  )
}
