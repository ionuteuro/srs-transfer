import { vehicles } from '../data/vehicles.js'

function reserve(id) {
  sessionStorage.setItem('srs_class', id)
  document.getElementById('rezerva')?.scrollIntoView({ behavior: 'smooth' })
}

export default function Fleet() {
  return (
    <section className="section fleet" id="flota">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">Alegi cum călătorești</p>
          <h2>Două mașini.<br /><em>Același drum liniștit.</em></h2>
          <p>Vezi detaliile fiecărei mașini și selectează varianta potrivită pentru cursa ta.</p>
        </div>
        <div className="fleet-grid">
          {vehicles.map((car, index) => (
            <article className={'fleet-card fleet-card--' + car.id} key={car.id}>
              <div className="fleet-card__visual">
                <span className="fleet-card__index">0{index + 1} / FLOTĂ</span>
                <span className="fleet-card__class">{car.cls}</span>
                <img src={car.logo} alt={car.brand} />
                <div className="fleet-card__model">{car.model}</div>
              </div>
              <div className="fleet-card__body">
                <div className="fleet-card__title"><div><span className="eyebrow">{car.cls} · {car.fuel}</span><h3>{car.brand} {car.model}</h3></div><span className="fleet-card__price">{car.priceDus} <small>RON / sens</small></span></div>
                <div className="fleet-card__specs"><span>♙ {car.seats} locuri</span><span>▱ {car.bags} bagaje</span></div>
                <div className="chip-row">{car.tags.map((tag) => <span className="chip" key={tag}>{tag}</span>)}</div>
                <button className="fleet-card__link" type="button" onClick={() => reserve(car.id)}>Alege mașina <span aria-hidden="true">↗</span></button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
