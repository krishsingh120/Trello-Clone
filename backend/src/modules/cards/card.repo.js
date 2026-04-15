// Runs Prisma queries for cards, labels, checklist items, and card members.
const prisma = require('../../config/db');

async function findListById(listId) {
  return prisma.list.findUnique({
    where: { id: listId },
  });
}

async function findCardById(cardId) {
  return prisma.card.findUnique({
    where: { id: cardId },
    include: {
      labels: { include: { label: true } },
      members: { include: { member: true } },
      checklistItems: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });
}

async function findCardsByListId(listId) {
  return prisma.card.findMany({
    where: {
      listId,
      isArchived: false,
    },
    orderBy: { position: 'asc' },
  });
}

async function createCard(data) {
  return prisma.card.create({
    data,
  });
}

async function updateCard(cardId, data) {
  return prisma.card.update({
    where: { id: cardId },
    data,
    include: {
      labels: { include: { label: true } },
      members: { include: { member: true } },
      checklistItems: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });
}

async function deleteCard(cardId) {
  return prisma.card.delete({
    where: { id: cardId },
  });
}

async function reorderCardsInList(listId, orderedIds) {
  const operations = orderedIds.map((id, index) =>
    prisma.card.update({
      where: { id },
      data: { listId, position: index },
    })
  );

  return prisma.$transaction(operations);
}

async function moveCard(cardId, sourceListId, targetListId, targetPosition, sourceIds, targetIds) {
  const sourceOps = sourceIds.map((id, index) =>
    prisma.card.update({
      where: { id },
      data: { position: index, listId: sourceListId },
    })
  );

  const targetOps = targetIds.map((id, index) =>
    prisma.card.update({
      where: { id },
      data: {
        listId: targetListId,
        position: index,
      },
    })
  );

  await prisma.$transaction([...sourceOps, ...targetOps]);

  return prisma.card.findUnique({
    where: { id: cardId },
    include: {
      labels: { include: { label: true } },
      members: { include: { member: true } },
      checklistItems: true,
    },
  });
}

async function findLabelById(labelId) {
  return prisma.label.findUnique({
    where: { id: labelId },
  });
}

async function findCardLabel(cardId, labelId) {
  return prisma.cardLabel.findUnique({
    where: {
      cardId_labelId: {
        cardId,
        labelId,
      },
    },
  });
}

async function addLabelToCard(cardId, labelId) {
  return prisma.cardLabel.create({
    data: {
      cardId,
      labelId,
    },
    include: {
      label: true,
    },
  });
}

async function removeLabelFromCard(cardId, labelId) {
  return prisma.cardLabel.delete({
    where: {
      cardId_labelId: {
        cardId,
        labelId,
      },
    },
  });
}

async function addChecklistItem(cardId, title) {
  return prisma.checklistItem.create({
    data: {
      cardId,
      title,
    },
  });
}

async function findChecklistItemById(itemId) {
  return prisma.checklistItem.findUnique({
    where: { id: itemId },
  });
}

async function updateChecklistItem(itemId, data) {
  return prisma.checklistItem.update({
    where: { id: itemId },
    data,
  });
}

async function deleteChecklistItem(itemId) {
  return prisma.checklistItem.delete({
    where: { id: itemId },
  });
}

async function findMemberById(memberId) {
  return prisma.member.findUnique({
    where: { id: memberId },
  });
}

async function findCardMember(cardId, memberId) {
  return prisma.cardMember.findUnique({
    where: {
      cardId_memberId: {
        cardId,
        memberId,
      },
    },
  });
}

async function assignMember(cardId, memberId) {
  return prisma.cardMember.create({
    data: {
      cardId,
      memberId,
    },
    include: {
      member: true,
    },
  });
}

async function unassignMember(cardId, memberId) {
  return prisma.cardMember.delete({
    where: {
      cardId_memberId: {
        cardId,
        memberId,
      },
    },
  });
}

module.exports = {
  findListById,
  findCardById,
  findCardsByListId,
  createCard,
  updateCard,
  deleteCard,
  reorderCardsInList,
  moveCard,
  findLabelById,
  findCardLabel,
  addLabelToCard,
  removeLabelFromCard,
  addChecklistItem,
  findChecklistItemById,
  updateChecklistItem,
  deleteChecklistItem,
  findMemberById,
  findCardMember,
  assignMember,
  unassignMember,
};
