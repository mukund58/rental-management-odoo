import { api } from './client';

export interface UserResponse {
  id: string; // Map your Guid here
  name: string;
  email: string;
  role: number; // Since Role maps to an integer in Postgres now
  profileImagePath: string | null;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  name: string;
  email: string;
  role: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  },
  // Added: Register method to match your C# AuthEndpoints.cs
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', { name, email, password });
    return response.data;
  },
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  },
  getMe: async (): Promise<UserResponse> => {
    const response = await api.get<UserResponse>('/auth/me');
    return response.data;
  }
};

