import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, EndpointHint, RoleGate } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { mockPedidos, mockClientes, mockRestaurantes, mockRepartidores } from "@/lib/mock-data";
import { useRole } from "@/lib/role-context";
import { useState } from "react";
import { useRepartidorPedidos } from "@/hooks/apiHooks";
import { MapPin, CheckCircle2 } from "lucide-react";
import { useUpdatePedidoEstado, useToggleRepartidor } from "@/hooks/apiHooks";

export const Route = createFileRoute("/mis-entregas")({
  component: MisEntregas,
});

function MisEntregas() {
  const { session } = useRole();
  const repartidor = mockRepartidores.find(r => r.id === session?.entidad_id);
  const [disponible, setDisponible] = useState(repartidor?.disponible ?? true);
  const entregasQuery = useRepartidorPedidos(session?.entidad_id);
  const entregas = entregasQuery.data ?? mockPedidos.filter(p => p.repartidor_id === session?.entidad_id);
  const updateEstado = useUpdatePedidoEstado();
  const toggleRep = useToggleRepartidor();

  const handleToggleDisponible = (next: boolean) => {
    setDisponible(next);
    if (session?.entidad_id) toggleRep.mutate({ id: session.entidad_id, disponible: next });
  };

  // ============ ENDPOINTS — REPARTIDOR (HU5, HU6) ============
  // GET   /repartidores/{rep_id}/pedidos           -> entregas asignadas (no entregadas)
  // GET   /repartidores/{rep_id}/pedidos?estado=entregado -> historial
  // PATCH /repartidores/{rep_id}                   -> { disponible: bool }
  // PATCH /pedidos/{pedido_id}/estado              -> { estado: "en_camino" | "entregado" }
  //   * Al entregar -> repartidor.disponible = true automáticamente
  // ============================================================

  

  return (
    <AppShell>
      <RoleGate allow={["repartidor"]}>
        <PageHeader
          title="Mis entregas"
          subtitle={`Hola ${session?.nombre} · ${repartidor?.vehiculo}`}
          actions={
              <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-card border">
              <span className="text-sm font-medium">{disponible ? "Disponible" : "Ocupado"}</span>
              <Switch checked={disponible} onCheckedChange={handleToggleDisponible} />
            </div>
          }
        />
        <EndpointHint>GET {`{API_BASE_URL}`}/repartidores/{session?.entidad_id}/pedidos · PATCH /repartidores/{session?.entidad_id}</EndpointHint>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {entregas.length === 0 && (
            <Card><CardContent className="p-6 text-center text-muted-foreground">No tenés pedidos asignados</CardContent></Card>
          )}
          {entregas.map(p => {
            const cli = mockClientes.find(c => c.id === p.cliente_id);
            const rest = mockRestaurantes.find(r => r.id === p.restaurante_id);
            return (
              <Card key={p.id}>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-muted-foreground">Pedido</div>
                      <div className="font-black text-xl">#{p.id}</div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800 font-medium capitalize">{p.estado.replace("_"," ")}</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <div><strong>Retirar en:</strong> {rest?.nombre} · {rest?.direccion}</div>
                    <div><strong>Entregar a:</strong> {cli?.nombre}</div>
                    <div className="flex items-start gap-1 text-muted-foreground"><MapPin className="h-3.5 w-3.5 mt-0.5" />{p.direccion_entrega}</div>
                  </div>
                      <div className="flex gap-2 pt-2 border-t">
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => updateEstado.mutate({ id: p.id, estado: "en_camino" })}>En camino</Button>
                        <Button size="sm" className="flex-1" onClick={() => updateEstado.mutate({ id: p.id, estado: "entregado" })}><CheckCircle2 className="h-4 w-4" />Entregar</Button>
                      </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </RoleGate>
    </AppShell>
  );
}
