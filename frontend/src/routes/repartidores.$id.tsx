import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRepartidorPedidos, useLatestPedidos, useRepartidores } from "@/hooks/apiHooks";
import { api } from "@/lib/api";
import { Bike, User, RefreshCw, CheckCircle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/repartidores/$id")({
  component: RepartidorPanel,
});

function RepartidorPanel() {
  const { id } = Route.useParams();
  const pedidosQuery = useLatestPedidos();
  const repartidoresQuery = useRepartidores();
  const pedidos = pedidosQuery.data ?? [];
  const repartidores = repartidoresQuery.data ?? [];
  
  const repartidor = repartidores.find((r: any) => r.id === Number(id));
  const misPedidos = pedidos.filter((p: any) => p.repartidor_id === Number(id) && p.estado !== "entregado" && p.estado !== "cancelado");
  const [loading, setLoading] = useState(false);

  const handleToggleDisponible = async () => {
    if (!repartidor) return;
    setLoading(true);
    try {
      await api.patch(`/repartidores/${id}`, { disponible: !repartidor.disponible });
      window.location.reload();
    } catch (error) {
      alert("Error al actualizar estado");
    } finally {
      setLoading(false);
    }
  };

  const handleMarcarEntregado = async (pedidoId: number) => {
    if (!confirm("¿Confirmar que el pedido fue entregado?")) return;
    try {
      await api.patch(`/pedidos/${pedidoId}`, { estado: "entregado" });
      window.location.reload();
    } catch (error) {
      alert("Error al marcar pedido como entregado");
    }
  };

  if (!repartidor) {
    return (
      <AppShell>
        <PageHeader title="Repartidor no encontrado" subtitle="El repartidor no existe" />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        title={`Panel de Repartidor: ${repartidor.nombre}`}
        subtitle="Gestión de tus asignaciones"
      />

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <User className="h-6 w-6" />
              </div>
              <div>
                <div className="font-bold">{repartidor.nombre}</div>
                <div className="text-sm text-muted-foreground capitalize">{repartidor.vehiculo}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Estado</div>
                <div className={`text-lg font-semibold ${repartidor.disponible ? "text-green-600" : "text-orange-600"}`}>
                  {repartidor.disponible ? "Disponible" : "Ocupado"}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleDisponible}
                disabled={loading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {repartidor.disponible ? "Poner ocupado" : "Poner disponible"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center">
                <Bike className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Pedidos activos</div>
                <div className="text-2xl font-bold">{misPedidos.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {misPedidos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No hay asignaciones activas
                  </TableCell>
                </TableRow>
              ) : (
                misPedidos.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono">#{p.id}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        p.estado === "en_camino" ? "bg-orange-100 text-orange-800" :
                        p.estado === "en_preparacion" ? "bg-purple-100 text-purple-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {p.estado.replace("_", " ")}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-semibold">${p.total.toLocaleString()}</TableCell>
                    <TableCell>
                      {p.estado === "en_camino" && (
                        <Button
                          size="sm"
                          onClick={() => handleMarcarEntregado(p.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Entregado
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppShell>
  );
}
