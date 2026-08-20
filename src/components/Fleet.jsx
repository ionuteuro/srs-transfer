import { vehicles } from '../data/vehicles.js'

const cars = vehicles

export default function Fleet() {
  const reserve = (id) => {
    sessionStorage.setItem('srs_class', id)
    document.getElementById('rezerva')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="section" id="flota">
      <div className="container">
        <div className="section__head">
          <h2>Flota noastră</h2>
          <p>
            Categorie standard cu clasă de confort. Alege mașina potrivită
            pentru transferul tău Braila – Otopeni dus-întors.
          </p>
        </div>

        <div className="grid grid--2">
          {cars.map((c) => (
            <article className="car" key={c.id}>
              <span className={`car__badge car__badge--${c.id}`}>{c.cls}</span>
              <div className="car__logo">
                <img className="brand__logo" src={c.logo} alt={`Sigla ${c.brand}`} />
                <span className={`car__model car__model--${c.id}`}>{c.model}</span>
              </div>
              <div className="car__body">
                <h3>
                  {c.brand} {c.model}
                </h3>
                <ul className="car__specs">
                  <li>👥 {c.seats} locuri</li>
                  <li>🧳 {c.bags} bagaje</li>
                  <li>⛽ {c.fuel}</li>
                </ul>
                <div className="car__tags">
                  {c.tags.map((t) => (
                    <span className="chip" key={t}>{t}</span>
                  ))}
                </div>
                <div className="car__price">
                  <div>
                    <span className="car__price-val">de la {c.priceDus} RON / segment</span>
                    <span className="car__price-sub">dus · {c.priceBoth} RON dus-întors</span>
                  </div>
                  <button className="btn btn--primary" onClick={() => reserve(c.id)}>
                    Rezervă
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
