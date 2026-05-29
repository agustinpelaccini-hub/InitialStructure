import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRestaurantePedidos, useUpdatePedidoEstado } from "@/hooks/apiHooks";

export const Route = createFileRoute("/restaurantes/$id/panel")({
  component: RestaurantePanel,
});

function RestaurantePanel() {
  const { id } = Route.useParams();
  const pedidosQuery = useRestaurantePedidos(Number(id));
  const pedidos = pedidosQuery.data ?? [];
  const updateEstado = useUpdatePedidoEstado();

  const estadoColor: Record<string, string> = {
    pendiente: "bg-yellow-100 text-yellow-800",
    confirmado: "bg-blue-100 text-blue-800",
    en_preparacion: "bg-purple-100 text-purple-800",
    en_camino: "bg-orange-100 text-orange-800",
    entregado: "bg-green-100 text-green-800",
    cancelado: "bg-red-100 text-red-800",
  };

  return (
    <AppShell>
      <PageHeader
        title={`Panel de Restaurante #${id}`}
        subtitle="Gestión de pedidos"
      />

      <Card className="mt-6">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedidos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No hay pedidos
                  </TableCell>
                </TableRow>
              ) : (
                pedidos.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono">#{p.id}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{new Date(p.fecha).toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${estadoColor[p.estado]}`}>
                        {p.estado.replace("_", " ")}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-semibold">${p.total.toLocaleString()}</TableCell>
                    <TableCell className="space-x-2">
                      <Button size="sm" variant="ghost" onClick={() => updateEstado.mutate({ id: p.id, estado: "cancelado" })}>Cancelar</Button>
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
