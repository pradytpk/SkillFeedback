import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

const SEED_DATA = [
  {
    name: "Technical",
    description: "Engineering and technical skills",
    skills: [
      { name: "Code Quality", description: "Writing clean, maintainable code" },
      { name: "System Design", description: "Designing scalable systems" },
      { name: "Testing", description: "Writing and maintaining tests" },
      { name: "Documentation", description: "Writing clear documentation" },
    ],
  },
  {
    name: "Communication",
    description: "Interpersonal and communication skills",
    skills: [
      { name: "Written Communication", description: "Clear written expression" },
      { name: "Verbal Communication", description: "Clear spoken expression" },
      { name: "Feedback Giving", description: "Providing constructive feedback" },
      { name: "Stakeholder Management", description: "Managing stakeholder expectations" },
    ],
  },
  {
    name: "Leadership",
    description: "Leadership and influence skills",
    skills: [
      { name: "Initiative", description: "Taking ownership proactively" },
      { name: "Mentoring", description: "Supporting others' growth" },
      { name: "Decision Making", description: "Making sound decisions under uncertainty" },
      { name: "Conflict Resolution", description: "Navigating disagreements constructively" },
    ],
  },
  {
    name: "Delivery",
    description: "Execution and delivery skills",
    skills: [
      { name: "Estimation", description: "Accurately estimating effort and timelines" },
      { name: "Reliability", description: "Consistently delivering on commitments" },
      { name: "Prioritization", description: "Focusing on what matters most" },
      { name: "Execution Speed", description: "Moving efficiently without sacrificing quality" },
    ],
  },
];

async function main() {
  for (const categoryData of SEED_DATA) {
    const category = await prisma.skillCategory.upsert({
      where: { name: categoryData.name },
      update: {},
      create: {
        name: categoryData.name,
        description: categoryData.description,
        isBuiltIn: true,
      },
    });

    for (const skillData of categoryData.skills) {
      await prisma.skill.upsert({
        where: { name_categoryId: { name: skillData.name, categoryId: category.id } },
        update: {},
        create: {
          name: skillData.name,
          description: skillData.description,
          categoryId: category.id,
          isBuiltIn: true,
        },
      });
    }
  }

  console.log("Seed complete: 4 categories and 16 skills created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
