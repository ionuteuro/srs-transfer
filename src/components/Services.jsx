const services = [
  {
    icon: '🚖',
    title: 'Preluare la ușă',
    text: 'Șoferul te preia din orice zonă a Bucureștiului sau Ilfovului, exact la ora stabilită.',
  },
  {
    icon: '✈️',
    title: 'Dus la Otopeni',
    text: 'Cursă directă către Aeroportul Henri Coandă, fără opriri inutile și fără stres.',
  },
  {
    icon: '⏱️',
    title: 'Întâmpinare la sosire',
    text: 'La retur te așteptăm cu pancarta, urmărim zborul și ajustăm ora de plecare.',
  },
  {
    icon: '🔁',
    title: 'Dus-întors la pachet',
    text: 'Rezervi ambele sensuri odată și primești un preț redus față de cursele separate.',
  },
]

export default function Services() {
  return (
    <section className="section" id="servicii">
      <div className="container">
        <div className="section__head">
          <h2>Ce oferim</h2>
          <p>Un serviciu complet de transfer, gândit pentru călătorii relaxați.</p>
        </div>
        <div className="grid grid--4">
          {services.map((s) => (
            <article className="card" key={s.title}>
              <div className="card__icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
