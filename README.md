# SkillTracker — Skill Sheet & 1:1 Feedback Manager

A web application for managers to track their team's skills and 1-on-1 meeting feedback. Features a skill matrix with historical ratings, meeting logs with action items, and progress charts.

---

## Features

- **Employee Profiles** — Create and manage team members with name, role, team, start date, and a color-coded avatar
- **Skill Matrix** — Rate employees across 16 built-in skills in 4 categories (Technical, Communication, Leadership, Delivery); add custom categories and skills
- **Rating History** — Every rating creates a new record (never overwritten), enabling full historical tracking
- **1:1 Meeting Log** — Log meetings with notes, qualitative feedback, and action items per session
- **Action Items** — Track action items per meeting with status cycling (Open → In Progress → Done → Cancelled)
- **Progress Charts** — Radar chart (current skill snapshot by category), line chart (skill ratings over time), bar chart (meeting frequency by month)
- **Skills Settings** — Add/delete custom skill categories and skills; built-in items are protected from deletion

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
| UI Primitives | Radix UI (Dialog, Select, Tooltip) |
| Icons | Lucide React |
| Forms | React Hook Form + Zod |
| Date utilities | date-fns |

---

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Redirects → /employees
│   ├── employees/
│   │   ├── page.tsx              # Employee list (Server Component)
│   │   └── [id]/
│   │       ├── layout.tsx        # Employee header + sub-nav (Skills | Meetings | Progress)
│   │       ├── skills/page.tsx   # Skill matrix for employee
│   │       ├── meetings/page.tsx # Meeting log for employee
│   │       └── progress/page.tsx # Charts page
│   ├── settings/page.tsx         # Manage skill categories and skills
│   └── api/
│       └── employees/[id]/
│           ├── ratings/route.ts          # GET rating history (for charts)
│           └── meetings-stats/route.ts   # GET meeting frequency by month
│
├── actions/                      # Next.js Server Actions (all DB writes)
│   ├── employees.ts              # createEmployee, updateEmployee, deleteEmployee
│   ├── skills.ts                 # createCategory, deleteCategory, createSkill, deleteSkill
│   ├── ratings.ts                # addRating (always inserts a new row)
│   └── meetings.ts               # createMeeting, updateMeeting, deleteMeeting,
│                                 #   createActionItem, updateActionItemStatus, deleteActionItem
│
├── components/
│   ├── ui/                       # Primitive components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Modal.tsx             # Radix Dialog wrapper
│   │   ├── Avatar.tsx            # Initials + color avatar
│   │   ├── Badge.tsx
│   │   └── RatingDots.tsx        # Interactive 1–5 dot rating selector
│   ├── layout/
│   │   └── Sidebar.tsx           # App sidebar navigation
│   ├── employees/
│   │   ├── EmployeeCard.tsx      # Card with stats and edit/delete
│   │   ├── EmployeeForm.tsx      # Create/edit modal form
│   │   ├── AddEmployeeButton.tsx
│   │   ├── EmployeeSubNav.tsx    # Skills | Meetings | Progress tabs
│   ├── skills/
│   │   ├── SkillCell.tsx         # Clickable cell that opens rating modal
│   │   ├── RatingModal.tsx       # Modal to set rating + notes
│   │   └── SettingsClient.tsx    # Category + skill manager (client)
│   ├── meetings/
│   │   ├── MeetingCard.tsx       # Expandable meeting card
│   │   ├── MeetingForm.tsx       # Create/edit meeting modal
│   │   ├── AddMeetingButton.tsx
│   │   └── ActionItemList.tsx    # Inline action items with optimistic status toggle
│   └── charts/
│       ├── SkillProgressChart.tsx    # Line chart: rating over time per skill
│       ├── SkillRadarChart.tsx       # Radar chart: avg rating per category
│       └── MeetingFrequencyChart.tsx # Bar chart: meetings per month
│
├── lib/
│   ├── prisma.ts                 # Singleton PrismaClient
│   ├── utils.ts                  # cn(), formatDate(), getInitials(), etc.
│   └── constants.ts              # RATING_LABELS, RATING_COLORS, AVATAR_COLORS, etc.
│
└── generated/
    └── prisma/                   # Prisma-generated client (do not edit)

prisma/
├── schema.prisma                 # Data model
├── seed.ts                       # Seeds 4 categories + 16 built-in skills
├── migrations/                   # SQL migration history
└── dev.db                        # SQLite database file
```

---

## Data Model

```prisma
Employee         — id, name, role, team, startDate, avatarColor
SkillCategory    — id, name, description, isBuiltIn
Skill            — id, name, description, categoryId, isBuiltIn
SkillRating      — id, employeeId, skillId, rating (1–5), notes, ratedAt
Meeting          — id, employeeId, meetingDate, notes, feedback
ActionItem       — id, meetingId, description, status, dueDate
```

**Key design decisions:**
- `SkillRating` is append-only — each rating change inserts a new row. Latest rating = most recent `ratedAt`. This enables the skill progress chart without a separate audit table.
- `isBuiltIn = true` on categories/skills protects seed data from deletion via the UI.
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
# Install dependencies
npm install

# Set up the database (creates prisma/dev.db and seeds built-in skills)
npx prisma migrate dev --name init

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

The `.env` file must contain an absolute path to the SQLite database:

```env
DATABASE_URL="file:/absolute/path/to/prisma/dev.db"
```

> **Note:** A relative path like `file:./prisma/dev.db` can fail at runtime because Next.js resolves it from an internal working directory, not the project root. Use an absolute path.

---

## Running with Docker (Windows / Mac / Linux)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Quick Start

```bash
# Build and start the container
docker compose up --build

# Open http://localhost:3000 in your browser
```

That's it. The database is created, migrated, and seeded automatically on first run.

### Subsequent Starts

```bash
# Start (no rebuild needed unless code changed)
docker compose up

# Stop
docker compose down

# Stop and delete the database volume (resets all data)
docker compose down -v
```

### Rebuilding After Code Changes

```bash
docker compose up --build
```

### Data Persistence

The SQLite database is stored in a Docker **named volume** (`skillfeedback-data`). Your data survives container restarts and `docker compose down`. It is only deleted with `docker compose down -v`.

### Backing Up the Database

```bash
# Copy the database out of the volume to your local machine
docker run --rm \
  -v skillfeedback-data:/data \
  -v $(pwd):/backup \
  alpine cp /data/dev.db /backup/backup.db
```

On **Windows PowerShell**, replace `$(pwd)` with `${PWD}`.

### Running on a Different Port

Edit `docker-compose.yml` and change the port mapping:

```yaml
ports:
  - "8080:3000"   # App will be at http://localhost:8080
```

---

## Common Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Open Prisma Studio (visual DB browser)
npx prisma studio

# Re-seed the database (idempotent — safe to run multiple times)
npx prisma db seed

# Apply schema changes
npx prisma migrate dev --name <migration-name>

# Regenerate Prisma client after schema changes
npx prisma generate
```

---

## Architecture Notes

### Server vs Client Components
- **Server Components** (data fetching): all `page.tsx` files, outer layout shells
- **Client Components** (`"use client"`): all forms, modals, chart wrappers, interactive cells, sidebar
- Mutations go through **Server Actions** (`src/actions/`) which call `revalidatePath()` to refresh server data

### Charts
All Recharts components are loaded with `dynamic(() => import(...), { ssr: false })` to prevent SSR hydration mismatches, since Recharts requires the browser DOM.

### Prisma Client
The singleton pattern in `src/lib/prisma.ts` prevents connection pool exhaustion during Next.js dev hot-reloads:

```ts
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### Prisma 6 Notes
- Client generates to `src/generated/prisma/client` (not the default `@prisma/client`)
- Import: `import { PrismaClient } from "@/generated/prisma/client"`
- Config is in `prisma.config.ts` (not just `schema.prisma`)
- Seed uses `tsx` (not `ts-node`) due to ESM compatibility with the generated client
