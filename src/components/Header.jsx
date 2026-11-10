import { useState } from 'react'

const links = [
  { href: '#servicii', label: 'Servicii' },
  { href: '#flota', label: 'Flota' },
  { href: '#tarife', label: 'Tarife' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="brand" href="#top" aria-label="SRS Transfer, pagina principală">
          <span className="brand__mark">S</span>
          <span className="brand__name">SRS <small>TRANSFER</small></span>
        </a>
        <nav className={'site-nav' + (open ? ' site-nav--open' : '')} aria-label="Navigare principală">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)}>Contact</a>
          <a className="button button--small button--dark site-nav__cta" href="#rezerva" onClick={() => setOpen(false)}>
            Rezervă cursa <span aria-hidden="true">↗</span>
          </a>
        </nav>
        <button
          className="menu-button"
          type="button"
          aria-label={open ? 'Închide meniul' : 'Deschide meniul'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span /><span />
        </button>
      </div>
    </header>
  )
}
