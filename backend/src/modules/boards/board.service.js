// Handles board retrieval and search business logic.
const boardRepo = require('./board.repo');
const NotFoundError = require('../../errors/NotFoundError');
const ValidationError = require('../../errors/ValidationError');

async function getBoardWithDetails(boardId) {
  const parsedBoardId = parseInt(boardId, 10);
  const board = await boardRepo.findBoardWithDetails(parsedBoardId);

  if (!board) {
    throw new NotFoundError('Board not found');
  }

  return board;
}

async function searchBoard(boardId, query) {
  const parsedBoardId = parseInt(boardId, 10);
  const filters = {};

  if (query.q) {
    filters.title = {
      contains: query.q.trim(),
    };
  }

  if (query.labelId) {
    filters.labels = {
      some: {
        labelId: parseInt(query.labelId, 10),
      },
    };
  }

  if (query.memberId) {
    filters.members = {
      some: {
        memberId: parseInt(query.memberId, 10),
      },
    };
  }

  if (query.dueBefore) {
    const dueBeforeDate = new Date(query.dueBefore);

    if (Number.isNaN(dueBeforeDate.getTime())) {
      throw new ValidationError('dueBefore must be a valid date');
    }

    dueBeforeDate.setHours(23, 59, 59, 999);
    filters.dueDate = {
      lte: dueBeforeDate,
    };
  }

  const board = await boardRepo.searchBoardCards(parsedBoardId, filters);

  if (!board) {
    throw new NotFoundError('Board not found');
  }

  return board;
}

module.exports = {
  getBoardWithDetails,
  searchBoard,
};
