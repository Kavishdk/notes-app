import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// ---- Auth API ----
export interface User {
  id: number;
  username: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const registerUser = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', { username, password });
  return response.data;
};

export const loginUser = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

// ---- Notes API ----
export interface Note {
  id: number;
  title: string;
  content: string;
  user_id: number;
  updated_at: string;
}

export const getNotes = async (search?: string): Promise<Note[]> => {
  const params = search ? { search } : {};
  const response = await api.get('/notes', { params });
  return response.data;
};

export const getNoteById = async (id: number): Promise<Note> => {
  const response = await api.get(`/notes/${id}`);
  return response.data;
};

export const createNote = async (note: Omit<Note, 'id' | 'updated_at' | 'user_id'>): Promise<Note> => {
  const response = await api.post('/notes', note);
  return response.data;
};

export const updateNote = async (id: number, note: Omit<Note, 'id' | 'updated_at' | 'user_id'>): Promise<Note> => {
  const response = await api.put(`/notes/${id}`, note);
  return response.data;
};

export const deleteNote = async (id: number): Promise<void> => {
  await api.delete(`/notes/${id}`);
};
