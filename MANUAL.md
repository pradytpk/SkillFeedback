# SkillTracker — User Manual

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Team Members](#team-members)
4. [Skill Matrix](#skill-matrix)
5. [1:1 Meetings](#11-meetings)
6. [Annual Notes](#annual-notes)
7. [Action Items](#action-items)
8. [Progress Charts](#progress-charts)
9. [Settings](#settings)
10. [Downloading a PDF Report](#downloading-a-pdf-report)
11. [Tips & Best Practices](#tips--best-practices)
12. [Troubleshooting](#troubleshooting)

---

## Overview

SkillTracker is a tool for managers to track team skills and 1-on-1 meeting feedback in one place. It helps you:

- See each person's current skill levels across key areas
- Track skill growth over time with history charts
- Log 1:1 meetings organised by fiscal year (April–March)
- Write annual overall notes per year for use in performance reviews
- Download a professional PDF report to share with HR or senior management

The app is for a single manager — no login required.

---

## Getting Started

### Local / Dev

```bash
npm run dev
```

Open **http://localhost:3000**.

### Docker

```bash
docker compose up --build
```

Open **http://localhost:3000**. The database sets up automatically on first run.

---

## Team Members

### The List View

The home page shows all team members in a table with:
- **Name, role** and start date
- **Team** badge
- **Skill Ratings** count
- **Last 1:1** — relative date of the most recent meeting
- Edit and delete buttons (appear on hover)

### Searching

Type in the search bar to filter by **name** or **team** in real time.

### Adding a Team Member

1. Click **Add Member** (top right)
2. Fill in:
   - **Full Name**
   - **Role / Title** (e.g. "Senior Engineer")
   - **Team** — dropdown populated from Settings → Teams
   - **Start Date**
   - **Avatar Color** — color for their initials circle
3. Click **Add Member**

> If the Team dropdown is empty, go to **Settings → Teams** and add teams first.

### Editing a Team Member

Hover over any row and click the **pencil icon** → make changes → **Save Changes**.

### Deleting a Team Member

Hover over a row → click the **trash icon** → confirm.

> **Warning:** Deletes all their skill ratings, meetings, and action items permanently.

### Back Navigation

Inside any employee's page, click **← Team Members** at the top to return to the list.

---

## Skill Matrix

Navigate to an employee → **Skills** tab.

### Reading the Matrix

Skills are grouped by assigned category. Each skill shows:
- **Colored dots** for the current rating (1–5)
- **Rating label** (e.g. "Proficient")
- **Notes** from the last rating (shown in small text below the dots, if any)
- No dots = not yet rated

| Rating | Label | Color |
|---|---|---|
| 1 | Beginner | Red |
| 2 | Developing | Orange |
| 3 | Proficient | Yellow |
| 4 | Advanced | Blue |
| 5 | Expert | Green |

### Rating a Skill

1. Click any skill cell (it highlights on hover)
2. Select a rating 1–5 using the dots
3. Optionally add **notes** — context for the rating (e.g. "Led the DB migration independently")
4. Click **Save Rating**

Every save creates a **new history record** — previous ratings are never deleted.

### Assigning Skill Categories to an Employee

By default an employee has no categories. Click **Manage Categories** to tick which skill categories apply to them. Each employee can have a different set.

---

## 1:1 Meetings

Navigate to an employee → **Meetings** tab.

### Fiscal Year View

Meetings are grouped by **fiscal year (April–March)**:
- **FY 2024-25** = April 2024 – March 2025
- **FY 2025-26** = April 2025 – March 2026

Each year appears as a collapsible section. The **current fiscal year opens by default**.

**New years appear automatically** — when you log a meeting dated in a new fiscal year period, a new year section is created with no manual setup.

### Logging a Meeting

1. Click **Log Meeting** inside any year section (or the button at the top)
2. Fill in:
   - **Meeting Date** (defaults to today)
   - **Notes** — discussion topics, context
   - **Feedback** — key message to the employee
3. Click **Log Meeting**

### Viewing a Meeting

Each meeting card shows the date and feedback at a glance. Click the **chevron ▾** to expand and see full notes and action items.

### Editing / Deleting a Meeting

Hover over a meeting card → **pencil** to edit, **trash** to delete.

> Deleting a meeting also removes all its action items.

---

## Annual Notes

Inside each fiscal year section there is an **Annual Overall Notes** panel (orange background).

This is for your **overall comments about the year** — a summary for use in performance reviews or the PDF export.

### Adding / Editing Annual Notes

Click anywhere in the notes area → a text box appears → type your notes → click **Save Notes**.

The notes are saved per fiscal year per employee. You can edit them at any time.

> These are the only meeting-related notes included in the PDF export. Individual 1:1 meeting notes are not in the export.

---

## Action Items

Action items are follow-up tasks captured within a meeting.

### Adding an Action Item

1. Expand a meeting card (click ▾)
2. Click **+ Add** in the Action Items section
3. Type a description → press **Enter** or click **Add**

### Updating Status

Click the status badge to cycle through:

```
OPEN  →  IN PROGRESS  →  DONE  →  (back to OPEN)
```

| Status | Meaning |
|---|---|
| Open | Not started |
| In Progress | Being worked on |
| Done | Completed |
| Cancelled | No longer needed |

The update is instant (no page reload).

### Deleting an Action Item

Hover over the item → click the **trash icon**.

### Tracking Open Items

The meeting card header shows an **amber badge** with the count of Open + In Progress items so you can spot unresolved follow-ups at a glance.

---

## Progress Charts

Navigate to an employee → **Progress** tab.

### Skill Snapshot (Radar Chart)

Spider chart showing the **current average rating per skill category**. A larger, fuller shape = stronger overall profile.

### Skill Ratings Over Time (Line Chart)

One line per skill, plotted by rating date. Shows whether a skill is improving, plateauing, or declining. Hover a point to see exact values.

### Meeting Frequency (Bar Chart)

Meetings logged per month. Useful for spotting gaps in your 1:1 cadence.

> Charts require at least one data point to render.

---

## Settings

Click **Settings** in the left sidebar.

### Skill Categories Tab

Manage the skill categories and skills used in every employee's matrix.

**Add a category:** Click **+** at the top of the left panel → type a name → Enter or **Add**

**Add a skill:** Select a category → click **+ Add Skill** → type a name → Enter or **Add**

**Delete:** Hover over any non-locked item → click the **trash icon** → confirm

> Items marked with a **lock icon 🔒** are built-in (seeded) and cannot be deleted.
>
> Deleting a category also deletes all its skills and any ratings employees have for them.

### Teams Tab

Manage the list of teams available in the Add/Edit Member form.

**Add a team:** Click **+** → type a name → Enter or **Add**

**Delete a team:** Hover over a team → click **trash icon** → confirm

> Deleting a team only removes it from the dropdown — existing employees keep their team name.

---

## Downloading a PDF Report

On any employee's page, click **Download Report** (top right).

The PDF includes:

**Page 1 — Skill Report**
- Employee name, role, team, and start date
- **Skill Overview by Category** — horizontal bar chart showing average rating per category with a color legend
- **Skill Matrix** — every skill with a colored bar indicator and label (e.g. "4/5 Advanced")

**Page 2 — Annual Review Notes**
- One card per fiscal year showing:
  - Fiscal year label (e.g. "FY 2024-25")
  - Number of 1:1 meetings held that year
  - The annual overall notes you wrote for that year

> Individual 1:1 meeting notes and action items are **not** included in the export — only the annual overall notes.

---

## Tips & Best Practices

**Rate skills regularly, not just at review time**
The Progress chart is most useful with multiple data points over time. Rate after each significant project or at the end of each quarter.

**Use the Notes field when rating**
Adding context like "Led the infrastructure migration" gives you concrete evidence when writing performance reviews later.

**Log meetings right after they happen**
The app defaults the date to today. Fresh notes are more accurate and useful.

**Use action items to track follow-ups**
Capturing follow-ups here means you see open items on the meeting card and can check them at the start of the next 1:1.

**Write annual notes before the year closes**
The Annual Notes section in each fiscal year section is your place to summarise the year. Write it while the details are fresh — it feeds directly into the PDF export.

**The Feedback field is for your key message**
Keep it to the one thing the employee should remember from the meeting. Use Notes for the full discussion detail.

**Add custom skills for your team's context**
The built-in skills cover common areas. Add custom categories like "On-call Readiness", "Infrastructure", or "Customer Empathy" for what matters to your specific team.

---

## Troubleshooting

**Team dropdown is empty when adding a member**
Go to Settings → Teams tab and add your teams first.

**The app shows a database error**
Ensure `DATABASE_URL` in `.env` uses an absolute path:
```
DATABASE_URL="file:/absolute/path/to/prisma/dev.db"
```
Restart the dev server after changing it.

**I accidentally deleted data**
There is no undo. The data is permanently removed. Back up `prisma/dev.db` regularly if this matters.

**Charts are blank**
Charts require data to render. Make sure the employee has skill ratings (for the radar/progress chart) or meetings logged (for the frequency chart). If data exists, try refreshing the page.

**A new fiscal year isn't showing**
Fiscal year sections appear automatically when a meeting is logged with a date in that year's range (April–March). Log a meeting with the correct date and the section will appear.

**The app won't start**
Run `npm install` to ensure dependencies are installed, then `npm run dev`.
