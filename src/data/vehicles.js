import { ToyotaLogo, DaciaLogo } from '../components/Logos.jsx'

export const vehicles = [
  {
    id: 'logan',
    brand: 'Dacia',
    model: 'Logan',
    cls: 'Standard',
    Logo: DaciaLogo,
    seats: 5,
    bags: 2,
    fuel: 'Benzină',
    priceDus: 89,
    priceBoth: 159,
    tags: ['5 locuri', 'Climatizare', 'Spațiu portbagaj'],
  },
  {
    id: 'corolla',
    brand: 'Toyota',
    model: 'Corolla Sedan',
    cls: 'Confort',
    Logo: ToyotaLogo,
    seats: 5,
    bags: 3,
    fuel: 'Hybrid',
    priceDus: 119,
    priceBoth: 199,
    tags: ['5 locuri', 'Hybrid silențios', 'Confort premium'],
  },
]
