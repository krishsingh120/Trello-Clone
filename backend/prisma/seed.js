// Seeds the database with a sample board, lists, cards, labels, and members.
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.cardLabel.deleteMany();
  await prisma.cardMember.deleteMany();
  await prisma.checklistItem.deleteMany();
  await prisma.card.deleteMany();
  await prisma.label.deleteMany();
  await prisma.member.deleteMany();
  await prisma.list.deleteMany();
  await prisma.board.deleteMany();

  const board = await prisma.board.create({
    data: {
      id: 1,
      title: 'My Project',
      lists: {
        create: [
          { title: 'To Do', position: 0 },
          { title: 'In Progress', position: 1 },
          { title: 'Done', position: 2 },
        ],
      },
      labels: {
        create: [
          { name: 'Bug', color: '#ef4444' },
          { name: 'Feature', color: '#3b82f6' },
          { name: 'Urgent', color: '#f59e0b' },
        ],
      },
    },
    include: {
      lists: {
        orderBy: { position: 'asc' },
      },
      labels: true,
    },
  });

  const [todoList, progressList, doneList] = board.lists;

  const members = await Promise.all([
    prisma.member.create({ data: { name: 'Alice', avatarColor: '#0ea5e9' } }),
    prisma.member.create({ data: { name: 'Bob', avatarColor: '#22c55e' } }),
    prisma.member.create({ data: { name: 'Carol', avatarColor: '#8b5cf6' } }),
    prisma.member.create({ data: { name: 'Dave', avatarColor: '#f97316' } }),
  ]);

  const cards = await Promise.all([
    prisma.card.create({
      data: {
        listId: todoList.id,
        title: 'Create landing page wireframes',
        description: 'Map the hero section, feature grid, and CTA layout for the first review.',
        position: 0,
      },
    }),
    prisma.card.create({
      data: {
        listId: todoList.id,
        title: 'Draft backlog grooming notes',
        description: 'Prepare the next sprint backlog notes with estimates and blockers.',
        position: 1,
      },
    }),
    prisma.card.create({
      data: {
        listId: progressList.id,
        title: 'Build board API routes',
        description: 'Implement the board details route and search endpoint with eager loading.',
        position: 0,
        dueDate: new Date('2026-04-25T12:00:00.000Z'),
      },
    }),
    prisma.card.create({
      data: {
        listId: progressList.id,
        title: 'Connect drag and drop interactions',
        description: 'Wire horizontal list sorting and vertical card moves with optimistic updates.',
        position: 1,
      },
    }),
    prisma.card.create({
      data: {
        listId: doneList.id,
        title: 'Set up Prisma schema',
        description: 'Create the MySQL schema and verify relational integrity.',
        position: 0,
      },
    }),
    prisma.card.create({
      data: {
        listId: doneList.id,
        title: 'Seed demo workspace',
        description: 'Populate demo lists, members, labels, and starter checklist items.',
        position: 1,
      },
    }),
  ]);

  await prisma.cardLabel.createMany({
    data: [
      { cardId: cards[0].id, labelId: board.labels[1].id },
      { cardId: cards[2].id, labelId: board.labels[0].id },
      { cardId: cards[2].id, labelId: board.labels[2].id },
      { cardId: cards[3].id, labelId: board.labels[1].id },
    ],
  });

  await prisma.cardMember.createMany({
    data: [
      { cardId: cards[0].id, memberId: members[0].id },
      { cardId: cards[2].id, memberId: members[1].id },
      { cardId: cards[2].id, memberId: members[2].id },
      { cardId: cards[3].id, memberId: members[3].id },
    ],
  });

  await prisma.checklistItem.createMany({
    data: [
      { cardId: cards[2].id, title: 'Add repo layer' },
      { cardId: cards[2].id, title: 'Return eager loaded lists', isComplete: true },
      { cardId: cards[3].id, title: 'Render drag overlay' },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
