import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { LayoutDashboard, Store, Users, Bike, ShoppingBag, Ticket, Bell, BarChart3, Trophy, MapPin, LogOut, UtensilsCrossed, PackageCheck, ClipboardList } from "lucide-react";
import { useRole, type Role } from "@/lib/role-context";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

type NavItem = { to: string; label: string; icon: any; roles: Role[] };

const NAV: NavItem[] = [
  // ---- Admin ----
  { to: "/", label: "Dashboard", icon: LayoutDashboard, roles: ["admin"] },
  { to: "/restaurantes", label: "Restaurantes", icon: Store, roles: ["admin", "cliente"] },
  { to: "/clientes", label: "Clientes", icon: Users, roles: ["admin"] },
  { to: "/repartidores", label: "Repartidores", icon: Bike, roles: ["admin"] },
  { to: "/pedidos", label: "Pedidos", icon: ShoppingBag, roles: ["admin"] },
  { to: "/cupones", label: "Cupones", icon: Ticket, roles: ["admin", "cliente"] },
  { to: "/zonas", label: "Zonas", icon: MapPin, roles: ["admin"] },
  { to: "/notificaciones", label: "Notificaciones", icon: Bell, roles: ["admin", "cliente"] },
  { to: "/rankings", label: "Rankings", icon: Trophy, roles: ["admin"] },
  { to: "/reportes", label: "Reportes", icon: BarChart3, roles: ["admin", "restaurante"] },
  // ---- Cliente ----
  { to: "/mis-pedidos", label: "Mis pedidos", icon: ClipboardList, roles: ["cliente"] },
  // ---- Repartidor ----
  { to: "/mis-entregas", label: "Mis entregas", icon: PackageCheck, roles: ["repartidor"] },
  // ---- Restaurante ----
  { to: "/mi-restaurante", label: "Mi local", icon: UtensilsCrossed, roles: ["restaurante"] },
  { to: "/mi-restaurante/pedidos", label: "Pedidos recibidos", icon: ShoppingBag, roles: ["restaurante"] },
];

const ROLE_HOME: Record<Role, string> = {
  admin: "/",
  cliente: "/mis-pedidos",
  repartidor: "/mis-entregas",
  restaurante: "/mi-restaurante",
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, logout } = useRole();

  useEffect(() => {
    if (!session) navigate({ to: "/login" });
  }, [session, navigate]);

  if (!session) return null;

  const items = NAV.filter(n => n.roles.includes(session.rol));

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden md:flex w-64 flex-col border-r bg-card sticky top-0 h-screen">
        <div className="px-6 py-6 border-b">
          <Link to={ROLE_HOME[session.rol]} className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-lg">R</div>
            <div>
              <div className="font-black text-lg leading-none tracking-tight">Rappi</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{session.rol}</div>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {items.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground/70 hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t space-y-2">
          <div className="text-xs">
            <div className="font-semibold text-foreground">{session.nombre}</div>
            <div className="text-muted-foreground capitalize">{session.rol}</div>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={() => { logout(); navigate({ to: "/login" }); }}>
            <LogOut className="h-3.5 w-3.5" /> Salir
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">{children}</div>
        <Toaster />
      </main>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

export function EndpointHint({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-3 py-2 font-mono text-xs text-primary/90 whitespace-pre-wrap">
      {children}
    </div>
  );
}

export function RoleGate({ allow, children }: { allow: Role[]; children: React.ReactNode }) {
  const { session } = useRole();
  if (!session) return null;
  if (!allow.includes(session.rol)) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
        <div className="font-bold text-destructive">Acceso restringido</div>
        <div className="text-sm text-muted-foreground mt-1">Esta sección está disponible solo para: {allow.join(", ")}.</div>
      </div>
    );
  }
  return <>{children}</>;
}
