// Handles list business rules, creation, updates, deletion, and reordering.
const listRepo = require('./list.repo');
const NotFoundError = require('../../errors/NotFoundError');
const ValidationError = require('../../errors/ValidationError');

async function createList(payload) {
  const boardId = parseInt(payload.boardId, 10);
  const title = payload.title?.trim();
  const board = await listRepo.findBoardById(boardId);

  if (!board) {
    throw new NotFoundError('Board not found');
  }

  if (!title) {
    throw new ValidationError('title is required');
  }

  const lists = await listRepo.findListsByBoardId(boardId);
  const nextPosition = lists.length ? lists[lists.length - 1].position + 1 : 0;

  return listRepo.createList({
    boardId,
    title,
    position: nextPosition,
  });
}

async function updateList(listId, payload) {
  const parsedListId = parseInt(listId, 10);
  const title = payload.title?.trim();
  const list = await listRepo.findListById(parsedListId);

  if (!list) {
    throw new NotFoundError('List not found');
  }

  if (!title) {
    throw new ValidationError('title is required');
  }

  return listRepo.updateList(parsedListId, { title });
}

async function deleteList(listId) {
  const parsedListId = parseInt(listId, 10);
  const list = await listRepo.findListById(parsedListId);

  if (!list) {
    throw new NotFoundError('List not found');
  }

  await listRepo.deleteList(parsedListId);
  return { success: true };
}

async function reorderLists(payload) {
  const boardId = parseInt(payload.boardId, 10);
  const lists = await listRepo.findListsByBoardId(boardId);
  const existingIds = lists.map((list) => list.id);
  const orderedIds = payload.orderedIds.map((id) => parseInt(id, 10));

  if (lists.length !== orderedIds.length) {
    throw new ValidationError('orderedIds must include all lists for the board');
  }

  const isValidOrder = orderedIds.every((id) => existingIds.includes(id));
  if (!isValidOrder) {
    throw new ValidationError('orderedIds contains invalid list ids');
  }

  await listRepo.reorderLists(orderedIds);
  return listRepo.findListsByBoardId(boardId);
}

module.exports = {
  createList,
  updateList,
  deleteList,
  reorderLists,
};
