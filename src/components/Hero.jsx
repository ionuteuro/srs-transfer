import RouteMap from './RouteMap'

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
        <div className="hero__card">
          <RouteMap />
          <div className="hero__card-overlay">
            <div className="hero__card-top">
              <span className="taxi-badge">🚕 TAXI</span>
              <a className="map-link" href="https://www.google.com/maps/dir/?api=1&origin=45.2691,27.9576&destination=44.5726,26.0855&travelmode=driving" target="_blank" rel="noopener noreferrer">📍 Google Maps</a>
            </div>
            <div className="hero__card-foot">
              <span>Transfer taxi Brăila ⇄ Otopeni</span>
              <span className="hero__card-time">⏱ ~3h 30 min</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
