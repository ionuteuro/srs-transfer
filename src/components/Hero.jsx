export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="eyebrow"><span className="eyebrow__dot" /> Transfer privat · Brăila ↔ Otopeni</p>
          <h1>Tu te ocupi de călătorie. <em>Noi de drum.</em></h1>
          <p className="hero__lead">
            Transfer direct între Brăila și Aeroportul Otopeni, cu preluare de la adresă și tarif stabilit înainte de plecare.
          </p>
          <div className="hero__actions">
            <a className="button button--primary" href="#rezerva">Alege data cursei <span aria-hidden="true">↘</span></a>
            <a className="text-link" href="#tarife">Vezi tarifele <span aria-hidden="true">→</span></a>
          </div>
          <div className="hero__trust">
            <span><b>01</b> Preluare la adresă</span>
            <span><b>02</b> Tarif clar</span>
            <span><b>03</b> Dus sau dus-întors</span>
          </div>
        </div>

        <div className="route-card" aria-label="Traseu Brăila către Aeroportul Otopeni">
          <div className="route-card__top">
            <div><span className="eyebrow">Călătorie fără ocolișuri</span><strong>Brăila <span>→</span> Otopeni</strong></div>
            <span className="route-card__stamp">SRS<br />01</span>
          </div>
          <div className="route-visual">
            <div className="route-visual__wash route-visual__wash--one" />
            <div className="route-visual__wash route-visual__wash--two" />
            <svg viewBox="0 0 540 250" role="img" aria-label="Ilustrație stilizată a traseului">
              <path className="route-visual__road" d="M42 187 C114 173 110 102 191 119 S283 190 345 128 S411 61 497 58" />
              <path className="route-visual__line" d="M42 187 C114 173 110 102 191 119 S283 190 345 128 S411 61 497 58" />
              <circle className="route-visual__point" cx="42" cy="187" r="8" />
              <circle className="route-visual__point route-visual__point--end" cx="497" cy="58" r="8" />
              <g className="route-visual__car" transform="translate(260 125) rotate(-16)">
                <rect x="-30" y="-12" width="60" height="24" rx="9" />
                <path d="M-16 -12 L-9 -23 H13 L22 -12" />
                <circle cx="-17" cy="13" r="5" /><circle cx="18" cy="13" r="5" />
              </g>
            </svg>
            <span className="route-visual__label route-visual__label--start">BRĂILA</span>
            <span className="route-visual__label route-visual__label--end">AEROPORT OTP</span>
            <span className="route-visual__north">N<br />↑</span>
          </div>
          <div className="route-card__bottom">
            <div><span>Preluare</span><strong>De la adresa ta</strong></div>
            <div className="route-card__separator" />
            <div><span>Destinație</span><strong>Henri Coandă · OTP</strong></div>
            <a href="#rezerva" aria-label="Rezervă transferul">↗</a>
          </div>
        </div>
      </div>
      <div className="hero__edge" aria-hidden="true">DRUMUL TĂU, ÎN RITMUL TĂU</div>
    </section>
  )
}
