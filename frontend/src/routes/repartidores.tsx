import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, EndpointHint } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockRepartidores } from "@/lib/mock-data";
import { useRepartidores } from "@/hooks/apiHooks";
import { Plus, Bike } from "lucide-react";

export const Route = createFileRoute("/repartidores")({
  component: RepartidoresPage,
});

function RepartidoresPage() {
  // ============ ENDPOINTS — HU2, HU5, HU6 ============
  // GET /repartidores                  -> listar todos
  // GET /repartidores/disponibles      -> SOLO disponible=true
  // POST /repartidores                 -> alta de repartidor
  //   body: { nombre, vehiculo, disponible }
  // PATCH /repartidores/{id}           -> cambiar disponibilidad
  // POST /pedidos/{id}/asignar         -> asigna automáticamente uno disponible
  //   * Al asignar -> repartidor.disponible = false
  //   * Al entregar -> repartidor.disponible = true
  // ====================================================

  const repartidoresQuery = useRepartidores();

  return (
    <AppShell>
      <PageHeader
        title="Repartidores"
        subtitle="Flota disponible para asignar pedidos"
        actions={<Button><Plus className="h-4 w-4" />Nuevo repartidor</Button>}
      />
      <EndpointHint>GET {`{API_BASE_URL}`}/repartidores  ·  GET {`{API_BASE_URL}`}/repartidores/disponibles</EndpointHint>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {(repartidoresQuery.data ?? mockRepartidores).map(r => (
          <Card key={r.id}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center">
                <Bike className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="font-bold">{r.nombre}</div>
                <div className="text-xs text-muted-foreground capitalize">{r.vehiculo}</div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${r.disponible ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                {r.disponible ? "Disponible" : "Ocupado"}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
