// Declares list API routes for CRUD and bulk reordering.
const express = require('express');
const listController = require('./list.controller');
const validate = require('../../middleware/validate');

const router = express.Router();

router.post('/', validate(['boardId', 'title']), listController.createList);
router.patch('/reorder', validate(['boardId', 'orderedIds']), listController.reorderLists);
router.patch('/:listId', validate(['title']), listController.updateList);
router.delete('/:listId', listController.deleteList);

module.exports = router;
