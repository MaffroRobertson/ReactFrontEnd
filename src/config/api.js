// API Configuration
// Default: relative base so Vite dev proxy can avoid CORS; override with VITE_API_URL for deployed environments
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const withBase = (path) => {
  const trimmed = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${trimmed}`;
};

export const API_ENDPOINTS = {
  login: withBase('/login'),
  dives: withBase('/dives'),
  diveSites: withBase('/divesites'),
  experienceLevels: withBase('/experiencelevels')
};
