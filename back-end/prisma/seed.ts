/// <reference types="node" />
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');
  const hashedInitialPassword = await bcrypt.hash('itmsg4u!', 10);

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
  await prisma.team.deleteMany({});

  // 1. Ranks
  console.log('👥 Seeding Ranks...');
  const ranks = await Promise.all([
    prisma.rank.create({ data: { name: 'Junior', baseSalary: 30000000 } }),
    prisma.rank.create({ data: { name: 'Senior', baseSalary: 60000000 } }),
    prisma.rank.create({ data: { name: 'Manager', baseSalary: 80000000 } }),
  ]);

  // 1.5. Teams
  console.log('🏢 Seeding Teams...');
  const teams = await Promise.all([
    prisma.team.create({ data: { name: 'Software Engineering', description: 'Core software design and implementation.' } }),
    prisma.team.create({ data: { name: 'Design & UX', description: 'Product user experience and layout design.' } }),
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
      password: hashedInitialPassword,
      mustChangePassword: true,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      rankId: ranks[1].id, // Senior
      teamId: teams[0].id, // Software Engineering
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
      password: hashedInitialPassword,
      mustChangePassword: true,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
      rankId: ranks[0].id, // Junior
      teamId: teams[1].id, // Design & UX
      skills: {
        create: [
          { skillSetId: skills[2].id, proficiency: 3 },
          { skillSetId: skills[4].id, proficiency: 5 },
        ],
      },
    },
  });

  console.log('👥 Seeding 20 Additional Test Users...');
  const firstNames = ['David', 'Sarah', 'Alex', 'Emily', 'Michael', 'Jessica', 'James', 'Olivia', 'Daniel', 'Sophia', 'Matthew', 'Isabella', 'Andrew', 'Mia', 'Joshua', 'Charlotte', 'Ryan', 'Amelia', 'Justin', 'Harper'];
  const lastNames = ['Kim', 'Lee', 'Park', 'Choi', 'Jung', 'Kang', 'Jo', 'Yoon', 'Jang', 'Lim', 'Han', 'Oh', 'Seo', 'Shin', 'Kwon', 'Hwang', 'Song', 'Ahn', 'Hong', 'Yang'];
  
  const avatars = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=100&q=80',
  ];

  for (let i = 0; i < 20; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    const avatarUrl = avatars[i % avatars.length];
    const rank = ranks[i % ranks.length];
    const team = teams[i % teams.length];

    await prisma.user.create({
      data: {
        email,
        name,
        password: hashedInitialPassword,
        mustChangePassword: false,
        avatarUrl,
        rankId: rank.id,
        teamId: team.id,
        skills: {
          create: [
            { skillSetId: skills[i % skills.length].id, proficiency: (i % 3) + 3 },
            { skillSetId: skills[(i + 2) % skills.length].id, proficiency: (i % 2) + 3 },
          ],
        },
      },
    });
  }

  // 4. Projects
  console.log('📁 Seeding Projects...');
  const project1 = await prisma.project.create({
    data: {
      title: 'Global Expansion Platform',
      description: 'Building a new platform for global market expansion.',
      status: 'Active',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
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
