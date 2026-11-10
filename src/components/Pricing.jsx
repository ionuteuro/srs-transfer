import { vehicles } from '../data/vehicles.js'

export default function Pricing() {
  return (
    <section className="section pricing" id="tarife">
      <div className="container pricing__inner">
        <div className="pricing__intro">
          <p className="eyebrow">Fără calcule la final</p>
          <h2>Știi tariful<br /><em>înainte să pleci.</em></h2>
          <p>Prețul cursei este afișat în formular înainte de trimiterea solicitării. Un loc suplimentar peste primele patru adaugă 10 RON.</p>
          <a className="text-link" href="#rezerva">Calculează cursa <span aria-hidden="true">→</span></a>
        </div>
        <div className="pricing__cards">
          {vehicles.map((car) => (
            <article className="rate-card" key={car.id}>
              <div className="rate-card__top"><span>{car.brand} {car.model}</span><span>{car.cls}</span></div>
              <div className="rate-card__price"><strong>{car.priceDus}</strong><span>RON / un sens</span></div>
              <div className="rate-card__rule" />
              <div className="rate-card__return"><span>Dus-întors</span><strong>{car.priceBoth} RON</strong></div>
              <a href="#rezerva">Alege data <span aria-hidden="true">↗</span></a>
            </article>
          ))}
          <p className="pricing__note">Tariful afișat acoperă până la 4 pasageri. Capacitate maximă: 5 locuri.</p>
        </div>
      </div>
    </section>
  )
}
