// Declares board API routes for fetching board data and search results.
const express = require('express');
const boardController = require('./board.controller');

const router = express.Router();

router.get('/:boardId/search', boardController.searchBoard);
router.get('/:boardId', boardController.getBoard);

module.exports = router;
