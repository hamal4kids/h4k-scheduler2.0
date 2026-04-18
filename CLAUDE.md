Before writing or modifying any code, identify your domain and read the corresponding skill file in full.

| Trigger | Skill file |
|---|---|
| `src/**/*.jsx`, `src/**/*.js`, `src/index.css`, `tailwind.config.js`, `vite.config.js` | `.claude/skills/frontend.md` |
| `n8n-workflows/*.json`, `scheduleTrigger`, `splitInBatches`, `code node` | `.claude/skills/workflow.md` |
| `beaconOAuth2Api`, `GroupMessageReceived`, `sendText`, `sendImage`, `chatId`, `beacon_chat_id` | `.claude/skills/whatsapp-beacon.md` |
| `googleSheets`, `Cloudinary`, `httpRequest`, `documentId`, `sheetName`, `media_url`, `cloudinary_id` | `.claude/skills/data-routing.md` |
| `H4K`, `h4k-scheduler`, repo structure, GitHub, deployment, `gh-pages`, cross-cutting decisions | `.claude/skills/h4k-scheduler.md` |

# H4K Scheduler — Claude Project Context

WhatsApp content scheduling web app for **חמ"ל לילדים** (Hamal4Kids), a non-profit.
Coordinators review incoming WA posts, schedule them to groups, and n8n dispatches automatically.

## Stack

| Layer | Tech |
|---|---|
| Frontend | Vite + React 18 + Tailwind CSS |
| Deploy | GitHub Pages → `https://hamal4kids.github.io/h4k-scheduler2.0/` |
| Database | Google Sheets (published CSV) |
| Automation | n8n (self-hosted) |
| Media | Cloudinary |
| WhatsApp | Beacon API via n8n |

## Key IDs & Credentials (n8n)

- **Google Sheets credential:** `RwpCsVxFxaEUhZTz` ("H4K")
- **Beacon credential:** `yIr6Y57FPeQY3uDj` ("Beacon account 3")
- **Spreadsheet ID:** `12WESjeS-G5yitJIPehxnjs3dvjBdHmb0R-vtvSu0W-8`
- **Cloudinary:** cloud `dpu4rviqw`, unsigned preset `h4k_upload`, folder `h4k`
- **Source Beacon group (ingest):** `120363173450344370@g.us`
- **n8n webhook env var:** `VITE_N8N_WEBHOOK`
- **App PIN env var:** `VITE_PIN` (default: `H4K2026`)

## Google Sheet Structure

**posts tab (gid=0):** `id, content, media_url, cloudinary_id, scheduled_at, status, target_groups, sent_at`
- `status` values: `inbox` | `scheduled` | `sent` | `archived`
- `target_groups`: comma-separated group IDs, or `ALL`

**groups tab (gid=1):** `id, name, beacon_chat_id, type, active`
- `type` values: `general` (receives all posts) | `specialized` (manual selection only)
- `active` values: `TRUE` | `FALSE`

**sent_log tab (gid=2):** audit trail — append-only

## Project Structure

```
h4k-scheduler/
├── src/
│   ├── App.jsx                  # Root — PinGate, tab routing, useSheets
│   ├── config.js                # Sheet URLs, VITE_N8N_URL, VITE_APP_PIN
│   ├── index.css                # Tailwind + custom tokens + utility classes
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── TabNav.jsx
│   │   ├── PinGate.jsx
│   │   ├── PostCard.jsx
│   │   ├── ScheduleModal.jsx    # Sends update webhook to n8n (30-min min delay)
│   │   ├── InboxTab.jsx         # Optimistic delete UI
│   │   ├── ScheduledTab.jsx
│   │   ├── SentTab.jsx
│   │   └── GroupsTab.jsx        # Add/toggle groups via webhook
│   ├── hooks/
│   │   └── useSheets.js         # Fetches posts + groups + sent_log from CSV
│   └── utils/
│       └── csv.js               # Multiline-safe CSV parser
└── n8n-workflows/
    ├── 1-ingest.json            # Beacon trigger → Cloudinary → append to sheet ✅
    ├── 4-register.json          # Webhook from UI → update/append sheet ✅
    ├── 5-dispatch.json          # Cron every 30min → send due posts → mark sent ✅
    └── 6-cleanup.json           # Weekly Cloudinary cleanup ⬜ (needs API secret)
```

## The 6-Step Pipeline

1. Post arrives in Beacon source group → **1-ingest** grabs it, uploads media to Cloudinary, appends row `status: inbox`
2. Coordinator sees it in **Inbox tab**
3. Coordinator clicks "תזמן" → **ScheduleModal** → **4-register** writes `status: scheduled`, `scheduled_at`, `target_groups`
4. **5-dispatch** (every 30 min) finds due rows, sends via Beacon (text or image+caption), updates `status: sent`
5. Post appears in **Sent tab**
6. **6-cleanup** (weekly) deletes Cloudinary assets for sent posts older than 7 days

## Brand

- Primary: `#A1499A` | Secondary: `#25D366` | BG: `#D3E9E9` | Footer: `#262626`
- Fonts: Rubik (Hebrew body), Fredoka One (Latin title only)
- RTL throughout (`dir="rtl"`)
- Tailwind token names: `h4k-primary`, `h4k-secondary`, `h4k-bg`, `h4k-footer`, `h4k-dark`, `h4k-highlight`
- CSS utility classes: `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.h4k-card`, `.tab-active`, `.tab-inactive`, `.badge`

## Dev Commands

```bash
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # preview build locally
```

Deploy is manual: push `dist/` to the `gh-pages` branch.

## Current Status

| Item | Status |
|---|---|
| UI — all 4 tabs | ✅ Done |
| 1-ingest.json | ✅ Done |
| 4-register.json | ✅ Rebuilt with Switch node — needs end-to-end test |
| 5-dispatch.json | ✅ Built — needs end-to-end test |
| 6-cleanup.json | ⬜ Needs Cloudinary API secret |
| Groups sheet populated | ⬜ Need real Beacon chat IDs |

## Known Issues / Watch-Outs

- **5-dispatch media branch:** "Send Image via Beacon" uses `operation: sendImage`. Verify this is the correct operation name in your n8n Beacon node version.
- **VITE_N8N_WEBHOOK** must be set in `.env.local` for local dev and as a GitHub Actions secret / Pages env var for production.
- Google Sheets CSV has ~1 min publish lag — UI uses cache-busting (`?t=Date.now()`) but data won't be instant.
- `useSheets.js` fetches all three tabs (posts, groups, sent_log) on every refresh — fine at current scale.
- Default PIN (`H4K2026`) is visible in source code — ensure `VITE_APP_PIN` is set in production environment.
