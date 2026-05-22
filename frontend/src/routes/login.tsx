import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRole, type Role } from "@/lib/role-context";
import { setAuthToken } from "@/lib/api";
import { mockClientes, mockRepartidores, mockRestaurantes } from "@/lib/mock-data";
import { Shield, User, Bike, Store } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

// ============ ENDPOINTS — AUTH ============
// POST /auth/login   body { email, password }   -> { token, rol, entidad_id, nombre }
// GET  /auth/me      header Authorization       -> sesión actual
// POST /auth/logout
// ==========================================

function LoginPage() {
  const { login } = useRole();
  const navigate = useNavigate();

  const elegir = (rol: Role, entidad_id: number | null, nombre: string) => {
    // Guardar sesión mock + token local (preparación para auth real)
    setAuthToken("mock-token");
    login({ rol, entidad_id, nombre });
    navigate({ to: "/" });
  };

  const opciones = [
    { rol: "admin" as Role, nombre: "Administrador", icon: Shield, desc: "Ve y gestiona toda la plataforma", entidad_id: null },
    ...mockClientes.slice(0, 1).map(c => ({ rol: "cliente" as Role, nombre: c.nombre, icon: User, desc: "Pedir comida y seguir mis pedidos", entidad_id: c.id })),
    ...mockRepartidores.slice(0, 1).map(r => ({ rol: "repartidor" as Role, nombre: r.nombre, icon: Bike, desc: "Ver entregas asignadas", entidad_id: r.id })),
    ...mockRestaurantes.slice(0, 1).map(r => ({ rol: "restaurante" as Role, nombre: r.nombre, icon: Store, desc: "Gestionar menú y pedidos del local", entidad_id: r.id })),
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 rounded-2xl bg-primary items-center justify-center text-primary-foreground font-black text-2xl mb-4">R</div>
          <h1 className="text-3xl font-black">Rappi · Ingresar</h1>
          <p className="text-muted-foreground mt-1">Elegí con qué rol querés operar la plataforma</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {opciones.map(o => (
            <Card key={o.rol} className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => elegir(o.rol, o.entidad_id, o.nombre)}>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <o.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">{o.rol}</div>
                  <div className="font-bold text-lg">{o.nombre}</div>
                  <div className="text-sm text-muted-foreground">{o.desc}</div>
                </div>
                <Button variant="ghost" size="sm">Entrar</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
