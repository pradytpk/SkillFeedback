# SkillTracker — User Manual

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Managing Employees](#managing-employees)
4. [Skill Matrix](#skill-matrix)
5. [1:1 Meetings](#11-meetings)
6. [Action Items](#action-items)
7. [Progress Charts](#progress-charts)
8. [Skills Settings](#skills-settings)
9. [Tips & Best Practices](#tips--best-practices)

---

## Overview

SkillTracker is a tool for managers to track their team members' skills and 1-on-1 meeting feedback in one place. It helps you:

- See where each person stands across key skill areas
- Track skill growth over time
- Keep a running log of your 1:1 meetings, notes, and follow-up action items
- Spot trends with visual progress charts

The app is designed for a single manager — no login or multi-user setup required.

---

## Getting Started

### Starting the App

Open a terminal in the project folder and run:

```bash
npm run dev
```

Then open your browser and go to **http://localhost:3000**.

You'll land on the **Team Members** page. This is your home base.

---

## Managing Employees

### Viewing Your Team

The home page shows all your team members as cards. Each card displays:

- **Name, role, and team**
- **Number of skill ratings** logged
- **Number of 1:1 meetings** logged
- **Last 1:1 date** (e.g. "3 days ago")
- **Start date**

Click any card to open that person's detail view.

---

### Adding a Team Member

1. Click **Add Employee** (top right of the home page)
2. Fill in the form:
   - **Name** — full name
   - **Role** — job title (e.g. "Senior Engineer")
   - **Team** — team or department (e.g. "Platform")
   - **Start Date** — when they joined the team
   - **Avatar Color** — pick a color for their initials avatar
3. Click **Add Employee** to save

---

### Editing a Team Member

1. Hover over an employee card — edit and delete buttons appear in the top-right corner
2. Click the **pencil icon** to open the edit form
3. Make your changes and click **Save Changes**

---

### Deleting a Team Member

1. Hover over an employee card and click the **trash icon**
2. Confirm the deletion in the dialog

> **Warning:** Deleting an employee permanently removes all their skill ratings, meetings, and action items. This cannot be undone.

---

## Skill Matrix

The **Skills** tab shows a full matrix of skill categories and ratings for an employee.

### Navigation

From the employee list, click a card to go to their Skills page. You can also use the **Skills | Meetings | Progress** tabs at the top of any employee's page.

### Reading the Matrix

Skills are grouped by category (Technical, Communication, Leadership, Delivery). Each skill shows:

- **Colored dots** representing the current rating (1–5)
- **Rating label** next to the dots (e.g. "Proficient")
- **No dots** if the skill hasn't been rated yet

| Rating | Label | Dot Color |
|---|---|---|
| 1 | Beginner | Red |
| 2 | Developing | Orange |
| 3 | Proficient | Yellow |
| 4 | Advanced | Blue |
| 5 | Expert | Green |

### Rating a Skill

1. Click on any skill cell — it highlights in blue on hover
2. A dialog opens showing the skill name and current rating
3. Click the dots to select a rating (1–5)
4. Optionally add **notes** — e.g. "Demonstrated in Q4 infrastructure project"
5. Click **Save Rating**

The rating is saved immediately and the matrix updates.

> **Note:** Every time you save a rating, a new record is created. Previous ratings are preserved for the Progress chart — you never lose history.

### Rating Again Later

You can re-rate any skill at any time. The new rating becomes the "current" rating shown in the matrix, while the old rating is kept in history and shown in the Progress chart.

---

## 1:1 Meetings

The **Meetings** tab shows a chronological log of all 1:1 sessions with an employee.

### Logging a Meeting

1. Go to an employee's **Meetings** tab
2. Click **Log Meeting**
3. Fill in the form:
   - **Meeting Date** — defaults to today
   - **Notes** — what was discussed (agenda, topics, context)
   - **Feedback** — key feedback you gave to this person
4. Click **Log Meeting** to save

The meeting appears at the top of the list (most recent first).

### Viewing a Meeting

Each meeting card shows:

- **Date** and relative time (e.g. "5 days ago")
- **Feedback** — shown in a highlighted block for quick scanning
- **Open action item count** — shown as an amber badge if any are open

Click the **chevron (▾)** on the right to expand the card and see:
- Full **notes**
- All **action items**

### Editing a Meeting

1. Hover over a meeting card and click the **pencil icon**
2. Update the date, notes, or feedback
3. Click **Save Changes**

### Deleting a Meeting

1. Hover over a meeting card and click the **trash icon**
2. Confirm the deletion

> **Warning:** Deleting a meeting also deletes all its action items.

---

## Action Items

Action items are tasks or follow-ups captured within a meeting.

### Adding an Action Item

1. Expand a meeting card (click the chevron)
2. Click **+ Add** next to "Action Items"
3. Type the description and press **Enter** or click **Add**

### Updating Status

Each action item has a status button on the left. Click it to cycle through:

```
OPEN  →  IN PROGRESS  →  DONE  →  OPEN  →  ...
```

The status updates instantly (optimistic update — no page reload needed).

| Status | Meaning |
|---|---|
| Open | Not yet started |
| In Progress | Being worked on |
| Done | Completed |
| Cancelled | No longer needed |

### Deleting an Action Item

Hover over an action item row — a trash icon appears on the right. Click it to delete.

### Tracking Open Items

The meeting card header shows an amber badge with the count of Open + In Progress items. This lets you quickly see which meetings have unresolved follow-ups without expanding them.

---

## Progress Charts

The **Progress** tab shows three charts that visualize an employee's skill growth and meeting patterns over time.

### Skill Snapshot (Radar Chart)

A spider/radar chart showing the **current average rating per skill category**. Each axis represents one category (Technical, Communication, Leadership, Delivery). The shaded area shows the employee's current position.

- A larger, rounder shape = stronger overall skill profile
- Lopsided shape = stronger in some areas than others

### Skill Ratings Over Time (Line Chart)

A line chart showing how each skill has been rated over time.

- Each line represents one skill
- X-axis = date of rating
- Y-axis = rating (1–5)
- Hover over a point to see the skill name, rating, and label (e.g. "4 — Advanced")

Use this chart to see if a skill is improving, plateauing, or declining.

### Meeting Frequency (Bar Chart)

A bar chart showing how many 1:1 meetings were logged per month.

- Useful for spotting gaps — e.g. months with no meetings
- Hover a bar to see the exact count

> **Note:** All charts require at least one rating or meeting to display data. Empty states show a placeholder message.

---

## Skills Settings

The **Skills Settings** page (accessible from the sidebar) lets you manage the skill categories and skills used in the matrix.

### Viewing Categories and Skills

- The **left panel** lists all skill categories with a skill count
- Click a category to see its skills in the **right panel**
- Categories and skills marked with a **lock icon (🔒)** are built-in and cannot be deleted

### Adding a Custom Category

1. Click the **+** icon at the top of the left panel
2. Type a category name and press **Enter** or click **Add**

The new category appears in the list immediately and is available in every employee's skill matrix.

### Adding a Custom Skill

1. Select the category you want to add a skill to
2. Click **+ Add Skill** in the right panel
3. Type the skill name and press **Enter** or click **Add**

### Deleting a Custom Category

1. Hover over a custom (non-locked) category
2. Click the **trash icon** that appears
3. Confirm the deletion

> **Warning:** Deleting a category also deletes all its skills and any ratings employees have for those skills.

### Deleting a Custom Skill

1. Select the category containing the skill
2. Hover over the custom (non-locked) skill
3. Click the **trash icon**

---

## Tips & Best Practices

**Rate skills regularly, not just during reviews**
The progress chart is most useful when you have multiple data points over time. Consider rating skills after each significant project or quarter, not only at annual review time.

**Use the Notes field in ratings**
When saving a rating, adding a short note (e.g. "Led the database migration independently") gives you concrete evidence when writing performance reviews later.

**Log meetings right after they happen**
The sooner you log notes and feedback after a 1:1, the more accurate and useful they'll be. The app defaults the meeting date to today to make this quick.

**Use action items consistently**
Capturing action items in the tool (rather than a separate doc) means they show up on the meeting card and you can track completion across sessions. Check open items at the start of each 1:1.

**Use feedback as a summary, not a transcript**
The **Feedback** field (highlighted on the meeting card) is for your key message to the employee — the one thing they should remember from the conversation. Notes can hold the full discussion detail.

**Add custom skills for your team's context**
The built-in skills cover common areas, but you can add custom categories and skills for things specific to your team (e.g. "Infrastructure", "On-call Readiness", "Customer Empathy").

---

## Keyboard Shortcuts

| Context | Key | Action |
|---|---|---|
| Action item input | Enter | Save the action item |
| Category/skill input | Enter | Save the category or skill |
| Any modal | Esc | Close the modal |

---

## Troubleshooting

**The app shows a database error on startup**

Make sure the `DATABASE_URL` in the `.env` file uses an absolute path:
```
DATABASE_URL="file:/absolute/path/to/prisma/dev.db"
```
Then restart the dev server.

**I accidentally deleted an employee / meeting**

There is no undo. The data is permanently removed from the SQLite database. For important data, consider periodically backing up the `prisma/dev.db` file.

**Charts are empty even though I have data**

Charts load asynchronously after the page renders. If they're blank, wait a moment and check that ratings/meetings exist for the employee. Try refreshing the page.

**The app won't start**

Run `npm install` in the project folder to ensure all dependencies are installed, then try `npm run dev` again.
