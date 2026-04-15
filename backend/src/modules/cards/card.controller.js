// Handles HTTP requests for card, label, checklist, and member actions.
const cardService = require('./card.service');

async function createCard(req, res, next) {
  try {
    const card = await cardService.createCard(req.body);
    res.status(201).json({ data: card });
  } catch (err) {
    next(err);
  }
}

async function getCard(req, res, next) {
  try {
    const card = await cardService.getCard(req.params.cardId);
    res.json({ data: card });
  } catch (err) {
    next(err);
  }
}

async function updateCard(req, res, next) {
  try {
    const card = await cardService.updateCard(req.params.cardId, req.body);
    res.json({ data: card });
  } catch (err) {
    next(err);
  }
}

async function deleteCard(req, res, next) {
  try {
    const result = await cardService.deleteCard(req.params.cardId);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}

async function moveCard(req, res, next) {
  try {
    const card = await cardService.moveCard(req.body);
    res.json({ data: card });
  } catch (err) {
    next(err);
  }
}

async function reorderCards(req, res, next) {
  try {
    const cards = await cardService.reorderCards(req.body);
    res.json({ data: cards });
  } catch (err) {
    next(err);
  }
}

async function addLabel(req, res, next) {
  try {
    const result = await cardService.addLabel(req.params.cardId, req.params.labelId);
    res.status(201).json({ data: result });
  } catch (err) {
    next(err);
  }
}

async function removeLabel(req, res, next) {
  try {
    const result = await cardService.removeLabel(req.params.cardId, req.params.labelId);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}

async function addChecklistItem(req, res, next) {
  try {
    const item = await cardService.addChecklistItem(req.params.cardId, req.body);
    res.status(201).json({ data: item });
  } catch (err) {
    next(err);
  }
}

async function toggleChecklistItem(req, res, next) {
  try {
    const item = await cardService.toggleChecklistItem(req.params.itemId);
    res.json({ data: item });
  } catch (err) {
    next(err);
  }
}

async function deleteChecklistItem(req, res, next) {
  try {
    const result = await cardService.deleteChecklistItem(req.params.itemId);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}

async function assignMember(req, res, next) {
  try {
    const result = await cardService.assignMember(req.params.cardId, req.params.memberId);
    res.status(201).json({ data: result });
  } catch (err) {
    next(err);
  }
}

async function unassignMember(req, res, next) {
  try {
    const result = await cardService.unassignMember(req.params.cardId, req.params.memberId);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createCard,
  getCard,
  updateCard,
  deleteCard,
  moveCard,
  reorderCards,
  addLabel,
  removeLabel,
  addChecklistItem,
  toggleChecklistItem,
  deleteChecklistItem,
  assignMember,
  unassignMember,
};
