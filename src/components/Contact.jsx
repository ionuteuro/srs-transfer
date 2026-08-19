export default function Contact() {
  return (
    <section className="section section--alt" id="contact">
      <div className="container contact">
        <div className="contact__info">
          <h2>Vorbește cu noi</h2>
          <p>Rezervă rapid sau întreabă orice detaliu. Răspundem imediat.</p>
          <ul className="contact__list">
            <li><span>📞</span> <a href="tel:+40700000000">+40 700 000 000</a></li>
            <li><span>💬</span> <a href="https://wa.me/40700000000">WhatsApp</a></li>
            <li><span>✉️</span> <a href="mailto:contact@srs-transfer.ro">contact@srs-transfer.ro</a></li>
            <li><span>📍</span> București &amp; Aeroportul Otopeni (OTP)</li>
          </ul>
        </div>
        <a className="btn btn--primary contact__cta" href="https://wa.me/40700000000">
          Rezervă pe WhatsApp
        </a>
      </div>
    </section>
  )
}
