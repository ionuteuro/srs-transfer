export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <a className="brand brand--footer" href="#top"><span className="brand__mark">S</span><span className="brand__name">SRS <small>TRANSFER</small></span></a>
        <span>Brăila <i>↔</i> Aeroportul Otopeni</span>
        <span>© {new Date().getFullYear()} SRS Transfer</span>
        <a className="site-footer__admin" href="/admin">Admin</a>
      </div>
    </footer>
  )
}
