export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="logo">
          <span className="logo__mark">SRS</span>
          <span className="logo__text">Transfer</span>
        </div>
        <p className="footer__copy">© {year} SRS Transfer · Transfer aeroport Otopeni dus-întors</p>
        <p className="footer__small">Confort · Siguranță · Preț fix</p>
        <a className="footer__admin" href="/admin">Acces admin</a>
      </div>
    </footer>
  )
}
