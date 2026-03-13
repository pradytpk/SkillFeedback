export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import SkillCell from "@/components/skills/SkillCell";
import ManageCategoriesButton from "@/components/skills/ManageCategoriesButton";
import { LayoutGrid } from "lucide-react";

export default async function SkillsPage({ params }: { params: { id: string } }) {
  const employee = await prisma.employee.findUnique({ where: { id: params.id } });
  if (!employee) notFound();

  const allCategories = await prisma.skillCategory.findMany({ orderBy: { name: "asc" } });

  const assignedIds = (
    await prisma.employeeSkillCategory.findMany({
      where: { employeeId: params.id },
      select: { categoryId: true },
    })
  ).map((r) => r.categoryId);

  // Benchmarks for this employee's role
  const benchmarks = await prisma.roleBenchmark.findMany({ where: { role: employee.role } });
  const benchmarkMap = Object.fromEntries(benchmarks.map((b) => [b.skillId, b.targetRating]));

  const categories = await prisma.skillCategory.findMany({
    where: { id: { in: assignedIds } },
    orderBy: { name: "asc" },
    include: {
      skills: {
        orderBy: { name: "asc" },
        include: {
          skillRatings: {
            where: { employeeId: params.id },
            orderBy: { ratedAt: "desc" },
            take: 1,
          },
        },
      },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Skill Matrix</h2>
          <p className="text-sm text-gray-500">Click any skill to update the rating</p>
        </div>
        <ManageCategoriesButton
          employeeId={params.id}
          allCategories={allCategories}
          assignedIds={assignedIds}
        />
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <LayoutGrid className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">No skill categories assigned</p>
          <p className="text-sm mt-1">Click "Manage Categories" to assign categories to this employee.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category.id}>
              <div className="mb-3">
                <h3 className="font-semibold text-gray-800">{category.name}</h3>
                {category.description && (
                  <p className="text-xs text-gray-400">{category.description}</p>
                )}
              </div>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                  {category.skills.map((skill) => {
                    const latest = skill.skillRatings[0] ?? null;
                    return (
                      <div key={skill.id} className="p-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">{skill.name}</p>
                        {skill.description && (
                          <p className="text-xs text-gray-400 mb-3">{skill.description}</p>
                        )}
                        <SkillCell
                          employeeId={params.id}
                          skillId={skill.id}
                          skillName={skill.name}
                          categoryName={category.name}
                          currentRating={latest?.rating ?? null}
                          currentNotes={latest?.notes ?? null}
                          targetRating={benchmarkMap[skill.id] ?? null}
                          selfAssessmentEnabled={employee.selfAssessmentEnabled}
                          currentSelfRating={latest?.selfRating ?? null}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
