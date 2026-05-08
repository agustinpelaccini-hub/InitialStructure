import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EndpointHint } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockPedidos, mockClientes } from "@/lib/mock-data";
import { useRole } from "@/lib/role-context";

export const Route = createFileRoute("/mi-restaurante/pedidos")({
  component: PedidosRecibidos,
});

const estadoColor: Record<string, string> = {
  pendiente: "bg-yellow-100 text-yellow-800",
  confirmado: "bg-blue-100 text-blue-800",
  en_preparacion: "bg-purple-100 text-purple-800",
  en_camino: "bg-orange-100 text-orange-800",
  entregado: "bg-green-100 text-green-800",
  cancelado: "bg-red-100 text-red-800",
};

function PedidosRecibidos() {
  const { session } = useRole();
  const pedidos = mockPedidos.filter(p => p.restaurante_id === session?.entidad_id);

  // ============ ENDPOINTS — RESTAURANTE (HU6, HU7) ============
  // GET   /restaurantes/{id}/pedidos          -> pedidos del local
  // PATCH /pedidos/{id}/estado                -> confirmado | en_preparacion | cancelado
  //   * Validar transiciones HU6
  // GET   /pedidos/{id}                       -> detalle: items, subtotales, total
  // =============================================================

  return (
    <>
      <PageHeader title="Pedidos recibidos" subtitle="Confirmá y gestioná los pedidos de tu local" />
      <EndpointHint>GET {`{API_BASE_URL}`}/restaurantes/{session?.entidad_id}/pedidos</EndpointHint>
      <Card className="mt-6">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedidos.map(p => {
                const cli = mockClientes.find(c => c.id === p.cliente_id);
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono">#{p.id}</TableCell>
                    <TableCell>{cli?.nombre}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{new Date(p.fecha).toLocaleString()}</TableCell>
                    <TableCell><span className={`text-xs px-2 py-1 rounded-full font-medium ${estadoColor[p.estado]}`}>{p.estado.replace("_"," ")}</span></TableCell>
                    <TableCell className="text-right font-semibold">${p.total.toLocaleString()}</TableCell>
                    <TableCell className="space-x-2">
                      <Button size="sm" variant="outline">Confirmar</Button>
                      <Button size="sm" variant="ghost">Cancelar</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
