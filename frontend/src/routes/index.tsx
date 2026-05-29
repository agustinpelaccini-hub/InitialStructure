import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell, PageHeader, EndpointHint } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockPedidos, mockRestaurantes, mockClientes, mockRepartidores } from "@/lib/mock-data";
import { useRole } from "@/lib/role-context";
import { ShoppingBag, Store, Users, Bike, TrendingUp } from "lucide-react";
import { useRestaurantesTop, useLatestPedidos, useRestaurantes, useClientes, usePedidos } from "@/hooks/apiHooks";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const { session } = useRole();
  const navigate = useNavigate();

  // Redirigir cada rol a su home propio
  useEffect(() => {
    if (!session) return;
    try {
      if (session.rol === "cliente") navigate({ to: "/mis-pedidos" });
      else if (session.rol === "repartidor") navigate({ to: "/mis-entregas" });
      else if (session.rol === "restaurante") navigate({ to: "/mi-restaurante" });
    } catch (error) {
      console.error("Error en redirección:", error);
    }
  }, [session, navigate]);

  if (!session || session.rol !== "admin") {
    return <AppShell><div /></AppShell>;
  }

  // ============ ENDPOINTS — DASHBOARD ADMIN ============
  // GET /admin/dashboard   -> totales globales (restaurantes, clientes, pedidos, etc.)
  // GET /restaurantes/top  -> ranking general (HU10)
  // GET /pedidos?limit=10  -> últimos pedidos
  // ======================================================

  const topQuery = useRestaurantesTop();
  const pedidosQuery = useLatestPedidos(10);
  const clientesQuery = useClientes();
  const restaurantesQuery = useRestaurantes();
  const pedidosAllQuery = usePedidos();

  const stats = [
    { label: "Restaurantes", value: (restaurantesQuery.data ?? mockRestaurantes).length, icon: Store, color: "bg-orange-100 text-orange-700" },
    { label: "Clientes", value: (clientesQuery.data ?? []).length, icon: Users, color: "bg-blue-100 text-blue-700" },
    { label: "Repartidores", value: "—", icon: Bike, color: "bg-green-100 text-green-700" },
    { label: "Pedidos hoy", value: (pedidosAllQuery.data ?? mockPedidos).length, icon: ShoppingBag, color: "bg-pink-100 text-pink-700" },
  ];

  return (
    <AppShell>
      <PageHeader title="Dashboard" subtitle="Vista global del administrador" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className={`inline-flex h-10 w-10 rounded-xl items-center justify-center ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div className="mt-3 text-3xl font-black">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-4 w-4" />Top restaurantes</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            
            {((topQuery.data ?? mockRestaurantes) as any[])
              .sort((a,b)=> (b.calificacion_promedio ?? 0) - (a.calificacion_promedio ?? 0))
              .slice(0,5)
              .map((r,i)=>(
                <div key={r.id} className="flex items-center justify-between border-b last:border-0 pb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-primary w-6">#{i+1}</span>
                    <div>
                      <div className="font-semibold">{r.nombre}</div>
                      <div className="text-xs text-muted-foreground capitalize">{r.categoria}</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold">★ {r.calificacion_promedio}</div>
                </div>
              ))}
            <EndpointHint>GET {`{API_BASE_URL}`}/restaurantes/top</EndpointHint>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Últimos pedidos</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {(pedidosQuery.data ?? mockPedidos).map((p:any) => (
              <div key={p.id} className="flex items-center justify-between border-b last:border-0 pb-2">
                <div>
                  <div className="font-semibold">Pedido #{p.id}</div>
                  <div className="text-xs text-muted-foreground capitalize">{String(p.estado || "").replace("_"," ")}</div>
                </div>
                <div className="font-semibold">${(p.total ?? 0).toLocaleString()}</div>
              </div>
            ))}
            <EndpointHint>GET {`{API_BASE_URL}`}/pedidos?limit=10</EndpointHint>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
