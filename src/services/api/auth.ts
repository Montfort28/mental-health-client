import { client } from './client';
import { User, AuthResponse } from '../../types/user';

const TOKEN_KEY = 'auth_token';

export const setAuthToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);

export const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  delete client.defaults.headers.common['Authorization'];
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const { data } = await client.post<AuthResponse>('/auth/login', { email, password });
    setAuthToken(data.token);
    return data.user;
  } catch (error) {
    throw new Error('Invalid email or password');
  }
};

export const registerUser = async (name: string, email: string, password: string): Promise<User> => {
  try {
    const { data } = await client.post<AuthResponse>('/auth/register', {
      name,
      email,
      password,
    });
    setAuthToken(data.token);
    return data.user;
  } catch (error) {
    throw new Error('Failed to create account. Please try again.');
  }
};

export const logoutUser = async () => {
  try {
    await client.post('/auth/logout');
    removeAuthToken();
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const token = getAuthToken();
    if (!token) {
      return null;
    }

    client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const { data } = await client.get<{ user: User }>('/auth/me');
    return data.user;
  } catch (error) {
    removeAuthToken();
    return null;
  }
};