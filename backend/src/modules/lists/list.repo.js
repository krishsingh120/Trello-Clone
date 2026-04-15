// Runs Prisma queries for list CRUD and ordering operations.
const prisma = require('../../config/db');

async function findBoardById(boardId) {
  return prisma.board.findUnique({
    where: { id: boardId },
  });
}

async function findListById(listId) {
  return prisma.list.findUnique({
    where: { id: listId },
  });
}

async function findListsByBoardId(boardId) {
  return prisma.list.findMany({
    where: { boardId },
    orderBy: { position: 'asc' },
  });
}

async function createList(data) {
  return prisma.list.create({
    data,
  });
}

async function updateList(listId, data) {
  return prisma.list.update({
    where: { id: listId },
    data,
  });
}

async function deleteList(listId) {
  return prisma.list.delete({
    where: { id: listId },
  });
}

async function reorderLists(orderedIds) {
  const operations = orderedIds.map((id, index) =>
    prisma.list.update({
      where: { id },
      data: { position: index },
    })
  );

  return prisma.$transaction(operations);
}

module.exports = {
  findBoardById,
  findListById,
  findListsByBoardId,
  createList,
  updateList,
  deleteList,
  reorderLists,
};
