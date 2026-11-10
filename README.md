# SRS Transfer

Site de prezentare și solicitare transfer privat **Brăila ↔ Aeroportul Otopeni**. Include selectare de dată în calendar, estimare de tarif, cereri salvate în SQLite, notificări configurabile și panou de administrare cu calendar.

## Pornire

Necesită Node.js 18+ și npm.

```bash
npm install
npm run dev
```

Deschide `http://localhost:5173`. Pentru build local și servirea site-ului împreună cu API-ul:

```bash
npm run start
```

Site: `http://localhost:3001/` · Administrare: `http://localhost:3001/admin`

Comenzi utile: `npm run build`, `npm run server`, `npm run test`, `npm run reset`.

## Fluxul de rezervare

Clientul alege tipul cursei, datele din calendar, mașina și pasagerii, apoi trimite solicitarea. Serverul validează datele și calculează tariful din catalogul comun. Cererea apare cu statusul **În așteptare** în panoul de administrare. Trimiterea formularului nu confirmă automat ora și nu încasează o plată online.

Tarifele inițiale sunt 800 RON pe sens și 1600 RON dus-întors pentru Dacia Logan și Toyota Corolla. Locul al cincilea adaugă 10 RON. Actualizează catalogul din `src/data/vehicle-catalog.js` când se schimbă tarifele sau flota.

## Configurare (`.env`)

Copiază `.env.example` în `.env`.

| Variabilă | Rol |
| --- | --- |
| `ADMIN_TOKEN` | Token necesar pentru API-ul și pagina de administrare. Nu există token demo implicit. |
| `DB_PATH` | Calea bazei SQLite; implicit `data/srs.db`. |
| `ADMIN_EMAIL`, `ADMIN_PHONE` | Destinatarii notificărilor despre cereri noi. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Trimitere email prin SMTP. |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM` | Trimitere SMS prin Twilio. |
| `OPENAI_API_KEY`, `OPENAI_MODEL` | Agent conversațional; fără cheie răspunde FAQ-ul local. |
| `PORT` | Portul Express; implicit `3001`. |

Fără setări SMTP sau Twilio, notificările sunt simulate în consola serverului. Pentru folosirea API-ului, rulează backend-ul Express; publicarea doar a directorului `dist/` pe GitHub Pages nu oferă API.

## Structură

```text
src/components/       paginile, calendarul de rezervare și administrarea
src/data/             catalog comun pentru mașini și tarife
src/lib/               prețuri, validări și răspunsuri FAQ
server/                API Express, SQLite și notificări
scripts/reset-db.js    șterge baza locală
```
