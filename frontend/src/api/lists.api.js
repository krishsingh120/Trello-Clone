// Wraps list API requests for create, update, delete, and reorder actions.
import axiosInstance from './axiosInstance';

export async function createList(payload) {
  const response = await axiosInstance.post('/lists', payload);
  return response.data;
}

export async function updateList(listId, payload) {
  const response = await axiosInstance.patch(`/lists/${listId}`, payload);
  return response.data;
}

export async function deleteList(listId) {
  const response = await axiosInstance.delete(`/lists/${listId}`);
  return response.data;
}

export async function reorderLists(payload) {
  const response = await axiosInstance.patch('/lists/reorder', payload);
  return response.data;
}
