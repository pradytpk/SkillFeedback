"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, CalendarDays, ChevronDown, ChevronUp, TrendingUp } from "lucide-react";
import { deleteGoal, cycleGoalStatus, updateGoalProgress } from "@/actions/goals";
import GoalForm from "./GoalForm";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  PAUSED: "bg-yellow-100 text-yellow-700",
  CANCELLED: "bg-gray-100 text-gray-400 line-through",
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Active",
  COMPLETED: "Completed",
  PAUSED: "Paused",
  CANCELLED: "Cancelled",
};

const WEIGHT_LABELS: Record<number, string> = { 1: "Normal", 2: "Important", 3: "Critical" };

interface GoalUpdate { id: string; note: string; progressPct: number; updatedAt: string }
interface Skill { id: string; name: string; categoryName: string }

interface Goal {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  targetDate: string | null;
  status: string;
  fiscalYear: string | null;
  quarter: string | null;
  progressPct: number;
  weight: number;
  linkedSkillId: string | null;
  linkedSkillName: string | null;
  updates: GoalUpdate[];
}

export default function GoalCard({
  goal,
  employeeId,
  availableSkills = [],
}: {
  goal: Goal;
  employeeId: string;
  availableSkills?: Skill[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [cycling, setCycling] = useState(false);
  const [showUpdates, setShowUpdates] = useState(false);
  const [showProgressForm, setShowProgressForm] = useState(false);
  const [newPct, setNewPct] = useState(String(goal.progressPct));
  const [newNote, setNewNote] = useState("");
  const [saving, setSaving] = useState(false);

  const isOverdue = goal.targetDate && goal.status === "ACTIVE" && new Date(goal.targetDate) < new Date();

  async function handleDelete() {
    if (!confirm(`Delete goal "${goal.title}"?`)) return;
    await deleteGoal(goal.id, employeeId);
    router.refresh();
  }

  async function handleCycle() {
    setCycling(true);
    try {
      await cycleGoalStatus(goal.id, employeeId, goal.status);
      router.refresh();
    } finally {
      setCycling(false);
    }
  }

  async function handleProgressSave() {
    const pct = Math.min(100, Math.max(0, parseInt(newPct) || 0));
    if (!newNote.trim()) return;
    setSaving(true);
    try {
      await updateGoalProgress(goal.id, employeeId, pct, newNote.trim());
      setShowProgressForm(false);
      setNewNote("");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  const goalForForm = {
    ...goal,
    targetDate: goal.targetDate,
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 hover:border-orange-200 transition-colors group">
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {/* Badges row */}
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <button
                  onClick={handleCycle}
                  disabled={cycling}
                  className={cn(
                    "text-xs font-semibold px-2.5 py-0.5 rounded-full cursor-pointer transition-opacity",
                    STATUS_STYLES[goal.status] ?? "bg-gray-100 text-gray-600",
                    cycling && "opacity-50"
                  )}
                  title="Click to cycle status"
                >
                  {STATUS_LABELS[goal.status] ?? goal.status}
                </button>
                {goal.category && (
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                    {goal.category}
                  </span>
                )}
                {goal.fiscalYear && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    FY {goal.fiscalYear}{goal.quarter ? ` · ${goal.quarter}` : ""}
                  </span>
                )}
                {goal.weight > 1 && (
                  <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">
                    {WEIGHT_LABELS[goal.weight]}
                  </span>
                )}
                {goal.linkedSkillName && (
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                    ⚡ {goal.linkedSkillName}
                  </span>
                )}
              </div>

              {/* Title */}
              <p className={cn("font-semibold text-gray-900", goal.status === "CANCELLED" && "line-through text-gray-400")}>
                {goal.title}
              </p>

              {goal.description && (
                <p className="text-sm text-gray-500 mt-1">{goal.description}</p>
              )}

              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Progress</span>
                  <span className="text-xs font-semibold text-orange-600">{goal.progressPct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all duration-300"
                    style={{ width: `${goal.progressPct}%` }}
                  />
                </div>
              </div>

              {/* Target date */}
              {goal.targetDate && (
                <div className={cn("flex items-center gap-1 mt-2 text-xs", isOverdue ? "text-red-500 font-medium" : "text-gray-400")}>
                  <CalendarDays className="w-3 h-3" />
                  Due {new Date(goal.targetDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  {isOverdue && " · Overdue"}
                </div>
              )}
            </div>

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <Button variant="ghost" size="sm" onClick={() => setShowProgressForm((s) => !s)} title="Update progress">
                <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDelete}>
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
              </Button>
            </div>
          </div>

          {/* Inline progress update form */}
          {showProgressForm && (
            <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-100 space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-gray-700 w-16 flex-shrink-0">Progress %</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={newPct}
                  onChange={(e) => setNewPct(e.target.value)}
                  className="w-20 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-gray-700 w-16 flex-shrink-0">Note *</label>
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="What was achieved?"
                  className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowProgressForm(false)} className="text-xs text-gray-500 hover:text-gray-700">Cancel</button>
                <button
                  onClick={handleProgressSave}
                  disabled={saving || !newNote.trim()}
                  className="text-xs bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700 disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Progress update history */}
        {goal.updates.length > 0 && (
          <div className="border-t border-gray-100">
            <button
              onClick={() => setShowUpdates((s) => !s)}
              className="w-full flex items-center justify-between px-4 py-2 text-xs text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <span>{goal.updates.length} progress update{goal.updates.length !== 1 ? "s" : ""}</span>
              {showUpdates ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {showUpdates && (
              <ul className="px-4 pb-3 space-y-2">
                {goal.updates.map((u) => (
                  <li key={u.id} className="flex items-start gap-2 text-xs">
                    <span className="text-orange-600 font-semibold w-8 flex-shrink-0">{u.progressPct}%</span>
                    <span className="text-gray-600 flex-1">{u.note}</span>
                    <span className="text-gray-300 flex-shrink-0">
                      {new Date(u.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <GoalForm
        open={editing}
        onClose={() => setEditing(false)}
        employeeId={employeeId}
        goal={goalForForm}
        availableSkills={availableSkills}
      />
    </>
  );
}
