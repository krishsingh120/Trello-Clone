// Handles card business rules for CRUD, ordering, labels, checklist, and members.
const cardRepo = require('./card.repo');
const NotFoundError = require('../../errors/NotFoundError');
const ValidationError = require('../../errors/ValidationError');
const ConflictError = require('../../errors/ConflictError');

async function createCard(payload) {
  const listId = parseInt(payload.listId, 10);
  const title = payload.title?.trim();
  const list = await cardRepo.findListById(listId);

  if (!list) {
    throw new NotFoundError('List not found');
  }

  if (!title) {
    throw new ValidationError('title is required');
  }

  const cards = await cardRepo.findCardsByListId(listId);
  const nextPosition = cards.length ? cards[cards.length - 1].position + 1 : 0;

  return cardRepo.createCard({
    listId,
    title,
    description: payload.description || '',
    position: nextPosition,
  });
}

async function getCard(cardId) {
  const parsedCardId = parseInt(cardId, 10);
  const card = await cardRepo.findCardById(parsedCardId);

  if (!card) {
    throw new NotFoundError('Card not found');
  }

  return card;
}

async function updateCard(cardId, payload) {
  const parsedCardId = parseInt(cardId, 10);
  const card = await cardRepo.findCardById(parsedCardId);

  if (!card) {
    throw new NotFoundError('Card not found');
  }

  const data = {};

  ['title', 'description', 'isArchived'].forEach((field) => {
    if (payload[field] !== undefined) {
      data[field] = payload[field];
    }
  });

  if (payload.title !== undefined) {
    data.title = payload.title.trim();

    if (!data.title) {
      throw new ValidationError('title cannot be empty');
    }
  }

  if (payload.dueDate !== undefined) {
    data.dueDate = payload.dueDate ? new Date(payload.dueDate) : null;
  }

  if (data.dueDate && Number.isNaN(data.dueDate.getTime())) {
    throw new ValidationError('dueDate must be a valid date');
  }

  return cardRepo.updateCard(parsedCardId, data);
}

async function deleteCard(cardId) {
  const parsedCardId = parseInt(cardId, 10);
  const card = await cardRepo.findCardById(parsedCardId);

  if (!card) {
    throw new NotFoundError('Card not found');
  }

  await cardRepo.deleteCard(parsedCardId);
  return { success: true };
}

async function reorderCards(payload) {
  const listId = parseInt(payload.listId, 10);
  const cards = await cardRepo.findCardsByListId(listId);
  const orderedIds = payload.orderedIds.map((id) => parseInt(id, 10));
  const existingIds = cards.map((card) => card.id);

  if (cards.length !== orderedIds.length) {
    throw new ValidationError('orderedIds must include all cards in the list');
  }

  const isValidOrder = orderedIds.every((id) => existingIds.includes(id));
  if (!isValidOrder) {
    throw new ValidationError('orderedIds contains invalid card ids');
  }

  await cardRepo.reorderCardsInList(listId, orderedIds);
  return cardRepo.findCardsByListId(listId);
}

async function moveCard(payload) {
  const cardId = parseInt(payload.cardId, 10);
  const targetListId = parseInt(payload.targetListId, 10);
  const targetPosition = parseInt(payload.targetPosition, 10);
  const card = await cardRepo.findCardById(cardId);

  if (!card) {
    throw new NotFoundError('Card not found');
  }

  const targetList = await cardRepo.findListById(targetListId);
  if (!targetList) {
    throw new NotFoundError('Target list not found');
  }

  const sourceListId = card.listId;
  const sourceCards = await cardRepo.findCardsByListId(sourceListId);
  const targetCards = sourceListId === targetListId ? sourceCards : await cardRepo.findCardsByListId(targetListId);

  if (targetPosition < 0 || targetPosition > targetCards.length) {
    throw new ValidationError('targetPosition is out of range');
  }

  if (sourceListId === targetListId) {
    const orderedIds = sourceCards
      .map((item) => item.id)
      .filter((id) => id !== cardId);

    orderedIds.splice(targetPosition, 0, cardId);
    await cardRepo.reorderCardsInList(targetListId, orderedIds);
    return cardRepo.findCardById(cardId);
  }

  const sourceIds = sourceCards
    .map((item) => item.id)
    .filter((id) => id !== cardId);
  const targetIds = targetCards.map((item) => item.id);

  targetIds.splice(targetPosition, 0, cardId);

  return cardRepo.moveCard(cardId, sourceListId, targetListId, targetPosition, sourceIds, targetIds);
}

async function addLabel(cardId, labelId) {
  const parsedCardId = parseInt(cardId, 10);
  const parsedLabelId = parseInt(labelId, 10);
  const [card, label, existingLink] = await Promise.all([
    cardRepo.findCardById(parsedCardId),
    cardRepo.findLabelById(parsedLabelId),
    cardRepo.findCardLabel(parsedCardId, parsedLabelId),
  ]);

  if (!card) {
    throw new NotFoundError('Card not found');
  }

  if (!label) {
    throw new NotFoundError('Label not found');
  }

  if (existingLink) {
    throw new ConflictError('Label already assigned to card');
  }

  return cardRepo.addLabelToCard(parsedCardId, parsedLabelId);
}

async function removeLabel(cardId, labelId) {
  const parsedCardId = parseInt(cardId, 10);
  const parsedLabelId = parseInt(labelId, 10);
  const existingLink = await cardRepo.findCardLabel(parsedCardId, parsedLabelId);

  if (!existingLink) {
    throw new NotFoundError('Card label link not found');
  }

  await cardRepo.removeLabelFromCard(parsedCardId, parsedLabelId);
  return { success: true };
}

async function addChecklistItem(cardId, payload) {
  const parsedCardId = parseInt(cardId, 10);
  const title = payload.title?.trim();
  const card = await cardRepo.findCardById(parsedCardId);

  if (!card) {
    throw new NotFoundError('Card not found');
  }

  if (!title) {
    throw new ValidationError('title is required');
  }

  return cardRepo.addChecklistItem(parsedCardId, title);
}

async function toggleChecklistItem(itemId) {
  const parsedItemId = parseInt(itemId, 10);
  const item = await cardRepo.findChecklistItemById(parsedItemId);

  if (!item) {
    throw new NotFoundError('Checklist item not found');
  }

  return cardRepo.updateChecklistItem(parsedItemId, {
    isComplete: !item.isComplete,
  });
}

async function deleteChecklistItem(itemId) {
  const parsedItemId = parseInt(itemId, 10);
  const item = await cardRepo.findChecklistItemById(parsedItemId);

  if (!item) {
    throw new NotFoundError('Checklist item not found');
  }

  await cardRepo.deleteChecklistItem(parsedItemId);
  return { success: true };
}

async function assignMember(cardId, memberId) {
  const parsedCardId = parseInt(cardId, 10);
  const parsedMemberId = parseInt(memberId, 10);
  const [card, member, existingLink] = await Promise.all([
    cardRepo.findCardById(parsedCardId),
    cardRepo.findMemberById(parsedMemberId),
    cardRepo.findCardMember(parsedCardId, parsedMemberId),
  ]);

  if (!card) {
    throw new NotFoundError('Card not found');
  }

  if (!member) {
    throw new NotFoundError('Member not found');
  }

  if (existingLink) {
    throw new ConflictError('Member already assigned to card');
  }

  return cardRepo.assignMember(parsedCardId, parsedMemberId);
}

async function unassignMember(cardId, memberId) {
  const parsedCardId = parseInt(cardId, 10);
  const parsedMemberId = parseInt(memberId, 10);
  const existingLink = await cardRepo.findCardMember(parsedCardId, parsedMemberId);

  if (!existingLink) {
    throw new NotFoundError('Card member link not found');
  }

  await cardRepo.unassignMember(parsedCardId, parsedMemberId);
  return { success: true };
}

module.exports = {
  createCard,
  getCard,
  updateCard,
  deleteCard,
  reorderCards,
  moveCard,
  addLabel,
  removeLabel,
  addChecklistItem,
  toggleChecklistItem,
  deleteChecklistItem,
  assignMember,
  unassignMember,
};
