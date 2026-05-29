import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell, PageHeader, EndpointHint, RoleGate } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockPedidos, mockRestaurantes } from "@/lib/mock-data";
import { useRole } from "@/lib/role-context";
import { useClientePedidos } from "@/hooks/apiHooks";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/mis-pedidos")({
  component: MisPedidos,
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

function MisPedidos() {
  const { session } = useRole();
  const navigate = useNavigate();

  try {
    // ============ ENDPOINTS — CLIENTE (HU4, HU8, HU13) ============
    // GET  /clientes/{cliente_id}/pedidos             -> historial propio (fecha desc)
    // GET  /clientes/{cliente_id}/pedidos?estado=...  -> filtrar por estado
    // POST /pedidos                                    -> crear pedido
    //   body: { cliente_id, restaurante_id, items:[{plato_id,cantidad}], cupon_codigo?, direccion_entrega }
    // GET  /clientes/{cliente_id}/notificaciones      -> avisos de cambio de estado
    // ===============================================================

    if (!session || session.rol !== "cliente") {
      return (
        <AppShell>
          <PageHeader title="Acceso denegado" subtitle="Solo clientes pueden ver esta página" />
          <Card className="mt-6">
            <CardContent className="p-6 text-center text-destructive">
              Acceso denegado
            </CardContent>
          </Card>
        </AppShell>
      );
    }

    const pedidosQuery = useClientePedidos(session?.entidad_id);
    const pedidos = (pedidosQuery.data?.pedidos ?? mockPedidos.filter(p => p.cliente_id === session?.entidad_id)).filter(p => p.estado !== "entregado" && p.estado !== "cancelado");

    if (pedidosQuery.isLoading) {
      return (
        <AppShell>
          <PageHeader title="Mis pedidos" subtitle="Cargando..." />
          <Card className="mt-6">
            <CardContent className="p-6 text-center text-muted-foreground">
              Cargando...
            </CardContent>
          </Card>
        </AppShell>
      );
    }

    if (pedidosQuery.isError) {
      return (
        <AppShell>
          <PageHeader title="Mis pedidos" subtitle="Error al cargar" />
          <Card className="mt-6">
            <CardContent className="p-6 text-center text-destructive">
              Error al cargar pedidos. Mostrando datos de ejemplo.
            </CardContent>
          </Card>
        </AppShell>
      );
    }

    return (
      <AppShell>
        <PageHeader
          title="Mis pedidos"
          subtitle={`Historial de ${session?.nombre}`}
          actions={<Button onClick={() => navigate({ to: "/nuevo-pedido" })}><Plus className="h-4 w-4" />Nuevo pedido</Button>}
        />
        <EndpointHint>GET {`{API_BASE_URL}`}/clientes/{session?.entidad_id}/pedidos</EndpointHint>
        <Card className="mt-6">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Restaurante</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidos.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Aún no tenés pedidos</TableCell></TableRow>
                )}
                {pedidos.map(p => {
                  const rest = mockRestaurantes.find(r => r.id === p.restaurante_id);
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono">#{p.id}</TableCell>
                      <TableCell>{rest?.nombre}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{new Date(p.fecha).toLocaleString()}</TableCell>
                      <TableCell><span className={`text-xs px-2 py-1 rounded-full font-medium ${estadoColor[p.estado]}`}>{p.estado.replace("_"," ")}</span></TableCell>
                      <TableCell className="text-right font-semibold">${p.total.toLocaleString()}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </AppShell>
    );
  } catch (error) {
    console.error("Error en MisPedidos:", error);
    return (
      <AppShell>
        <PageHeader title="Error" subtitle="Ocurrió un error inesperado" />
        <Card className="mt-6">
          <CardContent className="p-6 text-center text-destructive">
            Error al cargar la página. Por favor recarga.
          </CardContent>
        </Card>
      </AppShell>
    );
  }
}
