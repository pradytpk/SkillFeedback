# SkillTracker — User Manual

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Dashboard](#dashboard)
4. [Team Members](#team-members)
5. [Skill Matrix](#skill-matrix)
6. [Self-Assessment](#self-assessment)
7. [1:1 Meetings](#11-meetings)
8. [Annual Notes](#annual-notes)
9. [Action Items](#action-items)
10. [Commitments](#commitments)
11. [Goals](#goals)
12. [Appraisal](#appraisal)
13. [9-Box Talent Matrix](#9-box-talent-matrix)
14. [Progress Charts](#progress-charts)
15. [Settings](#settings)
16. [PDF Reports](#pdf-reports)
17. [Tips & Best Practices](#tips--best-practices)
18. [Troubleshooting](#troubleshooting)

---

## Overview

SkillTracker is a full appraisal management platform for managers — track team skills, run self-assessments, log 1:1 meetings with mood tracking, set goals with progress, record year-end appraisals, and produce professional PDF packs.

**What you can do:**
- See each person's skill levels and how they compare to role targets
- Enable employees to submit their own self-ratings alongside manager ratings
- Track skill growth over time with history charts
- Log 1:1 meetings with mood scoring, quality tags, and verbal commitments
- Set and track goals by fiscal year and quarter, with progress percentage
- Record formal year-end appraisals (S/A/B/C/D rating, 9-box placement, dev plan)
- View the team on a 9-Box Performance × Potential matrix
- Export professional PDF reports — Skill Report or full Appraisal Pack

---

## Getting Started

### Docker (recommended for Windows)
```bash
docker compose up --build
```
Open **http://localhost:3000**. The database sets up automatically.

### Local / Dev
```bash
npm run dev
```
Open **http://localhost:3000**.

---

## Dashboard

The **Dashboard** is the first page after launch. It shows a cross-team view at a glance.

### Team Skill Snapshot
A radar chart showing the average rating per skill category across all team members.

### Overdue Check-ins
Lists members who have not had a 1:1 in the last 30 days (or never). Each entry links to their Meetings tab.

### Team Weak Spots
The 5 lowest-rated skills across the team — useful for identifying training needs or hiring gaps.

> The dashboard is read-only — it updates automatically as you log ratings and meetings.

---

## Team Members

### The List

The **Team Members** page shows all team members:
- Name, role, start date, team badge
- Skill ratings count
- Last 1:1 date (relative, e.g. "3 days ago")

### Searching

Type in the search box to filter by **name** or **team** in real time.

### 9-Box Overview

Click **9-Box Overview** (top right) to see the team-wide talent matrix. See the [9-Box Talent Matrix](#9-box-talent-matrix) section.

### Adding a Member

Click **Add Member** (top right):
1. Fill in Name, Role, Team (dropdown from Settings → Teams), Start Date, Avatar Color
2. Click **Add Member**

> If the Team dropdown is empty, go to **Settings → Teams** and add teams first.

### Bulk Import via CSV

Click **Import CSV** to import multiple members at once:
1. **Upload** — select or drag-and-drop a `.csv` file with header: `name,role,team,startDate`
   - Example row: `Jane Smith,Senior Engineer,Platform,2023-04-01`
2. **Preview** — rows with missing fields are highlighted in red; valid rows in green
3. **Import** — creates valid rows; shows count of imported vs skipped

### Editing / Deleting

Hover over a row → **pencil** to edit, **trash** to delete.

> Deleting a member permanently removes all their ratings, meetings, goals, and action items.

### Back Navigation

Inside any employee's page, click **← Team Members** at the top to return to the list.

---

## Skill Matrix

Navigate to a member → **Skills** tab.

### Reading the Matrix

Skills are grouped by assigned category. Each skill shows:
- **Colored dots** — current manager rating (1–5)
- **Outlined dots** — employee's self-rating (shown only when self-assessment is enabled)
- **Notes** from the last rating (small text below the dots)
- **Benchmark indicator** — green ✓ if rating meets role target; red `-N` if below

| Rating | Label | Color |
|---|---|---|
| 1 | Beginner | Red |
| 2 | Developing | Orange |
| 3 | Proficient | Yellow |
| 4 | Advanced | Blue |
| 5 | Expert | Green |

### Rating a Skill

1. Click any skill cell
2. Select a **Manager Rating** 1–5 using the filled dots
3. If self-assessment is on, optionally enter the **Self Assessment** rating using the outlined dots
4. Optionally add **notes** — or click a **Quick fill** chip
5. Click **Save Rating**

Every save creates a **new history record** — previous ratings are kept for the Progress chart.

### Quick Fill Note Templates

Below the notes field, click any chip to pre-fill a common note. Templates are configured in `src/lib/constants.ts` → `RATING_NOTE_TEMPLATES`.

### Assigning Skill Categories

Click **Manage Categories** to choose which skill categories apply to this employee.

---

## Self-Assessment

Self-assessment lets employees record their own skill ratings alongside the manager's ratings.

### Enabling Self-Assessment

On any employee's page, click the **Self-Assessment Off / On** button in the top right header. It toggles per employee.

When **on**:
- The skill rating modal shows a second section — **Self Assessment** — with outlined (hollow) dots
- The skill matrix displays two dot rows per skill: solid (manager) and outlined (self) with a small "self" label
- The self-rating is stored alongside the manager rating in the same rating history record

When **off**, only manager ratings are shown and no self-rating field appears in the modal.

---

## 1:1 Meetings

Navigate to a member → **Meetings** tab.

### Fiscal Year View

Meetings are grouped by **fiscal year (April–March)**:
- **FY 2024-25** = April 2024 – March 2025

The current fiscal year opens by default. New year sections appear automatically when you log a meeting in a new FY.

### Logging a Meeting

Click **Log Meeting**:
1. **Meeting Date** — defaults to today
2. **Meeting Mood** — click an emoji button (😞😕😐🙂😄) to record how the meeting felt (optional)
3. **Meeting Quality** — select Great / Normal / Difficult (optional)
4. **Open items from last meeting** — if the previous meeting has open action items, they appear as a reminder panel (carry-forward)
5. **Use Template** — populates the Notes field from a saved template
6. **Notes** and **Feedback**
7. Click **Log Meeting**

### Meeting Card

Each card shows:
- Meeting date and relative time
- Mood emoji (if set) and quality badge
- Feedback section (orange highlight)
- Expand (▾) to see full notes, action items, and commitments

### Editing / Deleting

Hover over a meeting card → **pencil** to edit, **trash** to delete.

> Deleting a meeting also removes all its action items and commitments.

---

## Annual Notes

Each fiscal year section has an **Annual Overall Notes** panel (orange background) for your year-end summary.

- Click the notes area to open an edit box
- Type your overall assessment for the year
- Click **Save Notes**

Annual notes are included in the **PDF export** (individual meeting notes are not).

---

## Action Items

Action items are follow-up tasks captured inside a meeting.

### Adding

1. Expand a meeting card (click ▾)
2. Click **+ Add** in the Action Items row
3. Type description → **Enter** or **Add**

### Status Cycle

Click the status badge to cycle:
```
OPEN  →  IN PROGRESS  →  DONE  →  (back to OPEN)
```

The amber badge on the meeting card header shows the count of Open + In Progress items.

### Carry-Forward

When logging a **new** meeting, any **open** action items from the most recent previous meeting appear in an amber reminder panel. This helps ensure nothing is forgotten between meetings.

---

## Commitments

Commitments are verbal agreements or intentions made during a meeting — separate from tracked action items.

### Adding

1. Expand a meeting card (click ▾)
2. In the **Commitments** section, click **+ Add commitment**
3. Type description → **Add** or **Enter**

### Status Cycle

Click the circle icon next to a commitment to cycle:
```
○ OPEN  →  ✓ DONE  →  ✗ DROPPED  →  (back to OPEN)
```

### Deleting

Hover over a commitment → **trash icon** (appears on hover).

---

## Goals

Navigate to a member → **Goals** tab.

### Adding a Goal

Click **Add Goal**:
- **Title** (required)
- **Description** — what success looks like
- **Category** — free text (e.g. "Technical", "Leadership")
- **Target Date** (optional)
- **Fiscal Year** — pre-selected to the current FY
- **Quarter** — Q1 (Apr–Jun), Q2 (Jul–Sep), Q3 (Oct–Dec), Q4 (Jan–Mar), or Any
- **Weight** — 1 Normal, 2 Important, 3 Critical
- **Linked Skill** — tie the goal to a skill from the employee's assigned categories (optional)

### Viewing Goals

Goals are grouped by status: **Active**, **Paused**, **Completed**, **Cancelled**.

Each card shows:
- FY badge, quarter badge (if set), weight badge (Important/Critical)
- Linked skill name (if set)
- **Progress bar** (0–100%)
- Target date (red if overdue and still Active)

### Updating Progress

Click the **trending up icon** (↗) on a goal card:
1. Enter a new percentage (0–100)
2. Add a note about what changed
3. Click **Update**

Progress updates are logged with a timestamp. Click **Show history** to see all previous updates.

### Updating Status

Click the **status badge** on a goal card to toggle:
- Active → Completed → Active
- Paused or Cancelled → Active (click to reactivate)

### Editing / Deleting

Hover over a goal card → **pencil** or **trash** icon.

---

## Appraisal

Navigate to a member → **Appraisal** tab.

The Appraisal tab stores the formal year-end review record for each fiscal year.

### Filling in the Appraisal

The current fiscal year form is always shown at the top:

1. **Overall Rating** — click a letter button: S (Exceptional), A (Exceeds), B (Meets), C (Developing), D (Below)
2. **Performance** — High / Medium / Low (used for 9-box X-axis)
3. **Potential** — High / Medium / Low (used for 9-box Y-axis)
4. **Achievements** — key accomplishments this FY
5. **Strengths** — core strengths demonstrated
6. **Development Areas** — areas to improve
7. **Development Plan (Next Year)** — planned actions, training, targets
8. **Peer Feedback Notes** — summary of 360/peer feedback
9. Click **Save Appraisal**

The record is saved per employee per fiscal year (upserted — saving again updates the same record).

### Past Appraisals

Appraisal records from previous fiscal years appear below the current FY form, also fully editable.

### Rating Scale

| Rating | Meaning |
|---|---|
| S | Exceptional — significantly exceeded all expectations |
| A | Exceeds — consistently above expectations |
| B | Meets — fully meets expectations |
| C | Developing — partially meets expectations |
| D | Below — not meeting expectations |

---

## 9-Box Talent Matrix

Click **9-Box Overview** on the Team Members page.

### Reading the Matrix

The matrix is a 3×3 grid:
- **X-axis (columns):** Performance — Low, Medium, High (set via Appraisal → Performance)
- **Y-axis (rows):** Potential — Low, Medium, High (set via Appraisal → Potential)

Each cell shows colored employee avatar circles. Click any avatar to go directly to that employee's Appraisal page.

**Cell labels:**

| | Low Perf | Medium Perf | High Perf |
|---|---|---|---|
| **High Pot** | Rough Diamond | High Potential | Star |
| **Med Pot** | Inconsistent | Core Player | High Performer |
| **Low Pot** | Under Performer | Solid Performer | Consistent Star |

### Unplaced Employees

Employees who don't yet have Performance and Potential set appear in an **"Not Yet Placed"** panel below the matrix, with links to their Appraisal page.

### Setting Placement

Go to any employee → **Appraisal** tab → set **Performance** and **Potential** → **Save Appraisal**. The employee will appear in the matrix on the next page load.

---

## Progress Charts

Navigate to a member → **Progress** tab.

### Skill Snapshot (Radar Chart)
Current average rating per category. A larger, fuller shape = stronger overall profile.

### Meeting Frequency (Bar Chart)
Meetings per month. Useful for spotting gaps in 1:1 cadence.

### Skill Ratings Over Time (Line Chart)
One line per skill plotted by rating date. Shows improvement or decline over time.

### Meeting Mood Trend (Line Chart)
Plotted only when at least one meeting has a mood score recorded. Shows 1–5 mood over time with emoji labels.

> Charts require at least one data point to render.

---

## Settings

Click **Settings** in the left sidebar. Four tabs:

### Skill Categories
Manage categories and skills used in every employee's matrix.

- **Add category** — click **+** → type name → Enter
- **Add skill** — select category → **+ Add Skill** → type name → Enter
- **Delete** — hover → **trash icon** (built-in items show 🔒 and cannot be deleted)

> Deleting a category also deletes all its skills and any employee ratings for those skills.

### Teams
Manage teams available in the Add/Edit Member dropdown.

- **Add team** — click **+** → type name → Enter
- **Delete team** — hover → **trash icon**

### Meeting Templates
Save reusable notes templates for 1:1 meetings.

- **Add template** — click **+** → enter title and notes body → **Add Template**
- **Delete** — hover → **trash icon**

Templates appear in the "Use Template" dropdown when logging a meeting.

### Role Benchmarks
Set target skill ratings per role to show growth gaps on the Skills page.

1. Select a **Role** from the dropdown
2. For each skill, click a numbered dot (1–5) to set the target
3. Click **×** next to a skill to remove its benchmark

On the Skills page, each skill then shows:
- **Green ✓** — current rating meets or exceeds the target
- **Red -N** — current rating is N below the target (e.g. `-2`)

---

## PDF Reports

Two report types are available, both downloaded from the employee header.

### Skill Report

Click **Skill Report** on any employee's page.

- **Page 1** — Skill overview bar chart per category + full skill matrix with inline rating bars
- **Page 2** — Annual review notes per fiscal year (individual meeting notes not included)

### Appraisal Report

Click **Appraisal Report** on any employee's page.

- **Page 1** — Skill overview chart + full skill matrix
- **Page 2** — All goals grouped by fiscal year, with status and progress bars
- **Page 3** — Appraisal records (rating, 9-box placement, achievements, strengths, dev areas, dev plan, peer feedback)
- **Page 4** — Annual review notes per fiscal year

> The appraisal report is most useful after completing the Appraisal tab for the employee.

---

## Tips & Best Practices

**Rate skills regularly, not just at review time**
The Progress chart is most useful with multiple data points. Rate after significant projects or at end of each quarter.

**Use notes when rating**
"Led the DB migration independently" gives you concrete evidence when writing appraisals.

**Enable self-assessment before review season**
Ask employees to self-rate before your appraisal conversations. Compare the solid (manager) and outlined (self) dots to identify perception gaps.

**Log mood scores consistently**
Even a quick emoji click per meeting creates a useful mood trend over months — surface patterns early.

**Use carry-forward open items as your meeting opener**
The open action item reminder panel at the top of the new meeting form is your check-in on last time's commitments.

**Write annual notes before the year closes**
The Annual Notes section feeds directly into both PDF reports.

**Fill in the Appraisal tab before the 9-Box session**
Set Performance and Potential for every team member before the team overview meeting — the matrix is your agenda.

**Set role benchmarks early**
Benchmarks make the Skills page immediately useful — the gap indicators show exactly where each person needs to grow.

**Track goals with realistic progress updates**
Log a progress note each time you check in on a goal — the history log gives you a narrative for the appraisal.

**Use commitments for verbal agreements**
If something is agreed in the 1:1 but too informal for an action item, log it as a commitment — it stays visible in the meeting record.

---

## Troubleshooting

**Team dropdown is empty when adding a member**
Go to Settings → Teams and add your teams first.

**No benchmark indicators on Skills page**
Go to Settings → Role Benchmarks, select the employee's role, and set target ratings.

**Self-assessment dots not showing on Skills page**
Self-assessment must be enabled per employee. Click the **Self-Assessment Off** button in the employee header to turn it on.

**New fiscal year section not appearing**
Sections appear automatically when you log a meeting with a date in that FY. Log a meeting with the correct date.

**Employee not appearing in 9-Box matrix**
Set both **Performance** and **Potential** on the employee's Appraisal tab. Employees with only one or neither set appear in the "Not Yet Placed" panel.

**Charts are blank**
Charts need data to render. Ensure ratings exist (radar/progress charts), meetings exist (frequency chart), or mood scores are set (mood trend chart).

**App shows a database error on startup**
Check that `DATABASE_URL` in `.env` uses an absolute path:
```
DATABASE_URL="file:/absolute/path/to/prisma/dev.db"
```

**I accidentally deleted data**
There is no undo. Back up `prisma/dev.db` regularly if data loss is a concern.

**App won't start**
Run `npm install` then `npm run dev`.
