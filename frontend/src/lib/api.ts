// =====================================================================
// CONFIGURACIÓN DE API — BACKEND FastAPI + PostgreSQL (pgAdmin)
// =====================================================================
// Cambiá esta URL por la de tu backend FastAPI cuando esté corriendo.
// Ejemplo: "http://localhost:8000" o "https://tu-api.com"
export const API_BASE_URL = "http://localhost:8000";

// Helper genérico para llamadas (descomentar y usar cuando conectes el backend)
// export async function api<T>(path: string, init?: RequestInit): Promise<T> {
//   const res = await fetch(`${API_BASE_URL}${path}`, {
//     ...init,
//     headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
//   });
//   if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
//   return res.json();
// }
