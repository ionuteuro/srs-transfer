import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const BRĂILA = [45.2691, 27.9576]
const OTOPENI = [44.5726, 26.0855]

function pointAlong(coords, p) {
  if (coords.length < 2) return coords[0]
  const segLens = []
  let total = 0
  for (let i = 0; i < coords.length - 1; i++) {
    const a = coords[i]
    const b = coords[i + 1]
    const d = Math.hypot(b[0] - a[0], b[1] - a[1])
    segLens.push(d)
    total += d
  }
  if (total === 0) return coords[0]
  let target = p * total
  for (let i = 0; i < segLens.length; i++) {
    if (target <= segLens[i] || i === segLens.length - 1) {
      const f = segLens[i] ? target / segLens[i] : 0
      return [
        coords[i][0] + (coords[i + 1][0] - coords[i][0]) * f,
        coords[i][1] + (coords[i + 1][1] - coords[i][1]) * f,
      ]
    }
    target -= segLens[i]
  }
  return coords[coords.length - 1]
}

export default function RouteMap() {
  const elRef = useRef(null)

  useEffect(() => {
    if (!elRef.current || elRef.current._leaflet_id) return

    const map = L.map(elRef.current, {
      center: [44.95, 27.0],
      zoom: 8,
      zoomControl: false,
      scrollWheelZoom: false,
      attributionControl: true,
    })

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap &copy; CARTO',
    }).addTo(map)

    const pin = (coords, label, color) =>
      L.marker(coords, {
        icon: L.divIcon({
          className: 'map-pin',
          html: `<span class="map-pin__dot" style="background:${color}"></span><span class="map-pin__label">${label}</span>`,
          iconSize: [0, 0],
        }),
      }).addTo(map)

    pin(BRĂILA, 'Brăila', '#f59e0b')
    pin(OTOPENI, 'Otopeni · OTP', '#38bdf8')

    const route = [BRĂILA, OTOPENI]
    const routeLine = L.polyline(route, {
      color: '#f59e0b',
      weight: 5,
      opacity: 0.95,
      lineCap: 'round',
    }).addTo(map)
    map.fitBounds(routeLine.getBounds(), { padding: 50 })

    const taxi = L.marker(BRĂILA, {
      icon: L.divIcon({
        className: 'taxi-marker',
        html: '🚕',
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      }),
      zIndexOffset: 1000,
    }).addTo(map)

    const DURATION = 13000
    let raf
    const start = performance.now()
    const frame = (now) => {
      const elapsed = (now - start) % (DURATION * 2)
      let p = elapsed / DURATION
      if (p > 1) p = 2 - p
      taxi.setLatLng(pointAlong(route, p))
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      map.remove()
    }
  }, [])

  return <div className="routemap" ref={elRef} aria-hidden="true" />
}
