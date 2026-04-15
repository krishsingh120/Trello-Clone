// Wraps board API requests for board details and search filters.
import axiosInstance from './axiosInstance';

export async function getBoard(boardId) {
  const response = await axiosInstance.get(`/boards/${boardId}`);
  return response.data;
}

export async function searchBoard(boardId, params) {
  const response = await axiosInstance.get(`/boards/${boardId}/search`, { params });
  return response.data;
}
