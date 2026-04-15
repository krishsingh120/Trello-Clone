// Runs Prisma queries for board reads and card search results.
const prisma = require('../../config/db');

async function findBoardWithDetails(boardId) {
  return prisma.board.findUnique({
    where: { id: boardId },
    include: {
      labels: true,
      lists: {
        orderBy: { position: 'asc' },
        include: {
          cards: {
            where: { isArchived: false },
            orderBy: { position: 'asc' },
            include: {
              labels: { include: { label: true } },
              members: { include: { member: true } },
              checklistItems: true,
            },
          },
        },
      },
    },
  });
}

async function searchBoardCards(boardId, filters) {
  return prisma.board.findUnique({
    where: { id: boardId },
    include: {
      labels: true,
      lists: {
        orderBy: { position: 'asc' },
        include: {
          cards: {
            where: {
              isArchived: false,
              ...filters,
            },
            orderBy: { position: 'asc' },
            include: {
              labels: { include: { label: true } },
              members: { include: { member: true } },
              checklistItems: true,
            },
          },
        },
      },
    },
  });
}

module.exports = {
  findBoardWithDetails,
  searchBoardCards,
};
