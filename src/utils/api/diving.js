import { API_ENDPOINTS } from '../../config/api';
import { requestJson } from './client';

export const fetchDives = () => requestJson(API_ENDPOINTS.dives, { auth: true });
export const fetchDiveSites = () => requestJson(API_ENDPOINTS.diveSites, { auth: true });
export const fetchExperienceLevels = () => requestJson(API_ENDPOINTS.experienceLevels, { auth: true });
export const createDiveSite = (payload) =>
	requestJson(API_ENDPOINTS.diveSites, {
		method: 'POST',
		body: JSON.stringify(payload),
		auth: true,
	});
export const createDive = (payload) =>
	requestJson(API_ENDPOINTS.dives, {
		method: 'POST',
		body: JSON.stringify(payload),
		auth: true,
	});