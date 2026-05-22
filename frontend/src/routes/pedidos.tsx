import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, EndpointHint } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockPedidos, mockClientes, mockRestaurantes, ESTADOS } from "@/lib/mock-data";
import { useLatestPedidos, useCreatePedido, useAssignPedido } from "@/hooks/apiHooks";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/pedidos")({
  component: PedidosPage,
});

const estadoColor: Record<string, string> = {
  pendiente: "bg-yellow-100 text-yellow-800",
  confirmado: "bg-blue-100 text-blue-800",
  en_preparacion: "bg-purple-100 text-purple-800",
  en_camino: "bg-orange-100 text-orange-800",
  entregado: "bg-green-100 text-green-800",
  cancelado: "bg-red-100 text-red-800",
  sin_repartidor: "bg-gray-200 text-gray-800",
};

function PedidosPage() {
  // ============ ENDPOINTS — HU4, HU5, HU6, HU7 ============
  // GET  /pedidos                          -> listar pedidos
  // GET  /pedidos/{id}                     -> detalle con platos, subtotales y total
  // POST /pedidos                          -> crear pedido (HU4)
  //   body: {
  //     cliente_id, restaurante_id, direccion_entrega,
  //     items: [{ plato_id, cantidad }],
  //     cupon_codigo?: string
  //   }
  //   Reglas:
  //   - todos los platos del MISMO restaurante
  //   - solo platos disponibles
  //   - cantidad > 0
  //   - precio_unitario se congela en el momento del pedido
  //   - estado inicial: 'pendiente'
  //   - direccion_entrega debe estar en zona del restaurante (HU12)
  //
  // POST  /pedidos/{id}/asignar            -> asignar repartidor (HU5)
  // PATCH /pedidos/{id}/estado             -> cambiar estado (HU6)
  //   body: { estado: 'confirmado' | 'en_preparacion' | ... }
  //   * Transiciones inválidas devuelven 400
  //   * 'entregado' o 'cancelado' son finales
  // ========================================================

  const estados = ESTADOS;
  const pedidosQuery = useLatestPedidos();
  const createPedido = useCreatePedido();
  const assignPedido = useAssignPedido();

  const handleNewPedido = () => {
    const cliente_id = mockClientes[0]?.id ?? 1;
    const restaurante_id = mockRestaurantes[0]?.id ?? 1;
    const items = [{ plato_id: 1, cantidad: 1 }];
    const payload = { cliente_id, restaurante_id, direccion_entrega: "Calle Falsa 123", items };
    createPedido.mutate(payload);
  };

  return (
    <AppShell>
      <PageHeader
        title="Pedidos"
        subtitle="Historial completo y gestión de estados"
        actions={<Button onClick={handleNewPedido}><Plus className="h-4 w-4" />Nuevo pedido</Button>}
      />

      <div className="flex flex-wrap gap-2 mb-4">
        {estados.map(e => (
          <button key={e} className={`text-xs px-3 py-1 rounded-full font-medium ${estadoColor[e]}`}>
            {e.replace("_"," ")}
          </button>
        ))}
      </div>

      <EndpointHint>GET {`{API_BASE_URL}`}/pedidos  ·  POST {`{API_BASE_URL}`}/pedidos/{`{id}`}/asignar  ·  PATCH {`{API_BASE_URL}`}/pedidos/{`{id}`}/estado</EndpointHint>

      <Card className="mt-6">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Restaurante</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(pedidosQuery.data ?? mockPedidos).map(p => {
                const cli = mockClientes.find(c => c.id === p.cliente_id);
                const rest = mockRestaurantes.find(r => r.id === p.restaurante_id);
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono">#{p.id}</TableCell>
                    <TableCell>{cli?.nombre}</TableCell>
                    <TableCell>{rest?.nombre}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{new Date(p.fecha).toLocaleString()}</TableCell>
                    <TableCell><span className={`text-xs px-2 py-1 rounded-full font-medium ${estadoColor[p.estado]}`}>{p.estado.replace("_"," ")}</span></TableCell>
                    <TableCell className="text-right font-semibold">${p.total.toLocaleString()}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">Ver</Button>
                      <Button size="sm" variant="outline" onClick={() => assignPedido.mutate(p.id)}>Asignar</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppShell>
  );
}
