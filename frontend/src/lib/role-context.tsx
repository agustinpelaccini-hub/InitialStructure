import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// =====================================================================
// ROLES — sesión mock en localStorage.
// Cuando conectes FastAPI, reemplazá esto por el JWT/usuario real:
//   GET  /auth/me              -> { id, nombre, rol, entidad_id }
//   POST /auth/login           -> body { email, password } -> { token, rol, entidad_id }
//   POST /auth/logout
// El campo `entidad_id` se interpreta según el rol:
//   - cliente      -> clientes.id
//   - repartidor   -> repartidores.id
//   - restaurante  -> restaurantes.id  (dueño del local)
//   - admin        -> null
// =====================================================================

export type Role = "admin" | "cliente" | "repartidor" | "restaurante";

export interface Session {
  rol: Role;
  entidad_id: number | null;
  nombre: string;
}

interface RoleCtx {
  session: Session | null;
  login: (s: Session) => void;
  logout: () => void;
}

const Ctx = createContext<RoleCtx | null>(null);
const KEY = "rappi_session";

export function RoleProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    try {
      if (typeof localStorage !== "undefined") {
        const raw = localStorage.getItem(KEY);
        if (raw) setSession(JSON.parse(raw));
      }
    } catch {}
  }, []);

  const login = (s: Session) => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(KEY, JSON.stringify(s));
    }
    setSession(s);
  };
  const logout = () => {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(KEY);
    }
    setSession(null);
  };

  return <Ctx.Provider value={{ session, login, logout }}>{children}</Ctx.Provider>;
}

export function useRole() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useRole fuera de RoleProvider");
  return v;
}
