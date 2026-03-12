"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, CalendarDays } from "lucide-react";
import { deleteGoal, cycleGoalStatus } from "@/actions/goals";
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

interface Goal {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  targetDate: string | null;
  status: string;
}

export default function GoalCard({ goal, employeeId }: { goal: Goal; employeeId: string }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [cycling, setCycling] = useState(false);

  const isOverdue =
    goal.targetDate &&
    goal.status === "ACTIVE" &&
    new Date(goal.targetDate) < new Date();

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

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-orange-200 transition-colors group">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
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
            </div>

            <p className={cn(
              "font-semibold text-gray-900",
              goal.status === "CANCELLED" && "line-through text-gray-400"
            )}>
              {goal.title}
            </p>

            {goal.description && (
              <p className="text-sm text-gray-500 mt-1">{goal.description}</p>
            )}

            {goal.targetDate && (
              <div className={cn(
                "flex items-center gap-1 mt-2 text-xs",
                isOverdue ? "text-red-500 font-medium" : "text-gray-400"
              )}>
                <CalendarDays className="w-3 h-3" />
                Due {new Date(goal.targetDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                {isOverdue && " · Overdue"}
              </div>
            )}
          </div>

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDelete}>
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
            </Button>
          </div>
        </div>
      </div>

      <GoalForm
        open={editing}
        onClose={() => setEditing(false)}
        employeeId={employeeId}
        goal={goal}
      />
    </>
  );
}
