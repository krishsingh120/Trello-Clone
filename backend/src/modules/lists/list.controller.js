// Handles HTTP requests for list CRUD and reorder operations.
const listService = require('./list.service');

async function createList(req, res, next) {
  try {
    const list = await listService.createList(req.body);
    res.status(201).json({ data: list });
  } catch (err) {
    next(err);
  }
}

async function updateList(req, res, next) {
  try {
    const list = await listService.updateList(req.params.listId, req.body);
    res.json({ data: list });
  } catch (err) {
    next(err);
  }
}

async function deleteList(req, res, next) {
  try {
    const result = await listService.deleteList(req.params.listId);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}

async function reorderLists(req, res, next) {
  try {
    const lists = await listService.reorderLists(req.body);
    res.json({ data: lists });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createList,
  updateList,
  deleteList,
  reorderLists,
};
