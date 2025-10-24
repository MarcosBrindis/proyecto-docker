import axios from 'axios';
import { User } from '../types/User';

const API_URL = `http://${window.location.hostname}:5000/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Endpoint personalizado de Brindis
  getBrindisInfo: async () => {
    const response = await api.get('/brindis');
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  // CRUD de usuarios
  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },

  createUser: async (user: User): Promise<User> => {
    const response = await api.post('/users', user);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};