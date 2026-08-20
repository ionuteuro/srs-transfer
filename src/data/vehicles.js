import daciaLogo from '../assets/logos/dacia.svg'
import toyotaLogo from '../assets/logos/toyota.svg'

export const vehicles = [
  {
    id: 'logan',
    brand: 'Dacia',
    model: 'Logan',
    cls: 'Standard',
    logo: daciaLogo,
    seats: 5,
    bags: 2,
    fuel: 'Benzină',
    priceDus: 800,
    priceBoth: 1600,
    tags: ['5 locuri', 'Climatizare', 'Spațiu portbagaj'],
  },
  {
    id: 'corolla',
    brand: 'Toyota',
    model: 'Corolla',
    cls: 'Confort',
    logo: toyotaLogo,
    seats: 5,
    bags: 3,
    fuel: 'Hybrid',
    priceDus: 800,
    priceBoth: 1600,
    tags: ['5 locuri', 'Hybrid silențios', 'Confort premium'],
  },
]
