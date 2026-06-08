/// <reference types="node" />
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean up existing data to avoid conflicts
  console.log('🧹 Clearing existing data...');
  await prisma.task.deleteMany({});
  await prisma.assignment.deleteMany({});
  await prisma.userSkill.deleteMany({});
  await prisma.leaveRequest.deleteMany({});
  await prisma.equipment.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.skillSet.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.rank.deleteMany({});
  await prisma.projectRole.deleteMany({});

  // 1. Ranks
  console.log('👥 Seeding Ranks...');
  const ranks = await Promise.all([
    prisma.rank.create({ data: { name: 'Junior', baseSalary: 30000000 } }),
    prisma.rank.create({ data: { name: 'Senior', baseSalary: 60000000 } }),
    prisma.rank.create({ data: { name: 'Manager', baseSalary: 80000000 } }),
  ]);

  // 2. SkillSets
  console.log('🛠️ Seeding SkillSets...');
  const skills = await Promise.all([
    prisma.skillSet.create({ data: { name: 'React', category: 'Frontend' } }),
    prisma.skillSet.create({ data: { name: 'Node.js', category: 'Backend' } }),
    prisma.skillSet.create({ data: { name: 'TypeScript', category: 'Backend' } }),
    prisma.skillSet.create({ data: { name: 'Prisma', category: 'Backend' } }),
    prisma.skillSet.create({ data: { name: 'Tailwind CSS', category: 'Frontend' } }),
  ]);

  // 3. Users
  console.log('👤 Seeding Users...');
  const user1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      name: 'John Doe',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
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
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
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
  console.log('📁 Seeding Projects...');
  const project1 = await prisma.project.create({
    data: {
      title: 'Global Expansion Platform',
      description: 'Building a new platform for global market expansion.',
      status: 'Active',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      budget: 500000,
      assignments: {
        create: [
          { userId: user1.id, role: 'Lead Developer', contributionPercentage: 80, startDate: new Date('2026-01-01'), endDate: new Date('2026-12-31') },
          { userId: user2.id, role: 'UI Developer', contributionPercentage: 100, startDate: new Date('2026-02-01'), endDate: new Date('2026-10-31') },
        ],
      },
    },
  });

  const project2 = await prisma.project.create({
    data: {
      title: 'Quantum Security Patch',
      description: 'Upgrade network layers to quantum-safe cryptographic schemes.',
      status: 'At Risk',
      startDate: new Date('2026-03-01'),
      endDate: new Date('2026-09-30'),
      budget: 250000,
      assignments: {
        create: [
          { userId: user1.id, role: 'Security Architect', contributionPercentage: 20, startDate: new Date('2026-03-01'), endDate: new Date('2026-09-30') },
        ],
      },
    },
  });

  // 5. Tasks
  console.log('📋 Seeding Tasks...');
  const baseDate = new Date();
  const getRelativeDate = (offsetDays: number) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + offsetDays);
    return d;
  };

  await prisma.task.createMany({
    data: [
      {
        title: 'Design System Migration Planning',
        description: 'Plan the transition of current components to the new SI Ops Light design system.',
        status: 'IN_PROGRESS',
        dueDate: getRelativeDate(3),
        projectId: project1.id,
        userId: user1.id,
      },
      {
        title: 'Setup Prisma Schema and Client',
        description: 'Add core tables and sync them to MySQL using Prisma push.',
        status: 'DONE',
        dueDate: getRelativeDate(-4),
        projectId: project1.id,
        userId: user2.id,
      },
      {
        title: 'Implement Kanban Board Component',
        description: 'Build an interactive 3-column kanban board layout with click details modal.',
        status: 'TODO',
        dueDate: getRelativeDate(8),
        projectId: project1.id,
        userId: user2.id,
      },
      {
        title: 'Security Audit & Vulnerability Scanning',
        description: 'Perform initial security scanning on all network endpoints for quantum compatibility.',
        status: 'TODO',
        dueDate: getRelativeDate(2),
        projectId: project2.id,
        userId: user1.id,
      },
      {
        title: 'Draft Project Roadmap Phase 2',
        description: 'Prepare materials and slides for next quarter presentation.',
        status: 'TODO',
        dueDate: getRelativeDate(5),
        projectId: project1.id,
        userId: user1.id,
      },
    ],
  });

  // 6. Project Roles
  console.log('💼 Seeding ProjectRoles...');
  await Promise.all([
    prisma.projectRole.create({ data: { name: 'PM' } }),
    prisma.projectRole.create({ data: { name: 'Lead Developer' } }),
    prisma.projectRole.create({ data: { name: 'Frontend Developer' } }),
    prisma.projectRole.create({ data: { name: 'Backend Developer' } }),
    prisma.projectRole.create({ data: { name: 'Designer' } }),
    prisma.projectRole.create({ data: { name: 'QA Engineer' } }),
  ]);

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
