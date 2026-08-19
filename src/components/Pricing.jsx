const plans = [
  {
    name: 'Doar dus',
    price: '89',
    note: 'O singură cursă spre Otopeni',
    features: ['Preluare la ușă', 'Mașină confortabilă', 'Preț fix'],
    highlight: false,
  },
  {
    name: 'Dus-întors',
    price: '159',
    note: 'Cea mai aleasă opțiune',
    features: ['Ambele sensuri', 'Urmărire zbor', 'Așteptare gratuită', 'Reducere pachet'],
    highlight: true,
  },
  {
    name: 'Business',
    price: '219',
    note: 'Confort premium dus-întors',
    features: ['Mașină premium', 'Șofer dedicat', 'Statie încărcare', 'Apa & wifi'],
    highlight: false,
  },
]

export default function Pricing() {
  return (
    <section className="section section--alt" id="tarife">
      <div className="container">
        <div className="section__head">
          <h2>Tarife transparente</h2>
          <p>Prețuri fixe, fără suprataxe ascunse. Plătești la ce ajungi.</p>
        </div>
        <div className="grid grid--3">
          {plans.map((p) => (
            <article className={`price ${p.highlight ? 'price--hot' : ''}`} key={p.name}>
              {p.highlight && <span className="price__tag">Popular</span>}
              <h3>{p.name}</h3>
              <p className="price__note">{p.note}</p>
              <div className="price__amount">
                <span className="price__currency">RON</span>
                <span className="price__value">{p.price}</span>
              </div>
              <ul className="price__features">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <a className="btn btn--primary price__btn" href="#rezerva">Rezervă</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
