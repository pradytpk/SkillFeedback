# SkillTracker — Skill Sheet & 1:1 Feedback Manager

A web application for managers to track their team's skills, set role benchmarks, log 1:1 meetings, track goals, and generate PDF reports.

---

## Features

- **Team Dashboard** — Team-wide radar chart, bottom-rated skills (weak spots), and overdue check-in alerts
- **Team Members List** — Searchable list view; bulk import via CSV
- **Skill Matrix** — Rate skills 1–5 per employee; quick-fill note templates; role benchmark delta (✓ met / -N gap)
- **Rating History** — Every rating inserts a new row — full history for progress charts
- **1:1 Meetings** — Grouped by fiscal year (April–March); meeting note templates; annual overall notes per year
- **Goal Tracking** — Per-employee goals with category, target date, and status cycling (Active → Completed)
- **Action Items** — Tracked per meeting with optimistic status toggle
- **Progress Charts** — Radar (skill snapshot), line chart (ratings over time), bar chart (meeting frequency)
- **PDF Export** — Year-wise; includes skill overview chart, skill matrix, and annual notes (no individual meeting details)
- **Settings** — Manage skill categories, skills, teams, meeting templates, and role benchmarks

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| ORM | Prisma 6 |
| Database | SQLite (file-based) |
| Charts | Recharts 3 |
| PDF | @react-pdf/renderer |
| Icons | Lucide React |
| Forms | React Hook Form + Zod |
| Date utilities | date-fns |

---

## Project Structure

```
src/
├── app/
│   ├── dashboard/page.tsx                  # Team Dashboard
│   ├── employees/
│   │   ├── page.tsx                        # Team Members list
│   │   └── [id]/
│   │       ├── layout.tsx                  # Header + back button + sub-nav
│   │       ├── skills/page.tsx             # Skill matrix with benchmark delta
│   │       ├── meetings/page.tsx           # Meetings by fiscal year + templates
│   │       ├── progress/page.tsx           # Charts
│   │       └── goals/page.tsx              # Goal tracking
│   ├── settings/page.tsx                   # All settings tabs
│   └── api/employees/[id]/
│       ├── ratings/route.ts
│       ├── meetings-stats/route.ts
│       └── report/route.ts                 # PDF generation
│
├── actions/
│   ├── employees.ts          # CRUD + bulkCreateEmployees
│   ├── skills.ts             # Categories, skills, teams
│   ├── ratings.ts            # Append-only rating insert
│   ├── meetings.ts           # Meetings, action items, meeting templates
│   ├── yearNotes.ts          # Annual notes upsert
│   ├── goals.ts              # Goal CRUD + status cycle
│   └── benchmarks.ts         # Role benchmark upsert/delete
│
├── components/
│   ├── ui/                   # Button, Input, Textarea, Modal, Avatar, Badge, RatingDots
│   ├── layout/Sidebar.tsx
│   ├── employees/
│   │   ├── EmployeeListClient.tsx      # Search + list
│   │   ├── EmployeeForm.tsx            # Create/edit (team from DB)
│   │   ├── AddEmployeeButton.tsx
│   │   ├── BulkImportButton.tsx
│   │   ├── BulkImportModal.tsx         # 3-step CSV wizard
│   │   └── EmployeeSubNav.tsx          # Skills|Meetings|Progress|Goals tabs
│   ├── skills/
│   │   ├── SkillCell.tsx               # Shows rating dots + benchmark delta
│   │   ├── RatingModal.tsx             # Rating + quick-fill note templates
│   │   ├── ManageCategoriesButton.tsx
│   │   └── SettingsClient.tsx          # 4 tabs: Categories|Teams|Templates|Benchmarks
│   ├── meetings/
│   │   ├── YearSection.tsx             # Collapsible FY section + annual notes
│   │   ├── MeetingCard.tsx
│   │   ├── MeetingForm.tsx             # Uses meeting templates
│   │   ├── AddMeetingButton.tsx
│   │   └── ActionItemList.tsx
│   ├── goals/
│   │   ├── GoalCard.tsx                # Status cycle, overdue indicator
│   │   ├── GoalForm.tsx
│   │   └── AddGoalButton.tsx
│   ├── charts/
│   │   ├── SkillRadarChart.tsx
│   │   ├── SkillProgressChart.tsx
│   │   └── MeetingFrequencyChart.tsx
│   └── pdf/
│       └── EmployeeReportPDF.tsx       # SVG bar charts + annual notes
│
└── lib/
    ├── prisma.ts             # Singleton PrismaClient
    ├── utils.ts              # cn(), formatDate(), formatDateRelative()
    ├── constants.ts          # RATING_LABELS, RATING_COLORS, RATING_NOTE_TEMPLATES, etc.
    └── options.ts            # TEAMS fallback (unused — teams managed in DB)
```

---

## Data Model

```prisma
Employee         — id, name, role, team, startDate, avatarColor
Team             — id, name  (managed in Settings)
SkillCategory    — id, name, description, isBuiltIn
Skill            — id, name, description, categoryId, isBuiltIn
SkillRating      — id, employeeId, skillId, rating (1–5), notes, ratedAt
Meeting          — id, employeeId, meetingDate, notes, feedback
MeetingTemplate  — id, title, notesTemplate
ActionItem       — id, meetingId, description, status, dueDate
YearNote         — id, employeeId, yearLabel ("2024-25"), notes  @@unique([employeeId, yearLabel])
Goal             — id, employeeId, title, description, category, targetDate, status
RoleBenchmark    — id, role, skillId, targetRating  @@unique([role, skillId])
```

**Key design decisions:**
- `SkillRating` is append-only — each save inserts a new row; latest = most recent `ratedAt`
- `isBuiltIn = true` protects seed categories/skills from deletion
- `YearNote` uses April–March fiscal year label (e.g. `"2024-25"`)
- `RoleBenchmark` is per-role per-skill — shown as delta on the Skills page
- `Goal.status` cycles: `ACTIVE → COMPLETED → ACTIVE`; also supports `PAUSED`, `CANCELLED`

---

## Built-in Skills (Seed Data)

| Category | Skills |
|---|---|
| Technical | Code Quality, System Design, Testing, Documentation |
| Communication | Written Communication, Verbal Communication, Feedback Giving, Stakeholder Management |
| Leadership | Initiative, Mentoring, Decision Making, Conflict Resolution |
| Delivery | Estimation, Reliability, Prioritization, Execution Speed |

---

## Rating Scale

| Rating | Label | Color |
|---|---|---|
| 1 | Beginner | Red |
| 2 | Developing | Orange |
| 3 | Proficient | Yellow |
| 4 | Advanced | Blue |
| 5 | Expert | Green |

---

## Getting Started

### Local Dev

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables (`.env`)

```env
DATABASE_URL="file:/absolute/path/to/prisma/dev.db"
```

> Use an absolute path — relative paths fail at Next.js runtime.

---

## Running with Docker (Windows / Mac / Linux)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### First Run

```bash
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000). Database is created, migrated, and seeded automatically.

### Day-to-Day

```bash
docker compose up          # start
docker compose down        # stop (data preserved)
docker compose down -v     # stop + wipe all data
docker compose up --build  # rebuild after code changes
```

### Backup

```bash
docker run --rm \
  -v skillfeedback-data:/data \
  -v $(pwd):/backup \
  alpine cp /data/dev.db /backup/backup.db
```

On **Windows PowerShell**, replace `$(pwd)` with `${PWD}`.

### Different Port

Edit `docker-compose.yml`:
```yaml
ports:
  - "8080:3000"
```

---

## Common Commands

```bash
npm run dev                                 # Dev server
npm run build                               # Production build
npx prisma studio                           # Visual DB browser
npx prisma db seed                          # Re-seed (idempotent)
npx prisma migrate dev --name <name>        # Apply schema changes
npx prisma generate                         # Regenerate Prisma client
```

---

## Architecture Notes

### Server vs Client
- **Server Components** — all `page.tsx` files; fetch data, pass serialized props
- **Client Components** — forms, modals, charts, interactive cells, search, sidebar
- Mutations use **Server Actions** in `src/actions/` with `revalidatePath()`

### Fiscal Year Logic
`getFiscalYear(date)` in `meetings/page.tsx`:
- April 2024 – March 2025 → `"2024-25"`
- Year sections appear **automatically** when a meeting in that FY is logged

### PDF Report
Generated server-side via `@react-pdf/renderer` at `/api/employees/[id]/report`:
- **Page 1** — SVG horizontal bar chart per category + skill matrix with inline rating bars
- **Page 2** — Annual review notes per fiscal year (individual meetings excluded)

### Prisma 6
- Client generates to `src/generated/prisma/client`
- Import: `import { PrismaClient } from "@/generated/prisma/client"`
- Config in `prisma.config.ts`; seed uses `tsx` (not `ts-node`)
