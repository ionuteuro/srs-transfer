import { useState } from 'react'

export default function Header() {
  const [open, setOpen] = useState(false)
  const links = [
    { href: '#servicii', label: 'Servicii' },
    { href: '#tarife', label: 'Tarife' },
    { href: '#rezerva', label: 'Rezervă' },
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <header className="header">
      <div className="container header__inner">
        <a href="#top" className="logo">
          <span className="logo__mark">SRS</span>
          <span className="logo__text">Transfer</span>
        </a>

        <nav className={`nav ${open ? 'nav--open' : ''}`}>
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a className="btn btn--primary nav__cta" href="#rezerva" onClick={() => setOpen(false)}>
            Rezervă acum
          </a>
        </nav>

        <button
          className="burger"
          aria-label="Meniu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}
