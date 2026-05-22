// =====================================================================
// CONFIGURACIÓN DE API — BACKEND FastAPI + PostgreSQL (pgAdmin)
// =====================================================================
// Cambiá esta URL por la de tu backend FastAPI cuando esté corriendo.
// Ejemplo: "http://localhost:8000" o "https://tu-api.com"
export const API_BASE_URL = "http://localhost:8000";

// Axios-based API helper with token handling.
// Requires installing axios: `npm install axios` or `pnpm add axios`.
import axios from "axios";
import { toast } from "sonner";

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

// Global response interceptor to show user-friendly errors
api.interceptors.response.use(
	(response) => response,
	(error) => {
		const resp = error?.response;
		if (!resp) {
			toast.error("No se pudo conectar al servidor");
		} else if (resp.status === 401) {
			// unauthorized — clear token and notify
			setAuthToken(null);
			toast.error("Sesión expirada. Inicia sesión nuevamente.");
		} else if (resp.data && resp.data.detail) {
			toast.error(resp.data.detail);
		} else if (resp.data && resp.data.message) {
			toast.error(resp.data.message);
		} else {
			toast.error("Ocurrió un error en la petición");
		}
		return Promise.reject(error);
	},
);

export default api;
