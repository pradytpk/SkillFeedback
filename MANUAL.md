# SkillTracker — User Manual

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Dashboard](#dashboard)
4. [Team Members](#team-members)
5. [Skill Matrix](#skill-matrix)
6. [1:1 Meetings](#11-meetings)
7. [Annual Notes](#annual-notes)
8. [Action Items](#action-items)
9. [Goals](#goals)
10. [Progress Charts](#progress-charts)
11. [Settings](#settings)
12. [PDF Report](#pdf-report)
13. [Tips & Best Practices](#tips--best-practices)
14. [Troubleshooting](#troubleshooting)

---

## Overview

SkillTracker is a tool for managers to track team skills, set growth targets, log 1:1 meetings, track goals, and generate reports — all in one place.

**What you can do:**
- See each person's skill levels and how they compare to role targets
- Track skill growth over time with history charts
- Log 1:1 meetings organised by fiscal year with annual review notes
- Set and track goals per team member
- Export a professional PDF report for performance reviews

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
A radar chart showing the average rating per skill category across all team members. Shows the team's overall shape — which areas are strong and which are weaker.

### Overdue Check-ins
Lists members who have not had a 1:1 in the last 30 days (or never). Each entry shows the last meeting date and links to their Meetings tab.

### Team Weak Spots
A table of the 5 lowest-rated skills across the team — useful for identifying training needs or hiring gaps. Shows the team average, label, and how many members have been rated on that skill.

> The dashboard is read-only — it updates automatically as you log ratings and meetings.

---

## Team Members

### The List

The **Team Members** page shows all team members in a table:
- Name, role, start date
- Team badge
- Skill ratings count
- Last 1:1 date (relative, e.g. "3 days ago")

### Searching

Type in the search box to filter by **name** or **team** in real time.

### Adding a Member

Click **Add Member** (top right):
1. Fill in Name, Role, Team (dropdown from Settings → Teams), Start Date, Avatar Color
2. Click **Add Member**

> If the Team dropdown is empty, go to **Settings → Teams** and add teams first.

### Bulk Import via CSV

Click **Import CSV** to import multiple members at once:
1. **Upload** — select or drag-and-drop a `.csv` file with header: `name,role,team,startDate`
   - Example row: `Jane Smith,Senior Engineer,Platform,2023-04-01`
2. **Preview** — rows with missing fields are highlighted in red; valid rows shown in green
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
- **Colored dots** for the current rating (1–5)
- **Rating label** (e.g. "Proficient")
- **Notes** from the last rating (small text below the dots)
- **Benchmark indicator** — green ✓ if the rating meets the role target; red number (e.g. `-2`) if below target

| Rating | Label | Color |
|---|---|---|
| 1 | Beginner | Red |
| 2 | Developing | Orange |
| 3 | Proficient | Yellow |
| 4 | Advanced | Blue |
| 5 | Expert | Green |

### Rating a Skill

1. Click any skill cell
2. Select a rating 1–5 using the dots
3. Optionally add **notes** — or click a **Quick fill** chip to pre-populate a common note
4. Click **Save Rating**

Every save creates a **new history record** — previous ratings are kept for the Progress chart.

### Quick Fill Note Templates

Below the notes field, click any chip to pre-fill it:
- "Led this independently in a recent project"
- "Demonstrated consistently across the quarter"
- "Improving — needs occasional guidance"
- "Early stage — requires significant support"
- "Exceeded expectations — a clear strength"

These are editable in `src/lib/constants.ts` → `RATING_NOTE_TEMPLATES`.

### Assigning Skill Categories

Click **Manage Categories** to choose which skill categories apply to this employee. Each employee can have a different set.

---

## 1:1 Meetings

Navigate to a member → **Meetings** tab.

### Fiscal Year View

Meetings are grouped by **fiscal year (April–March)**:
- **FY 2024-25** = April 2024 – March 2025
- **FY 2025-26** = April 2025 – March 2026

The current fiscal year opens by default. **New year sections appear automatically** when you log a meeting with a date in a new FY period.

### Logging a Meeting

Click **Log Meeting** (top right of the Meetings tab):
1. Choose **Meeting Date** (defaults to today)
2. Optionally select **Use Template** — populates the Notes field from a saved template
3. Fill in **Notes** and **Feedback**
4. Click **Log Meeting**

### Viewing a Meeting

Click the **chevron ▾** to expand the card and see full notes and action items.

### Editing / Deleting

Hover over a meeting card → **pencil** to edit, **trash** to delete.

> Deleting a meeting also removes all its action items.

---

## Annual Notes

Each fiscal year section has an **Annual Overall Notes** panel (orange background) for your year-end summary.

- Click the notes area to open an edit box
- Type your overall assessment for the year
- Click **Save Notes**

This is the text that appears in the **PDF export** (individual meeting notes are not included in the export).

---

## Action Items

Action items are follow-up tasks captured inside a meeting.

### Adding

1. Expand a meeting card (click ▾)
2. Click **+ Add** in the Action Items row
3. Type description → **Enter** or **Add**

### Status

Click the status badge to cycle:
```
OPEN  →  IN PROGRESS  →  DONE  →  (back to OPEN)
```

| Status | Meaning |
|---|---|
| Open | Not started |
| In Progress | Being worked on |
| Done | Completed |
| Cancelled | No longer needed |

The amber badge on the meeting card header shows the count of Open + In Progress items.

### Deleting

Hover over an action item → **trash icon**.

---

## Goals

Navigate to a member → **Goals** tab.

### Adding a Goal

Click **Add Goal**:
- **Title** (required)
- **Description** — what success looks like
- **Category** — free text (e.g. "Technical", "Leadership")
- **Target Date** — due date (optional)

### Viewing Goals

Goals are grouped by status: **Active**, **Paused**, **Completed**, **Cancelled**.

- **Category** shown as an orange pill
- **Target date** shown in red if overdue and still Active

### Updating Status

Click the **status badge** on a goal card to toggle:
- Active → Completed → Active
- Paused or Cancelled → Active (click to reactivate)

### Editing / Deleting

Hover over a goal card → **pencil** or **trash** icon.

---

## Progress Charts

Navigate to a member → **Progress** tab.

### Skill Snapshot (Radar Chart)
Current average rating per category. A larger, fuller shape = stronger overall profile.

### Skill Ratings Over Time (Line Chart)
One line per skill plotted by rating date. Hover a point for exact values. Shows improvement or decline over time.

### Meeting Frequency (Bar Chart)
Meetings per month. Useful for spotting gaps in 1:1 cadence.

> Charts require at least one data point to render.

---

## Settings

Click **Settings** in the left sidebar. Four tabs:

### Skill Categories
Manage categories and skills used in every employee's matrix.

- **Add category** — click **+** → type name → Enter
- **Add skill** — select category → **+ Add Skill** → type name → Enter
- **Delete** — hover → **trash icon** (built-in items show a 🔒 and cannot be deleted)

> Deleting a category also deletes all its skills and any employee ratings for those skills.

### Teams
Manage teams available in the Add/Edit Member dropdown.

- **Add team** — click **+** → type name → Enter
- **Delete team** — hover → **trash icon**

> Deleting a team removes it from the dropdown but does not change existing employees' team names.

### Meeting Templates
Save reusable notes templates for 1:1 meetings.

- **Add template** — click **+** → enter title and notes body → **Add Template**
- **Delete** — hover → **trash icon**

Templates appear in the "Use Template" dropdown when logging a meeting.

### Role Benchmarks
Set target skill ratings per role to show growth gaps on the Skills page.

1. Select a **Role** from the dropdown (populated from existing employees)
2. For each skill, click a numbered dot (1–5) to set the target
3. Click **×** next to a skill to remove its benchmark

On the Skills page, each skill then shows:
- **Green ✓** — current rating meets or exceeds the target
- **Red -N** — current rating is N below the target (e.g. `-2`)

---

## PDF Report

Click **Download Report** on any employee's page (top right, within the employee layout).

**Page 1 — Skill Report**
- Employee name, role, team, start date
- **Skill Overview by Category** — horizontal bar chart per category with color legend
- **Skill Matrix** — every skill with a colored rating bar and label

**Page 2 — Annual Review Notes**
- One card per fiscal year showing the FY label, meeting count, and annual overall notes

> Individual 1:1 meeting notes and action items are **not** in the export — only the annual notes.

---

## Tips & Best Practices

**Rate skills regularly, not just at review time**
The Progress chart is most useful with multiple data points. Rate after significant projects or at end of each quarter.

**Use notes when rating**
"Led the DB migration independently" gives you concrete evidence when writing appraisals.

**Use Quick Fill chips for speed**
Pre-defined note chips in the rating modal let you document a rating in one click.

**Write annual notes before the year closes**
The Annual Notes section is your year-end summary — it feeds directly into the PDF export.

**Set role benchmarks early**
Benchmarks make the Skills page immediately useful — the gap indicators show exactly where each person needs to grow.

**Log meetings right after they happen**
The date defaults to today. Fresh notes are more accurate.

**Track goals alongside skills**
Goals give context to ratings — link a goal to the area you're actively developing.

**Use meeting templates for structure**
If you follow a fixed 1:1 format (e.g. Wins / Blockers / Next steps), save it as a template for consistency.

---

## Troubleshooting

**Team dropdown is empty when adding a member**
Go to Settings → Teams and add your teams first.

**No benchmark indicators on Skills page**
Go to Settings → Role Benchmarks, select the employee's role, and set target ratings.

**New fiscal year section not appearing**
Sections appear automatically when you log a meeting with a date in that FY. Log a meeting with the correct date.

**Charts are blank**
Charts need data to render. Ensure ratings exist (radar/progress charts) or meetings exist (frequency chart).

**App shows a database error on startup**
Check that `DATABASE_URL` in `.env` uses an absolute path:
```
DATABASE_URL="file:/absolute/path/to/prisma/dev.db"
```

**I accidentally deleted data**
There is no undo. Back up `prisma/dev.db` regularly if data loss is a concern.

**App won't start**
Run `npm install` then `npm run dev`.
