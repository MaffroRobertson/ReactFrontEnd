import { API_BASE_URL } from '../../config/api';

let authToken = null;

export const getAuthToken = () => authToken;
export const setAuthToken = (token) => {
  authToken = token;
};
export const clearAuthToken = () => {
  authToken = null;
};

const normalizeUrl = (pathOrUrl) => {
  const isAbsolute = /^https?:\/\//i.test(pathOrUrl);
  if (isAbsolute) return pathOrUrl;
  if (pathOrUrl.startsWith('/')) return `${API_BASE_URL}${pathOrUrl}`;
  return `${API_BASE_URL}/${pathOrUrl}`;
};

const buildHeaders = (headers = {}, needsAuth = false) => {
  const merged = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (needsAuth) {
    if (!authToken) {
      throw new Error('No authentication token available. Please login first.');
    }
    merged.Authorization = `Bearer ${authToken}`;
  }

  return merged;
};

export async function request(pathOrUrl, { auth = false, headers, ...options } = {}) {
  const url = normalizeUrl(pathOrUrl);
  const response = await fetch(url, {
    ...options,
    headers: buildHeaders(headers, auth),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication failed. Please login again.');
    }
    const message = response.statusText || 'Request failed';
    throw new Error(`Request failed: ${response.status} ${message}`);
  }

  return response;
}

export async function requestJson(pathOrUrl, options = {}) {
  const response = await request(pathOrUrl, options);
  const contentType = response.headers.get('content-type');

  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  return null;
}
