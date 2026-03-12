-- AlterTable
ALTER TABLE "Employee" ADD COLUMN "project" TEXT;

-- CreateTable
CREATE TABLE "YearNote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "yearLabel" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "YearNote_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "YearNote_employeeId_yearLabel_key" ON "YearNote"("employeeId", "yearLabel");
