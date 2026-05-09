import api from './api';

// Send a message
export const sendMessage = async ({ receiver, content, tourId }) => {
  const res = await api.post('/messages', { receiver, content, tourId });
  return res.data;
};

// Get messages between users (optionally for a tour)
export const getMessages = async ({ userId, tourId }) => {
  const params = { userId };
  if (tourId) params.tourId = tourId;
  const res = await api.get('/messages', { params });
  return res.data;
};
