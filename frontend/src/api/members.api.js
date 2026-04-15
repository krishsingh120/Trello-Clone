// Wraps member API requests used by the card detail sidebar.
import axiosInstance from './axiosInstance';

export async function getMembers() {
  const response = await axiosInstance.get('/members');
  return response.data;
}
