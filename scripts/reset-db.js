import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, '..', 'data')

const files = ['srs.db', 'srs.db-wal', 'srs.db-shm', 'appointments.json']
let deleted = 0
for (const f of files) {
  const p = path.join(dataDir, f)
  if (fs.existsSync(p)) {
    fs.rmSync(p)
    deleted++
    console.log('șters:', f)
  }
}

if (deleted === 0) {
  console.log('Nimic de șters — baza e deja goală.')
} else {
  console.log(`Baza de date a fost resetată (${deleted} fișiere).`)
  console.log('Sfat: oprește serverul înainte de reset pentru o ștergere curată.')
}
