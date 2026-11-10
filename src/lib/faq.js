const FAQ = [
  {
    keywords: ['pret', 'costa', 'tarif', 'ron', 'preturi', 'valoare'],
    answer: 'Tariful este de 800 RON pe sens și 1600 RON dus-întors, pentru Dacia Logan sau Toyota Corolla. Al cincilea pasager adaugă 10 RON.',
  },
  {
    keywords: ['dus intors', 'dus-întors', 'retur', 'intoarcere', 'întors'],
    answer: 'Poți trimite o solicitare dus-întors cu ambele date în același formular. Tariful afișat pentru dus-întors este 1600 RON.',
  },
  {
    keywords: ['masina', 'masini', 'logan', 'corolla', 'dacia', 'toyota', 'flota', 'model'],
    answer: 'Flota include Dacia Logan, clasa Standard, și Toyota Corolla, clasa Confort. Ambele au maximum 5 locuri.',
  },
  {
    keywords: ['plata', 'card', 'achit', 'plateste', 'plată'],
    answer: 'Formularul trimite o solicitare și nu încasează o plată online. Ora cursei se confirmă după verificarea disponibilității.',
  },
  {
    keywords: ['program', 'orar', 'disponibil', 'cand', 'când'],
    answer: 'Disponibilitatea cursei se verifică după ce trimiți data și ora dorite. Poți include numărul zborului în formular.',
  },
  {
    keywords: ['rezerv', 'comand', 'fac', 'cum'],
    answer: 'Alege tipul cursei, datele din calendar și mașina, apoi completează datele de contact. Solicitarea apare în calendarul de administrare pentru confirmare.',
  },
  {
    keywords: ['otopeni', 'aeroport', 'henri coanda', 'otp', 'unde'],
    answer: 'Serviciul este un transfer privat între Brăila și Aeroportul Internațional Henri Coandă (OTP / Otopeni).',
  },
  {
    keywords: ['contact', 'telefon', 'sun', 'whatsapp', 'email'],
    answer: 'Trimite detaliile cursei prin formularul de rezervare. Solicitarea ajunge în calendarul de administrare pentru confirmare.',
  },
  {
    keywords: ['locuri', 'persoane', 'pasager', 'copil', 'bagaj'],
    answer: 'Mașinile au maximum 5 locuri. Tariful include până la 4 pasageri, iar al cincilea adaugă 10 RON. Poți trece detalii despre bagaje sau scaun de copil în observații.',
  },
  {
    keywords: ['anul', 'anulez', 'ramburs', 'bani inapoi'],
    answer: 'Politica afișată în prezent: 100% la anulare cu minimum 24h înainte, 50% între 12 și 24h și 0% sub 12h (exceptând anularea zborului dovedită).',
  },
]

const DEFAULT = 'Sunt asistentul SRS Transfer. Te pot ajuta cu tarifele, flota, ruta și pașii de rezervare.'

export function getAnswer(text) {
  const question = normalize(String(text || ''))
  if (!question.trim()) return DEFAULT
  for (const item of FAQ) {
    if (item.keywords.some((keyword) => question.includes(normalize(keyword)))) return item.answer
  }
  return DEFAULT
}

function normalize(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}
