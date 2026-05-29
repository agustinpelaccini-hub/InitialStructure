import axios, { type AxiosError } from "axios";

/** Solo en el navegador; en SSR no hay window. */
export const isBrowser = typeof window !== "undefined";

/**
 * URL directa del backend para evitar problemas con el proxy en Docker.
 * El backend corre en localhost:8000.
 */
export const API_BASE_URL = "http://localhost:8000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

const TOKEN_KEY = "rappi_token";

export function setAuthToken(token: string | null) {
  if (!isBrowser) {
    if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
    else delete api.defaults.headers.common.Authorization;
    return;
  }

  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.common.Authorization;
  }
}

export function getAuthToken(): string | null {
  if (!isBrowser) return null;
  return localStorage.getItem(TOKEN_KEY);
}

if (isBrowser) {
  const existing = getAuthToken();
  if (existing) api.defaults.headers.common.Authorization = `Bearer ${existing}`;
}

/** Mensaje legible desde respuesta FastAPI { message } o red caída. */
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const ax = error as AxiosError<{ message?: string; detail?: string | unknown }>;
    if (!ax.response) {
      return "No se pudo conectar con el servidor. ¿Está corriendo el backend en el puerto 8000?";
    }
    const data = ax.response.data;
    if (data && typeof data === "object") {
      if ("message" in data && typeof data.message === "string") return data.message;
      if ("detail" in data) {
        if (typeof data.detail === "string") return data.detail;
        if (Array.isArray(data.detail)) {
          return data.detail.map((d: { msg?: string }) => d.msg ?? JSON.stringify(d)).join(", ");
        }
      }
    }
    return `Error ${ax.response.status}`;
  }
  if (error instanceof Error) return error.message;
  return "Error desconocido";
}

export function alertApiError(error: unknown) {
  if (isBrowser) alert(getApiErrorMessage(error));
}

export default api;
