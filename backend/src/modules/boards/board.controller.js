// Handles HTTP requests for board reads and search results.
const boardService = require('./board.service');

async function getBoard(req, res, next) {
  try {
    const board = await boardService.getBoardWithDetails(req.params.boardId);
    res.json({ data: board });
  } catch (err) {
    next(err);
  }
}

async function searchBoard(req, res, next) {
  try {
    const board = await boardService.searchBoard(req.params.boardId, req.query);
    res.json({ data: board });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getBoard,
  searchBoard,
};
