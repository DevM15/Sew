import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const createRoom = async () => {
  const response = await api.post('/rooms');
  return response.data;
};

export const getFiles = async (roomCode) => {
  const response = await api.get(`/rooms/${roomCode}/files`);
  return response.data;
};

export const uploadFiles = async (roomCode, formData, onProgress) => {
  const response = await api.post(`/rooms/${roomCode}/files`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgress(percentCompleted);
    },
  });
  return response.data;
};

export const deleteFile = async (roomCode, fileId) => {
  const response = await api.delete(`/rooms/${roomCode}/files/${fileId}`);
  return response.data;
};