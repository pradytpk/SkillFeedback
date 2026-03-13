# SkillTracker — Appraisal & 1:1 Management Platform

A web application for managers to track team skills, run self-assessments, log 1:1 meetings with mood tracking, manage goals with progress, record year-end appraisals, and generate full PDF reports.

---

## Features

- **Team Dashboard** — Team-wide radar chart, bottom-rated skills (weak spots), and overdue check-in alerts
- **Team Members List** — Searchable list view; bulk import via CSV; 9-Box Overview link
- **Skill Matrix** — Rate skills 1–5 per employee; quick-fill note templates; role benchmark delta (✓ met / -N gap)
- **Self-Assessment** — Per-employee opt-in; manager and employee ratings shown side-by-side (solid vs outlined dots)
- **Rating History** — Every rating inserts a new row — full history for progress charts
- **1:1 Meetings** — Grouped by fiscal year (April–March); mood emoji + quality flag per meeting; meeting note templates
- **Annual Notes** — Per fiscal year; feeds into PDF export
- **Action Items** — Tracked per meeting with status toggle; open items carry forward as reminders in new meetings
- **Commitments** — Verbal commitments per meeting; separate from action items; OPEN/DONE/DROPPED status
- **Goal Tracking** — FY/quarter grouping, progress % with history log, weight (Normal/Important/Critical), linked skill
- **Appraisal Records** — Per-employee per-FY: S/A/B/C/D rating, 9-box placement, achievements, strengths, dev plan
- **9-Box Talent Matrix** — Team-wide Performance × Potential grid; clickable employee avatars
- **Progress Charts** — Radar, skill history line chart, meeting frequency, and mood trend chart
- **PDF Export** — Skill Report (skill matrix + annual notes) OR full Appraisal Report (4 pages)
- **Settings** — Manage skill categories, teams, meeting templates, and role benchmarks

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
| Validation | Zod |
| Date utilities | date-fns |

---

## Project Structure

```
src/
├── app/
│   ├── dashboard/page.tsx                  # Team Dashboard
│   ├── employees/
│   │   ├── page.tsx                        # Team Members list + 9-Box link
│   │   ├── team-overview/page.tsx          # 9-Box Talent Matrix
│   │   └── [id]/
│   │       ├── layout.tsx                  # Header + self-assessment toggle + report buttons
│   │       ├── skills/page.tsx             # Skill matrix with benchmark delta + self-ratings
│   │       ├── meetings/page.tsx           # Meetings by FY + mood + carry-forward
│   │       ├── progress/page.tsx           # Charts incl. mood trend
│   │       ├── goals/page.tsx              # Goal tracking with progress
│   │       └── appraisal/page.tsx          # Year-end appraisal form
│   ├── settings/page.tsx                   # All settings tabs
│   └── api/employees/[id]/
│       ├── ratings/route.ts
│       ├── meetings-stats/route.ts
│       └── report/route.ts                 # PDF — ?mode=appraisal for full report
│
├── actions/
│   ├── employees.ts          # CRUD + bulkCreateEmployees + toggleSelfAssessment
│   ├── skills.ts             # Categories, skills, teams
│   ├── ratings.ts            # Append-only rating insert (supports selfRating)
│   ├── meetings.ts           # Meetings (mood, qualityFlag), action items, templates
│   ├── commitments.ts        # Commitment CRUD + status toggle
│   ├── yearNotes.ts          # Annual notes upsert
│   ├── goals.ts              # Goal CRUD + status cycle + updateGoalProgress
│   ├── appraisal.ts          # upsertAppraisalRecord
│   └── benchmarks.ts         # Role benchmark upsert/delete
│
├── components/
│   ├── ui/                   # Button, Input, Textarea, Modal, Avatar, Badge, RatingDots
│   ├── layout/Sidebar.tsx
│   ├── employees/
│   │   ├── EmployeeListClient.tsx
│   │   ├── EmployeeForm.tsx
│   │   ├── AddEmployeeButton.tsx
│   │   ├── BulkImportButton.tsx / BulkImportModal.tsx
│   │   ├── EmployeeSubNav.tsx          # Skills|Meetings|Progress|Goals|Appraisal tabs
│   │   └── SelfAssessmentToggle.tsx    # Toggle button in employee header
│   ├── skills/
│   │   ├── SkillCell.tsx               # Manager dots + self-rating outlined dots
│   │   ├── RatingModal.tsx             # Manager + optional self-assessment section
│   │   ├── SelfRatingDots.tsx          # Outlined/hollow dots for self-rating
│   │   ├── ManageCategoriesButton.tsx
│   │   └── SettingsClient.tsx
│   ├── meetings/
│   │   ├── YearSection.tsx             # Collapsible FY section + annual notes
│   │   ├── MeetingCard.tsx             # Mood emoji + quality badge + CommitmentList
│   │   ├── MeetingForm.tsx             # Mood selector + quality flag + carry-forward panel
│   │   ├── AddMeetingButton.tsx
│   │   ├── ActionItemList.tsx
│   │   └── CommitmentList.tsx          # Add/toggle/delete verbal commitments
│   ├── goals/
│   │   ├── GoalCard.tsx                # Progress bar + update log + FY/quarter/weight badges
│   │   ├── GoalForm.tsx                # FY, quarter, weight, linked skill fields
│   │   └── AddGoalButton.tsx
│   ├── appraisal/
│   │   ├── AppraisalForm.tsx           # S/A/B/C/D + perf/potential + 5 text sections
│   │   └── NineBoxMatrix.tsx           # 3×3 grid with clickable employee avatars
│   ├── charts/
│   │   ├── SkillRadarChart.tsx
│   │   ├── SkillProgressChart.tsx
│   │   ├── MeetingFrequencyChart.tsx
│   │   └── MoodTrendChart.tsx          # Meeting mood over time (line chart)
│   └── pdf/
│       ├── EmployeeReportPDF.tsx       # Skill matrix + annual notes
│       └── AppraisalReportPDF.tsx      # 4-page: skills, goals, appraisal, notes
│
└── lib/
    ├── prisma.ts             # Singleton PrismaClient
    ├── utils.ts              # cn(), formatDate(), formatDateRelative()
    ├── constants.ts          # RATING_LABELS, RATING_COLORS, RATING_NOTE_TEMPLATES, etc.
    └── options.ts
```

---

## Data Model

```prisma
Employee         — id, name, role, team, startDate, avatarColor, selfAssessmentEnabled
Team             — id, name  (managed in Settings)
SkillCategory    — id, name, description, isBuiltIn
Skill            — id, name, description, categoryId, isBuiltIn, targetRating, targetByDate
SkillRating      — id, employeeId, skillId, rating (1–5), selfRating, ratedBy, notes, ratedAt
Meeting          — id, employeeId, meetingDate, notes, feedback, moodScore (1–5), qualityFlag
MeetingTemplate  — id, title, notesTemplate
ActionItem       — id, meetingId, description, status, dueDate
Commitment       — id, employeeId, meetingId?, description, status (OPEN/DONE/DROPPED), dueDate
YearNote         — id, employeeId, yearLabel ("2024-25"), notes  @@unique([employeeId, yearLabel])
Goal             — id, employeeId, title, description, category, targetDate, status,
                   fiscalYear, quarter, progressPct, weight, linkedSkillId
GoalUpdate       — id, goalId, note, progressPct, updatedAt
RoleBenchmark    — id, role, skillId, targetRating  @@unique([role, skillId])
AppraisalRecord  — id, employeeId, fiscalYear, overallRating, talentBoxPerf, talentBoxPot,
                   achievements, strengths, developAreas, devPlanNextYear, peerFeedbackNotes
                   @@unique([employeeId, fiscalYear])
```

**Key design decisions:**
- `SkillRating` is append-only — each save inserts a new row; latest = most recent `ratedAt`
- `selfRating` is stored on the same `SkillRating` row as the manager rating
- `isBuiltIn = true` protects seed categories/skills from deletion
- `YearNote` uses April–March fiscal year label (e.g. `"2024-25"`)
- `RoleBenchmark` is per-role per-skill — shown as delta on the Skills page
- `Goal.status` cycles: `ACTIVE → COMPLETED → ACTIVE`; also supports `PAUSED`, `CANCELLED`
- `AppraisalRecord` is upserted — one record per employee per fiscal year

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
`getFiscalYear(date)`:
- April 2024 – March 2025 → `"2024-25"`
- Year sections appear **automatically** when a meeting in that FY is logged

### PDF Reports
Generated server-side via `@react-pdf/renderer` at `/api/employees/[id]/report`:

**Skill Report** (default):
- Page 1 — SVG bar chart per category + full skill matrix
- Page 2 — Annual review notes per fiscal year

**Appraisal Report** (`?mode=appraisal`):
- Page 1 — Skill overview chart + skill matrix
- Page 2 — Goals by fiscal year with progress bars
- Page 3 — Appraisal records (rating, talent box, achievements, dev plan)
- Page 4 — Annual review notes

### Self-Assessment
- Toggled per employee via `selfAssessmentEnabled` on the Employee model
- When on: RatingModal shows a second section for self-rating (outlined dots)
- Stored as `selfRating` on the `SkillRating` row alongside the manager rating
- SkillCell renders two dot rows when a self-rating exists

### Prisma 6
- Client generates to `src/generated/prisma/client`
- Import: `import { PrismaClient } from "@/generated/prisma/client"`
- Config in `prisma.config.ts`; seed uses `tsx` (not `ts-node`)
