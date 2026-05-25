// =====================================================================
// CONFIGURACIÓN DE API — BACKEND FastAPI + PostgreSQL (pgAdmin)
// =====================================================================
// Cambiá esta URL por la de tu backend FastAPI cuando esté corriendo.
// Ejemplo: "http://localhost:8000" o "https://tu-api.com"
export const API_BASE_URL = "http://localhost:8000";

// Axios-based API helper with token handling.
// Requires installing axios: `npm install axios` or `pnpm add axios`.
import axios from "axios";

export const api = axios.create({
	baseURL: API_BASE_URL,
	headers: { "Content-Type": "application/json" },
});

const TOKEN_KEY = "rappi_token";

export function setAuthToken(token: string | null) {
	if (token) {
		localStorage.setItem(TOKEN_KEY, token);
		api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	} else {
		localStorage.removeItem(TOKEN_KEY);
		delete api.defaults.headers.common["Authorization"];
	}
}

export function getAuthToken(): string | null {
	return localStorage.getItem(TOKEN_KEY);
}

// Initialize from storage if present
const existing = getAuthToken();
if (existing) api.defaults.headers.common["Authorization"] = `Bearer ${existing}`;

export default api;
