// Wraps card API requests for card details, DnD, labels, checklist, and members.
import axiosInstance from './axiosInstance';

export async function createCard(payload) {
  const response = await axiosInstance.post('/cards', payload);
  return response.data;
}

export async function getCard(cardId) {
  const response = await axiosInstance.get(`/cards/${cardId}`);
  return response.data;
}

export async function updateCard(cardId, payload) {
  const response = await axiosInstance.patch(`/cards/${cardId}`, payload);
  return response.data;
}

export async function deleteCard(cardId) {
  const response = await axiosInstance.delete(`/cards/${cardId}`);
  return response.data;
}

export async function moveCard(payload) {
  const response = await axiosInstance.patch('/cards/move', payload);
  return response.data;
}

export async function reorderCards(payload) {
  const response = await axiosInstance.patch('/cards/reorder', payload);
  return response.data;
}

export async function addLabelToCard(cardId, labelId) {
  const response = await axiosInstance.post(`/cards/${cardId}/labels/${labelId}`);
  return response.data;
}

export async function removeLabelFromCard(cardId, labelId) {
  const response = await axiosInstance.delete(`/cards/${cardId}/labels/${labelId}`);
  return response.data;
}

export async function addChecklistItem(cardId, payload) {
  const response = await axiosInstance.post(`/cards/${cardId}/checklist`, payload);
  return response.data;
}

export async function toggleChecklistItem(itemId) {
  const response = await axiosInstance.patch(`/checklist/${itemId}`);
  return response.data;
}

export async function deleteChecklistItem(itemId) {
  const response = await axiosInstance.delete(`/checklist/${itemId}`);
  return response.data;
}

export async function assignMember(cardId, memberId) {
  const response = await axiosInstance.post(`/cards/${cardId}/members/${memberId}`);
  return response.data;
}

export async function unassignMember(cardId, memberId) {
  const response = await axiosInstance.delete(`/cards/${cardId}/members/${memberId}`);
  return response.data;
}
