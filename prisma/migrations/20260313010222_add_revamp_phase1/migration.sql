-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN "moodScore" INTEGER;
ALTER TABLE "Meeting" ADD COLUMN "qualityFlag" TEXT;

-- AlterTable
ALTER TABLE "Skill" ADD COLUMN "targetByDate" DATETIME;
ALTER TABLE "Skill" ADD COLUMN "targetRating" INTEGER;

-- CreateTable
CREATE TABLE "GoalUpdate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "goalId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "progressPct" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GoalUpdate_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Commitment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "meetingId" TEXT,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "dueDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Commitment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Commitment_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AppraisalRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "fiscalYear" TEXT NOT NULL,
    "overallRating" TEXT,
    "talentBoxPerf" TEXT,
    "talentBoxPot" TEXT,
    "achievements" TEXT,
    "strengths" TEXT,
    "developAreas" TEXT,
    "devPlanNextYear" TEXT,
    "peerFeedbackNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AppraisalRecord_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Employee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "avatarColor" TEXT NOT NULL DEFAULT '#ea580c',
    "selfAssessmentEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Employee" ("avatarColor", "createdAt", "id", "name", "role", "startDate", "team", "updatedAt") SELECT "avatarColor", "createdAt", "id", "name", "role", "startDate", "team", "updatedAt" FROM "Employee";
DROP TABLE "Employee";
ALTER TABLE "new_Employee" RENAME TO "Employee";
CREATE TABLE "new_Goal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "targetDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "category" TEXT,
    "fiscalYear" TEXT,
    "quarter" TEXT,
    "progressPct" INTEGER NOT NULL DEFAULT 0,
    "linkedSkillId" TEXT,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Goal_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Goal_linkedSkillId_fkey" FOREIGN KEY ("linkedSkillId") REFERENCES "Skill" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Goal" ("category", "createdAt", "description", "employeeId", "id", "status", "targetDate", "title", "updatedAt") SELECT "category", "createdAt", "description", "employeeId", "id", "status", "targetDate", "title", "updatedAt" FROM "Goal";
DROP TABLE "Goal";
ALTER TABLE "new_Goal" RENAME TO "Goal";
CREATE TABLE "new_SkillRating" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "selfRating" INTEGER,
    "ratedBy" TEXT NOT NULL DEFAULT 'manager',
    "notes" TEXT,
    "ratedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SkillRating_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SkillRating_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SkillRating" ("employeeId", "id", "notes", "ratedAt", "rating", "skillId") SELECT "employeeId", "id", "notes", "ratedAt", "rating", "skillId" FROM "SkillRating";
DROP TABLE "SkillRating";
ALTER TABLE "new_SkillRating" RENAME TO "SkillRating";
CREATE INDEX "SkillRating_employeeId_skillId_idx" ON "SkillRating"("employeeId", "skillId");
CREATE INDEX "SkillRating_ratedAt_idx" ON "SkillRating"("ratedAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "AppraisalRecord_employeeId_fiscalYear_key" ON "AppraisalRecord"("employeeId", "fiscalYear");
