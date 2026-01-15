import { API_ENDPOINTS } from '../../config/api';
import { setAuthToken, clearAuthToken, getAuthToken } from './client';

const DEFAULT_CREDENTIALS = {
  username: 'testUser',
  password: 'testPassword',
};

export async function login(credentials = DEFAULT_CREDENTIALS) {
  const response = await fetch(API_ENDPOINTS.login, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.token) {
    throw new Error('Login response did not contain a token');
  }

  setAuthToken(data.token);
  return data.token;
}

export const logout = () => clearAuthToken();
export { getAuthToken };
