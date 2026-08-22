export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero__inner">
        <div className="hero__content">
          <span className="badge">Transfer taxi aeroport Brăila – Otopeni · dus-întors</span>
          <h1>
            Ajungi la <span className="accent">Otopeni</span> și înapoi la
            <span className="accent"> Brăila</span>, fără griji.
          </h1>
          <p className="lead">
            SRS Transfer te preia din Brăila, te duce la Aeroportul Henri
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
            <span className="taxi-badge">🚕 TAXI</span>
            <svg className="map" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="routeGrad" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0" stopColor="#fde047" />
                  <stop offset="1" stopColor="#f59e0b" />
                </linearGradient>
                <linearGradient id="landGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#0e1a2b" />
                  <stop offset="1" stopColor="#0a1422" />
                </linearGradient>
                <linearGradient id="riverGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#0ea5e9" stopOpacity="0.5" />
                  <stop offset="1" stopColor="#22d3ee" stopOpacity="0.22" />
                </linearGradient>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M10 0H0V10" fill="none" stroke="rgba(148,163,184,.08)" strokeWidth="0.4" />
                </pattern>
              </defs>

              <rect x="0" y="0" width="100" height="100" rx="4" fill="url(#landGrad)" />
              <rect x="0" y="0" width="100" height="100" rx="4" fill="url(#grid)" />

              <path d="M0 93 C18 88 30 97 50 92 C70 87 82 96 100 90 L100 100 L0 100 Z" fill="url(#riverGrad)" />
              <path d="M0 93 C18 88 30 97 50 92 C70 87 82 96 100 90" fill="none" stroke="rgba(34,211,238,.55)" strokeWidth="0.6" />

              <g stroke="rgba(148,163,184,.22)" strokeWidth="0.8" fill="none" strokeLinecap="round">
                <path d="M50 50 C56 34 62 24 66 10" />
                <path d="M50 50 C44 66 39 76 28 85" />
                <path d="M14 86 C26 80 32 70 40 60" />
              </g>

              <path d="M14 86 Q50 50 86 14" fill="none" stroke="url(#routeGrad)" strokeWidth="2.4" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 3px rgba(245,158,11,.6))' }} />

              <g fill="rgba(34,197,130,.45)">
                <circle cx="22" cy="28" r="1.5" />
                <circle cx="72" cy="38" r="1.3" />
                <circle cx="62" cy="72" r="1.6" />
                <circle cx="38" cy="18" r="1.2" />
                <circle cx="84" cy="58" r="1.2" />
              </g>

              <g transform="translate(90,9)">
                <circle r="4.6" fill="rgba(255,255,255,.06)" stroke="rgba(148,163,184,.35)" strokeWidth="0.4" />
                <path d="M0 -3 L1.3 0 L0 3 L-1.3 0 Z" fill="#f59e0b" />
                <text x="0" y="-5.4" fontSize="2.6" textAnchor="middle" fill="rgba(226,232,240,.85)" fontFamily="system-ui, sans-serif">N</text>
              </g>
            </svg>
            <span className="node node--braila">
              <span className="node__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg></span>
              Brăila
              <span className="node__ping" />
            </span>
            <span className="node node--otp">
              <span className="node__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg></span>
              Otopeni · OTP
              <span className="node__ping" />
            </span>
            <span className="car" aria-hidden="true">🚕</span>
          </div>
          <div className="flight__caption">
            <span className="cap cap--out">Din Brăila către Otopeni</span>
            <span className="cap cap--back">Din Otopeni acasă la Brăila</span>
          </div>
          <div className="flight__time">⏱ Timp estimat: ~3h 30 min · Brăila – Otopeni</div>
        </div>
      </div>
    </section>
  )
}
