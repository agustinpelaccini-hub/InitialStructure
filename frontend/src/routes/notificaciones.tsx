import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, EndpointHint } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockNotificaciones } from "@/lib/mock-data";
import { useClienteNotificaciones } from "@/hooks/apiHooks";
import { useRole } from "@/lib/role-context";
import { Bell, Check } from "lucide-react";
import { useMarkNotificacion } from "@/hooks/apiHooks";

export const Route = createFileRoute("/notificaciones")({
  component: NotificacionesPage,
});

function NotificacionesPage() {
  // ============ ENDPOINTS — HU13 ============
  // GET   /clientes/{id}/notificaciones   -> ordenadas: NO leídas primero, luego por fecha desc
  // PATCH /notificaciones/{id}            -> marcar como leída ({ leida: true })
  //
  // * Cada PATCH /pedidos/{id}/estado válido genera 1 notificación
  // * Las transiciones inválidas NO generan notificación
  // ==========================================

  const { session } = useRole();
  const notisQuery = useClienteNotificaciones(session?.entidad_id);
  const sorted = [...(notisQuery.data ?? mockNotificaciones)].sort((a,b)=> {
    if (a.leida !== b.leida) return a.leida ? 1 : -1;
    return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
  });

  const markMut = useMarkNotificacion();

  return (
    <AppShell>
      <PageHeader title="Notificaciones" subtitle="Cambios de estado de los pedidos" />
      <EndpointHint>GET {`{API_BASE_URL}`}/clientes/{`{id}`}/notificaciones  ·  PATCH {`{API_BASE_URL}`}/notificaciones/{`{id}`}</EndpointHint>
      <div className="space-y-3 mt-6">
        {sorted.map(n => (
          <Card key={n.id} className={n.leida ? "opacity-60" : "border-primary/30"}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${n.leida ? "bg-muted" : "bg-primary/10"}`}>
                <Bell className={`h-5 w-5 ${n.leida ? "text-muted-foreground" : "text-primary"}`} />
              </div>
              <div className="flex-1">
                <div className="font-semibold">Pedido #{n.pedido_id} → <span className="capitalize">{n.estado_nuevo.replace("_"," ")}</span></div>
                <div className="text-xs text-muted-foreground">{new Date(n.fecha).toLocaleString()}</div>
              </div>
              {!n.leida && <Button size="sm" variant="ghost" onClick={() => markMut.mutate({ id: n.id, leida: true })}><Check className="h-4 w-4" />Marcar leída</Button>}
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
