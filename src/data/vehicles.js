import daciaImg from '../assets/cars/dacia-logan-2016.jpg'
import toyotaImg from '../assets/cars/toyota-corolla-2024.jpg'

export const vehicles = [
  {
    id: 'logan',
    brand: 'Dacia',
    model: 'Logan (2016)',
    cls: 'Standard',
    image: daciaImg,
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
    model: 'Corolla Sedan (2024)',
    cls: 'Confort',
    image: toyotaImg,
    seats: 5,
    bags: 3,
    fuel: 'Hybrid',
    priceDus: 800,
    priceBoth: 1600,
    tags: ['5 locuri', 'Hybrid silențios', 'Confort premium'],
  },
]
