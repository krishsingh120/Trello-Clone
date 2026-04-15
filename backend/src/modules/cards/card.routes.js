// Declares card API routes for CRUD, drag actions, labels, checklist, and members.
const express = require('express');
const cardController = require('./card.controller');
const validate = require('../../middleware/validate');

const router = express.Router();

router.post('/cards', validate(['listId', 'title']), cardController.createCard);
router.patch('/cards/move', validate(['cardId', 'targetListId', 'targetPosition']), cardController.moveCard);
router.patch('/cards/reorder', validate(['listId', 'orderedIds']), cardController.reorderCards);
router.patch('/checklist/:itemId', cardController.toggleChecklistItem);
router.delete('/checklist/:itemId', cardController.deleteChecklistItem);
router.post('/cards/:cardId/labels/:labelId', cardController.addLabel);
router.delete('/cards/:cardId/labels/:labelId', cardController.removeLabel);
router.post('/cards/:cardId/checklist', validate(['title']), cardController.addChecklistItem);
router.post('/cards/:cardId/members/:memberId', cardController.assignMember);
router.delete('/cards/:cardId/members/:memberId', cardController.unassignMember);
router.get('/cards/:cardId', cardController.getCard);
router.patch('/cards/:cardId', cardController.updateCard);
router.delete('/cards/:cardId', cardController.deleteCard);

module.exports = router;
