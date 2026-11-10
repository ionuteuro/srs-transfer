import Database from 'better-sqlite3'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'srs.db')

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })

const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId TEXT UNIQUE,
    name TEXT,
    phone TEXT,
    email TEXT,
    vehicle TEXT,
    trip TEXT,
    seats INTEGER,
    departDate TEXT,
    departTime TEXT,
    returnDate TEXT,
    returnTime TEXT,
    flightOut TEXT,
    flightBack TEXT,
    pickup TEXT,
    notes TEXT,
    amount REAL,
    details TEXT,
    status TEXT DEFAULT 'in_asteptare',
    createdAt TEXT
  );
`)

const columns = new Set(db.prepare('PRAGMA table_info(appointments)').all().map((column) => column.name))
for (const [name, type] of [['flightOut', 'TEXT'], ['flightBack', 'TEXT'], ['notes', 'TEXT']]) {
  if (!columns.has(name)) db.exec('ALTER TABLE appointments ADD COLUMN ' + name + ' ' + type)
}

export default db
