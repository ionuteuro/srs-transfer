# SRS Transfer

Site pentru **transfer aeroport Otopeni dus-întors** (București / Ilfov), cu:
rezervări online, flotă (Dacia Logan, Toyota Corolla), plată cu cardul prin
**Netopia (mobilPay)**, agent AI, notificări (email/SMS), admin cu tabel +
calendar și bază de date **SQLite**.

## Cerințe
- Node.js 18+ (testat pe 22.x)
- `npm`

## Instalare
```bash
npm install
```

## Comenzi
| Comandă | Ce face |
| --- | --- |
| `npm run dev` | Rulează frontend (Vite :5173) **+** backend (Express :3001) împreună (mod dezvoltare). |
| `npm run start` | Build + pornește serverul de producție pe **:3001** (frontend + API + SQLite). |
| `npm run server` | Doar backend-ul Express (:3001). |
| `npm run dev:web` / `npm run dev:api` | Doar frontendul / doar backend-ul. |
| `npm run build` | Build de producție în `dist/`. |
| `npm run preview` | Previzualizează build-ul (Vite, :4173). |
| `npm run test` | Rulează testele (Vitest) — **33 teste**. |
| `npm run reset` | Șterge baza de date (`data/srs.db`). Oprește serverul înainte. |

## Cum rulezi totul (varianta recomandată)
```bash
npm install
npm run start
```
Apoi deschizi în browser:
- Site: **http://localhost:3001/**
- Admin + calendar: **http://localhost:3001/admin** (token demo `srs-admin`)

Pentru dezvoltare, folosește `npm run dev` și deschizi **http://localhost:5173**.

> **Build-ul e single-file:** `dist/index.html` conține totul inline, așa că
> poți da dublu-click pe el și site-ul se deschide direct (`file://`).
> Atenție: fără server, funcțiile care folosesc backend-ul (rezervare reală,
> agentul, adminul, notificările) nu vor comunica — UI-ul se încarcă, dar
> apelurile `/api` eșuează. Pentru funcționalitate completă folosește
> `npm run start` și deschide **http://localhost:3001**.

> Nu deschide `srs-transfer/index.html` (sursa Vite) — acela e doar intrarea
> pentru `npm run dev`, nu un build.

## Variabile de mediu (`.env`)
Copiază `.env.example` → `.env`. Totul e opțional; în lipsa lor, plata și
notificările merg în **mod mock** (se afișează în consola serverului).

### Plată — Netopia (mobilPay), clasic / hosted redirect
| Variabilă | Descriere |
| --- | --- |
| `NETOPIA_SIGNATURE` | Signature-ul contului tău Netopia. |
| `NETOPIA_CERT` | Calea către certificatul public `.cer`. |
| `NETOPIA_KEY` | Calea către cheia privată `.pem` (decriptare IPN). |
| `NETOPIA_SANDBOX` | `true` = sandbox, `false` = producție. |
| `PUBLIC_BASE` | URL public pentru IPN/return (ex. `https://domeniu.ro`). |

### Admin
| Variabilă | Descriere |
| --- | --- |
| `ADMIN_TOKEN` | Token-ul pentru `/admin` și API-ul de programări. Fără el, e `srs-admin`. |

### Notificări (email + SMS)
| Variabilă | Descriere |
| --- | --- |
| `ADMIN_EMAIL` / `ADMIN_PHONE` | Unde primești notificare la fiecare programare nouă. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Email prin SMTP. |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM` | SMS prin Twilio. |

### Altele
| Variabilă | Descriere |
| --- | --- |
| `OPENAI_API_KEY` | Activează agentul AI real (LLM). Fără ea → mod FAQ. |
| `OPENAI_MODEL` | Modelul (default `gpt-4o-mini`). |
| `PORT` | Port backend (default `3001`). |
| `DB_PATH` | Calea bazei SQLite (default `data/srs.db`). |

## Structură
```
src/
  components/   Header, Hero, Services, Fleet, Pricing, Booking,
                Contact, Footer, Agent, Admin
  lib/          pricing.js, validators.js, faq.js
  data/         vehicles.js
  App.jsx, main.jsx, index.css
server/
  index.js          Express: /api/* (appointments, create-payment, ipn, agent)
  netopia.js        criptare/decriptare clasică mobilPay
  notifications.js  email (SMTP) + SMS (Twilio), fallback mock
  store.js          acces SQLite
  db.js             conexiune + schemă
scripts/
  reset-db.js       șterge baza de date
```

## Note
- Fără cheile Netopia → plata e **simulată** (nu trage bani reali).
- Fără SMTP/Twilio → notificările se **loghează** în consola serverului.
- Baza de date e un fișier local (`data/srs.db`), ideal pentru un singur server.
  Pentru mai multe instanțe, înlocuiește `server/db.js` cu Postgres/MySQL.
