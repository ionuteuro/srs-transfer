import daciaLogo from '../assets/logos/dacia.svg'
import toyotaLogo from '../assets/logos/toyota.svg'
import { vehicles as catalog } from './vehicle-catalog.js'

const logos = { logan: daciaLogo, corolla: toyotaLogo }

export const vehicles = catalog.map((vehicle) => ({ ...vehicle, logo: logos[vehicle.id] }))
