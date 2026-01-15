import { API_ENDPOINTS } from '../../config/api';
import { requestJson } from './client';

export const fetchDives = () => requestJson(API_ENDPOINTS.dives, { auth: true });
export const fetchDiveSites = () => requestJson(API_ENDPOINTS.diveSites, { auth: true });
