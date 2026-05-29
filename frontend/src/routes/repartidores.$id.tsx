import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRepartidorPedidos, useLatestPedidos } from "@/hooks/apiHooks";
import { api } from "@/lib/api";

export const Route = createFileRoute("/repartidores/$id")({
  component: RepartidorPanel,
});

function RepartidorPanel() {
  const { id } = Route.useParams();
  const pedidosQuery = useLatestPedidos();
  const pedidos = pedidosQuery.data ?? [];
  
  const misPedidos = pedidos.filter(p => p.repartidor_id === Number(id) && p.estado !== "entregado" && p.estado !== "cancelado");

  const handleToggleDisponible = async () => {
    try {
      await api.patch(`/repartidores/${id}`, { disponible: true });
      window.location.reload();
    } catch (error) {
      alert("Error al actualizar estado");
    }
  };

  return (
    <AppShell>
      <PageHeader
        title={`Panel de Repartidor #${id}`}
        subtitle="Mis asignaciones"
        actions={
          <Button variant="outline" onClick={handleToggleDisponible}>
            Marcar como disponible
          </Button>
        }
      />

      <Card className="mt-6">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {misPedidos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No hay asignaciones activas
                  </TableCell>
                </TableRow>
              ) : (
                misPedidos.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono">#{p.id}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        p.estado === "en_camino" ? "bg-orange-100 text-orange-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {p.estado.replace("_", " ")}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-semibold">${p.total.toLocaleString()}</TableCell>
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
