# SkillTracker — Skill Sheet & 1:1 Feedback Manager

A web application for managers to track their team's skills and 1-on-1 meeting feedback. Features a skill matrix with historical ratings, meeting logs grouped by fiscal year, annual review notes, and progress charts.

---

## Features

- **Team Members List** — Searchable list view with name, role, team, skill rating count, and last 1:1 date
- **Skill Matrix** — Rate employees across built-in skills in 4 categories (Technical, Communication, Leadership, Delivery); add custom categories and skills; notes shown under each rating
- **Rating History** — Every rating creates a new record (never overwritten), enabling full historical tracking
- **1:1 Meeting Log** — Meetings grouped by fiscal year (April–March); expand/collapse each year
- **Annual Notes** — Add overall yearly comments per fiscal year; included in PDF export
- **Action Items** — Track follow-ups per meeting with status cycling (Open → In Progress → Done → Cancelled)
- **Progress Charts** — Radar chart (skill snapshot by category), line chart (ratings over time), bar chart (meeting frequency)
- **PDF Export** — Download a professional report with skill charts, skill matrix with bar indicators, and annual review notes (no individual meeting details)
- **Settings** — Manage skill categories/skills and teams independently; built-in skills are protected from deletion

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| ORM | Prisma 6 |
| Database | SQLite (file-based, no server needed) |
| Charts | Recharts 3 |
| PDF Generation | @react-pdf/renderer |
| Icons | Lucide React |
| Forms | React Hook Form + Zod |
| Date utilities | date-fns |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                        # Redirects → /employees
│   ├── employees/
│   │   ├── page.tsx                    # Team Members list (Server Component)
│   │   └── [id]/
│   │       ├── layout.tsx              # Employee header + back button + sub-nav
│   │       ├── skills/page.tsx         # Skill matrix
│   │       ├── meetings/page.tsx       # Meetings grouped by fiscal year
│   │       └── progress/page.tsx       # Progress charts
│   ├── settings/page.tsx               # Skill Categories + Teams settings
│   └── api/employees/[id]/
│       ├── ratings/route.ts            # GET rating history (for charts)
│       ├── meetings-stats/route.ts     # GET meeting frequency by month
│       └── report/route.ts             # GET PDF report
│
├── actions/
│   ├── employees.ts                    # createEmployee, updateEmployee, deleteEmployee
│   ├── skills.ts                       # createCategory, deleteCategory, createSkill,
│   │                                   #   deleteSkill, createTeam, deleteTeam
│   ├── ratings.ts                      # addRating (always inserts a new row)
│   ├── meetings.ts                     # createMeeting, updateMeeting, deleteMeeting,
│   │                                   #   createActionItem, updateActionItemStatus, deleteActionItem
│   └── yearNotes.ts                    # upsertYearNote
│
├── components/
│   ├── ui/                             # Button, Input, Textarea, Modal, Avatar, Badge, RatingDots
│   ├── layout/
│   │   └── Sidebar.tsx
│   ├── employees/
│   │   ├── EmployeeListClient.tsx      # Search + list rendering (client)
│   │   ├── EmployeeForm.tsx            # Create/edit modal (team dropdown from DB)
│   │   ├── AddEmployeeButton.tsx
│   │   └── EmployeeSubNav.tsx          # Skills | Meetings | Progress tabs
│   ├── skills/
│   │   ├── SkillCell.tsx               # Clickable cell showing rating dots + notes
│   │   ├── RatingModal.tsx             # Modal to set rating + notes
│   │   ├── ManageCategoriesButton.tsx  # Assign categories to an employee
│   │   └── SettingsClient.tsx          # Skill Categories + Teams tabs (client)
│   ├── meetings/
│   │   ├── YearSection.tsx             # Collapsible fiscal year section with annual notes
│   │   ├── MeetingCard.tsx             # Expandable meeting card
│   │   ├── MeetingForm.tsx             # Create/edit meeting modal
│   │   ├── AddMeetingButton.tsx
│   │   └── ActionItemList.tsx          # Inline action items with optimistic status toggle
│   ├── charts/
│   │   ├── SkillProgressChart.tsx      # Line chart: rating over time
│   │   ├── SkillRadarChart.tsx         # Radar chart: avg rating per category
│   │   └── MeetingFrequencyChart.tsx   # Bar chart: meetings per month
│   └── pdf/
│       └── EmployeeReportPDF.tsx       # PDF layout (react-pdf)
│
├── lib/
│   ├── prisma.ts                       # Singleton PrismaClient
│   ├── utils.ts                        # cn(), formatDate(), getInitials(), etc.
│   ├── constants.ts                    # RATING_LABELS, RATING_COLORS, AVATAR_COLORS
│   └── options.ts                      # TEAMS fallback list (not used — teams managed in DB)
│
└── generated/
    └── prisma/                         # Prisma-generated client (do not edit)

prisma/
├── schema.prisma
├── seed.ts                             # Seeds 4 categories + 16 built-in skills
├── migrations/
└── dev.db                              # SQLite database file
```

---

## Data Model

```prisma
Employee              — id, name, role, team, startDate, avatarColor
Team                  — id, name  (managed in Settings)
SkillCategory         — id, name, description, isBuiltIn
Skill                 — id, name, description, categoryId, isBuiltIn
SkillRating           — id, employeeId, skillId, rating (1–5), notes, ratedAt
Meeting               — id, employeeId, meetingDate, notes, feedback
ActionItem            — id, meetingId, description, status, dueDate
YearNote              — id, employeeId, yearLabel ("2024-25"), notes
```

**Key design decisions:**
- `SkillRating` is append-only — each save inserts a new row. Latest rating = most recent `ratedAt`. Enables full history without a separate audit table.
- `isBuiltIn = true` protects seed categories/skills from deletion.
- `Team` is a standalone DB model managed in Settings — not a static list.
- `YearNote` uses an April–March fiscal year label (e.g. `"2024-25"`) with a unique constraint on `(employeeId, yearLabel)`.
- `ActionItem.status` is a string (`OPEN` | `IN_PROGRESS` | `DONE` | `CANCELLED`) — SQLite has no native enum.

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

### Prerequisites
- Node.js 18+
- npm

### Setup

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

> Use an absolute path. Relative paths can fail at Next.js runtime.

---

## Running with Docker (Windows / Mac / Linux)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### First Run

```bash
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000). The database is created, migrated, and seeded automatically.

### Day-to-Day

```bash
docker compose up        # start
docker compose down      # stop (data is preserved)
docker compose down -v   # stop + delete all data
docker compose up --build  # rebuild after code changes
```

### Data Persistence

SQLite is stored in a Docker named volume (`skillfeedback-data`). Data survives restarts. Only `docker compose down -v` wipes it.

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
npm run dev                                        # Dev server
npm run build                                      # Production build
npx prisma studio                                  # Visual DB browser
npx prisma db seed                                 # Re-seed (idempotent)
npx prisma migrate dev --name <name>               # Apply schema changes
npx prisma generate                                # Regenerate Prisma client
```

---

## Architecture Notes

### Server vs Client Components
- **Server Components**: all `page.tsx` files — fetch data, pass to client components
- **Client Components** (`"use client"`): forms, modals, chart wrappers, interactive cells, search, sidebar
- Mutations use **Server Actions** (`src/actions/`) with `revalidatePath()` for cache invalidation

### Charts
All Recharts components use `dynamic(() => import(...), { ssr: false })` to avoid SSR hydration errors (Recharts requires browser DOM).

### Fiscal Year Logic
`getFiscalYear(date)` in `meetings/page.tsx` maps any date to an April–March fiscal year string:
- April 2024 → March 2025 = `"2024-25"`
- January 2025 → `"2024-25"` (still in same FY)
- April 2025 → `"2025-26"`

New year sections appear automatically when a meeting with a date in a new fiscal year is logged.

### PDF Report
Generated server-side using `@react-pdf/renderer` in the API route `/api/employees/[id]/report`.
- Page 1: Skill overview horizontal bar chart + skill matrix with SVG rating bars
- Page 2: Annual Review Notes per fiscal year (individual meeting notes excluded)

### Prisma 6 Notes
- Client generates to `src/generated/prisma/client` (not default `@prisma/client`)
- Import: `import { PrismaClient } from "@/generated/prisma/client"`
- Config in `prisma.config.ts`
- Seed uses `tsx` (not `ts-node`) for ESM compatibility
