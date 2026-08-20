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
          <div className="flight">
            <svg className="flight__path" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="routeGrad" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0" stopColor="#38bdf8" />
                  <stop offset="1" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
              <path d="M14 86 Q50 50 86 14" />
            </svg>
            <span className="node node--braila">
              <span className="node__icon" aria-hidden="true">🚗</span>
              Braila
              <span className="node__ping" />
            </span>
            <span className="node node--otp">
              <span className="node__icon" aria-hidden="true">🚗</span>
              Otopeni · OTP
              <span className="node__ping" />
            </span>
            <span className="plane">
              <svg viewBox="0 0 24 24">
                <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L11 19v-5.5z" />
              </svg>
            </span>
          </div>
          <div className="flight__caption">
            <span className="cap cap--out">Din Braila catre Otopeni ✈</span>
            <span className="cap cap--back">Din Otopeni acasa la Braila ✈</span>
          </div>
          <div className="flight__time">⏱ Timp estimat: ~3h 30 min · Braila – Otopeni</div>
        </div>
      </div>
    </section>
  )
}
