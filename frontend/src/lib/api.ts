// =====================================================================
// CONFIGURACIÓN DE API — BACKEND FastAPI + PostgreSQL (pgAdmin)
// =====================================================================
// Cambiá esta URL por la de tu backend FastAPI cuando esté corriendo.
// Ejemplo: "http://localhost:8000" o "https://tu-api.com"
// Use relative `/api` in production (served behind nginx), otherwise localhost backend in dev.
export const API_BASE_URL = import.meta.env && import.meta.env.PROD ? "/api" : "http://localhost:8000";

// Axios-based API helper with token handling.
// Requires installing axios: `npm install axios` or `pnpm add axios`.
import axios from "axios";

export const api = axios.create({
	baseURL: API_BASE_URL,
	headers: { "Content-Type": "application/json" },
});

const TOKEN_KEY = "rappi_token";

export function setAuthToken(token: string | null) {
	// Avoid touching localStorage when running in SSR/dev runner (no window/localStorage)
	if (typeof localStorage === "undefined") {
		if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		else delete api.defaults.headers.common["Authorization"];
		return;
	}

	if (token) {
		localStorage.setItem(TOKEN_KEY, token);
		api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	} else {
		localStorage.removeItem(TOKEN_KEY);
		delete api.defaults.headers.common["Authorization"];
	}
}

export function getAuthToken(): string | null {
	if (typeof localStorage === "undefined") return null;
	return localStorage.getItem(TOKEN_KEY);
}

// Initialize from storage if present
if (typeof localStorage !== "undefined") {
	const existing = getAuthToken();
	if (existing) api.defaults.headers.common["Authorization"] = `Bearer ${existing}`;
}

export default api;
