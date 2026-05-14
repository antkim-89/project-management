import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Ranks
  const ranks = await Promise.all([
    prisma.rank.create({ data: { name: 'Junior', baseSalary: 30000000 } }),
    prisma.rank.create({ data: { name: 'Senior', baseSalary: 60000000 } }),
    prisma.rank.create({ data: { name: 'Manager', baseSalary: 80000000 } }),
  ]);

  // 2. SkillSets
  const skills = await Promise.all([
    prisma.skillSet.create({ data: { name: 'React', category: 'Frontend' } }),
    prisma.skillSet.create({ data: { name: 'Node.js', category: 'Backend' } }),
    prisma.skillSet.create({ data: { name: 'TypeScript', category: 'Backend' } }),
    prisma.skillSet.create({ data: { name: 'Prisma', category: 'Backend' } }),
    prisma.skillSet.create({ data: { name: 'Tailwind CSS', category: 'Frontend' } }),
  ]);

  // 3. Users
  const user1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      name: 'John Doe',
      rankId: ranks[1].id, // Senior
      skills: {
        create: [
          { skillSetId: skills[0].id, proficiency: 5 },
          { skillSetId: skills[1].id, proficiency: 4 },
        ],
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      name: 'Jane Smith',
      rankId: ranks[0].id, // Junior
      skills: {
        create: [
          { skillSetId: skills[2].id, proficiency: 3 },
          { skillSetId: skills[4].id, proficiency: 5 },
        ],
      },
    },
  });

  // 4. Projects
  const project1 = await prisma.project.create({
    data: {
      title: 'Global Expansion Platform',
      description: 'Building a new platform for global market expansion.',
      status: 'Active',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      budget: 500000,
      assignments: {
        create: [
          { userId: user1.id, role: 'Lead Developer', contributionPercentage: 80, startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31') },
          { userId: user2.id, role: 'UI Developer', contributionPercentage: 100, startDate: new Date('2024-02-01'), endDate: new Date('2024-10-31') },
        ],
      },
    },
  });

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
