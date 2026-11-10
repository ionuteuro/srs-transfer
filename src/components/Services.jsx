const services = [
  {
    number: '01',
    title: 'Preluare de la adresă',
    text: 'Spune-ne de unde pleci din Brăila. Stabilim punctul de întâlnire înainte de cursă.',
  },
  {
    number: '02',
    title: 'Cursă directă',
    text: 'Mergi direct spre Aeroportul Henri Coandă, fără schimbări de mașină.',
  },
  {
    number: '03',
    title: 'Dus sau dus-întors',
    text: 'Alege o singură direcție sau trece ambele date în aceeași solicitare.',
  },
]

export default function Services() {
  return (
    <section className="section services" id="servicii">
      <div className="container">
        <div className="section-heading section-heading--split">
          <div><p className="eyebrow">Un drum bine pus la punct</p><h2>Mai puține griji.<br /><em>Mai multă călătorie.</em></h2></div>
          <p>Transferul începe cu o solicitare simplă. Alegi ruta, data și mașina; primești confirmarea cursei înainte de plecare.</p>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.number}>
              <span className="service-card__number">{service.number}</span>
              <div className="service-card__arrow" aria-hidden="true">↗</div>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
