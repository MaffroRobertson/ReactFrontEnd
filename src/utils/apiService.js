// API Service for handling all API interactions with authentication

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

let authToken = null;

/**
 * Login function to authenticate and retrieve a token
 * @returns {Promise<string>} The authentication token
 * @throws {Error} If login fails
 */
export async function login() {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testUser',
        password: 'testPassword',
      }),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.token) {
      throw new Error('Login response did not contain a token');
    }

    authToken = data.token;
    return authToken;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(`Failed to login: ${error.message}`);
  }
}

/**
 * Helper function to create authenticated fetch requests
 * @param {string} endpoint - The API endpoint to call
 * @param {object} options - Fetch options
 * @returns {Promise<Response>} The fetch response
 * @throws {Error} If token is missing or fetch fails
 */
async function authenticatedFetch(endpoint, options = {}) {
  if (!authToken) {
    throw new Error('No authentication token available. Please login first.');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication failed. Please login again.');
    }
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return response;
}

/**
 * Fetch all dives with authentication
 * @returns {Promise<Array>} Array of dive objects
 * @throws {Error} If fetching fails or token is missing
 */
export async function fetchDives() {
  try {
    const response = await authenticatedFetch('/dives');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching dives:', error);
    throw new Error(`Failed to fetch dives: ${error.message}`);
  }
}

/**
 * Fetch all dive sites with authentication
 * @returns {Promise<Array>} Array of dive site objects
 * @throws {Error} If fetching fails or token is missing
 */
export async function fetchDiveSites() {
  try {
    const response = await authenticatedFetch('/diveSites');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching dive sites:', error);
    throw new Error(`Failed to fetch dive sites: ${error.message}`);
  }
}

/**
 * Get the current authentication token
 * @returns {string|null} The current token or null if not authenticated
 */
export function getAuthToken() {
  return authToken;
}

/**
 * Clear the authentication token (for logout)
 */
export function clearAuthToken() {
  authToken = null;
}
