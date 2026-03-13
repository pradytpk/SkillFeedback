export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AddGoalButton from "@/components/goals/AddGoalButton";
import GoalCard from "@/components/goals/GoalCard";
import { Target } from "lucide-react";

export default async function GoalsPage({ params }: { params: { id: string } }) {
  const employee = await prisma.employee.findUnique({
    where: { id: params.id },
    include: {
      skillCategories: {
        include: {
          category: {
            include: { skills: { orderBy: { name: "asc" } } },
          },
        },
      },
    },
  });
  if (!employee) notFound();

  const goals = await prisma.goal.findMany({
    where: { employeeId: params.id },
    orderBy: [{ status: "asc" }, { targetDate: "asc" }, { createdAt: "desc" }],
    include: {
      updates: { orderBy: { updatedAt: "desc" } },
      linkedSkill: { select: { id: true, name: true } },
    },
  });

  // Build available skills list from assigned categories
  const availableSkills = employee.skillCategories.flatMap((ec) =>
    ec.category.skills.map((s) => ({ id: s.id, name: s.name, categoryName: ec.category.name }))
  );

  const serialized = goals.map((g) => ({
    ...g,
    targetDate: g.targetDate ? g.targetDate.toISOString() : null,
    createdAt: g.createdAt.toISOString(),
    updatedAt: g.updatedAt.toISOString(),
    linkedSkillName: g.linkedSkill?.name ?? null,
    updates: g.updates.map((u) => ({
      id: u.id,
      note: u.note,
      progressPct: u.progressPct,
      updatedAt: u.updatedAt.toISOString(),
    })),
  }));

  const active = serialized.filter((g) => g.status === "ACTIVE");
  const completed = serialized.filter((g) => g.status === "COMPLETED");
  const paused = serialized.filter((g) => g.status === "PAUSED");
  const cancelled = serialized.filter((g) => g.status === "CANCELLED");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Goals</h2>
          <p className="text-sm text-gray-500 mt-0.5">{goals.length} goal{goals.length !== 1 ? "s" : ""} tracked</p>
        </div>
        <AddGoalButton employeeId={params.id} availableSkills={availableSkills} />
      </div>

      {goals.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Target className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">No goals yet</p>
          <p className="text-sm mt-1">Add a goal to track growth objectives for {employee.name}.</p>
        </div>
      )}

      {active.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Active ({active.length})</h3>
          <div className="space-y-3">
            {active.map((g) => <GoalCard key={g.id} goal={g} employeeId={params.id} availableSkills={availableSkills} />)}
          </div>
        </div>
      )}

      {paused.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Paused ({paused.length})</h3>
          <div className="space-y-3">
            {paused.map((g) => <GoalCard key={g.id} goal={g} employeeId={params.id} availableSkills={availableSkills} />)}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Completed ({completed.length})</h3>
          <div className="space-y-3">
            {completed.map((g) => <GoalCard key={g.id} goal={g} employeeId={params.id} availableSkills={availableSkills} />)}
          </div>
        </div>
      )}

      {cancelled.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Cancelled ({cancelled.length})</h3>
          <div className="space-y-3">
            {cancelled.map((g) => <GoalCard key={g.id} goal={g} employeeId={params.id} availableSkills={availableSkills} />)}
          </div>
        </div>
      )}
    </div>
  );
}
