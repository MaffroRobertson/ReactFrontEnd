// API Configuration
// You can override this with an environment variable if needed
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5093';

export const API_ENDPOINTS = {
  dives: `${API_BASE_URL}/dives`,
  diveSites: `${API_BASE_URL}/divesites`,
};
