import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const ratings = await prisma.skillRating.findMany({
    where: { employeeId: params.id },
    orderBy: { ratedAt: "asc" },
    include: {
      skill: {
        include: { category: true },
      },
    },
  });

  const data = ratings.map((r) => ({
    id: r.id,
    skillId: r.skillId,
    skillName: r.skill.name,
    categoryName: r.skill.category.name,
    rating: r.rating,
    notes: r.notes,
    ratedAt: r.ratedAt.toISOString(),
  }));

  return NextResponse.json(data);
}
