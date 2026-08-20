export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero__inner">
        <div className="hero__content">
          <span className="badge">Transfer aeroport Braila – Otopeni · dus-întors</span>
          <h1>
            Ajungi la <span className="accent">Otopeni</span> și înapoi la
            <span className="accent"> Braila</span>, fără griji.
          </h1>
          <p className="lead">
            SRS Transfer te preia din Braila, te duce la Aeroportul Henri
            Coandă (Otopeni) și te aduce înapoi la sosire — la un preț fix, cu
            șofer punctual și mașină confortabilă.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary" href="#rezerva">Rezervă cursa</a>
            <a className="btn btn--ghost" href="#tarife">Vezi tarifele</a>
          </div>
          <ul className="hero__stats">
            <li><strong>24/7</strong><span>Disponibil</span></li>
            <li><strong>100%</strong><span>Preț fix</span></li>
            <li><strong>15 min</strong><span>Așteptare gratuită</span></li>
          </ul>
        </div>
        <div className="hero__card" aria-hidden="true">
          <div className="plane">✈️</div>
          <div className="route">
            <span>Acasă</span>
            <span className="route__line" />
            <span>OTP</span>
          </div>
          <div className="route route--back">
            <span>OTP</span>
            <span className="route__line" />
            <span>Acasă</span>
          </div>
        </div>
      </div>
    </section>
  )
}
