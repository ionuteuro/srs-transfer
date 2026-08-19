import { vehicles } from '../data/vehicles.js'

export function priceFor(vehicleId, trip, seats = 1) {
  const car = vehicles.find((v) => v.id === vehicleId) || vehicles[0]
  const base = trip === 'dusIntors' ? car.priceBoth : car.priceDus
  const extraSeats = seats > 4 ? (seats - 4) * 10 : 0
  return { base, extraSeats, total: base + extraSeats, vehicle: car }
}
