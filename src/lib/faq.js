const FAQ = [
  {
    keywords: ['pret', 'costa', 'tarif', 'ron', 'preturi', 'valoare'],
    answer:
      'Tariful este de 800 RON / segment (un sens). Dus-întors înseamnă 2 segmente = 1600 RON, pentru ambele mașini (Dacia Logan și Toyota Corolla). Prețul e fix, fără suprataxe.',
  },
  {
    keywords: ['ramburs', 'return', 'bani inapoi', 'anul', 'anulez'],
    answer:
      'Politica de rambursare: 100% dacă anulezi cu minim 24h înainte, 50% între 12–24h, iar sub 12h e nereturnabil (exceptând anularea zborului, dovedită).',
  },
  {
    keywords: ['dus intors', 'dus-întors', 'retur', 'intoarcere', 'întors'],
    answer:
      'Oferim transfer aeroport Braila – Otopeni dus-întors la pachet, cu preț redus față de cursele separate. Te aducem înapoi la sosirea zborului.',
  },
  {
    keywords: ['masina', 'masini', 'logan', 'corolla', 'dacia', 'toyota', 'flota', 'model'],
    answer:
      'Flota: Dacia Logan (clasa Standard, 5 locuri) și Toyota Corolla Sedan (clasa Confort, hybrid, 5 locuri). Ambele cu climatizare.',
  },
  {
    keywords: ['plata', 'card', 'achit', 'plateste', 'plată'],
    answer:
      'Plata se face exclusiv cu cardul (Visa / Mastercard), în siguranță, prin Netopia. Introduci datele cardului la finalul rezervării.',
  },
  {
    keywords: ['program', 'orar', 'nonstop', '24', 'disponibil', 'cand'],
    answer:
      'Suntem disponibili 24/7, inclusiv weekend și sărbători. Urmărim zborul și ajustăm ora de preluare la sosire.',
  },
  {
    keywords: ['rezerv', 'comand', 'fac', 'cum'],
    answer:
      'Rezervi din formularul de pe site: alegi clasa și locurile, completezi datele cursei și plătești cu cardul. E simplu și rapid.',
  },
  {
    keywords: ['otopeni', 'aeroport', 'henri coanda', 'otp', 'unde'],
    answer:
      'Te preluăm din Braila și te ducem la Aeroportul Internațional Henri Coandă (OTP / Otopeni), apoi te aducem înapoi la Braila.',
  },
  {
    keywords: ['contact', 'telefon', 'sun', 'whatsapp', 'email'],
    answer:
      'Ne găsești la telefon +40 700 000 000, pe WhatsApp sau pe contact@srs-transfer.ro.',
  },
  {
    keywords: ['locuri', 'persoane', 'pasager', 'copil', 'bagaj'],
    answer:
      'Fiecare mașină are 5 locuri. Prețul include până la 4 locuri; al 5-lea adaugă 10 RON. Poți menționa bagaje voluminoase sau scaun de copil în observații.',
  },
]

const DEFAULT =
  'Sunt asistentul SRS Transfer. Te pot ajuta cu prețuri, mașini (Dacia Logan / Toyota Corolla), plata cu cardul, rambursarea banilor sau programul 24/7. Ce vrei să știi?'

export function getAnswer(text) {
  const q = normalize(String(text || ''))
  if (!q.trim()) return DEFAULT
  for (const item of FAQ) {
    if (item.keywords.some((k) => q.includes(normalize(k)))) return item.answer
  }
  return DEFAULT
}

function normalize(s) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}
