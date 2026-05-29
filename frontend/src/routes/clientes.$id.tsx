import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useClientePedidos } from "@/hooks/apiHooks";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/clientes/$id")({
  component: ClientePanel,
});

function ClientePanel() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const pedidosQuery = useClientePedidos(Number(id));
  const pedidos = (pedidosQuery.data?.pedidos ?? []).filter(p => p.estado !== "entregado" && p.estado !== "cancelado");
  const [pedidoExpandido, setPedidoExpandido] = useState<number | null>(null);

  return (
    <AppShell>
      <PageHeader
        title={`Panel de Cliente #${id}`}
        subtitle="Mis pedidos"
        actions={
          <Button variant="outline" onClick={() => navigate({ to: "/nuevo-pedido" })}>
            Nuevo pedido
          </Button>
        }
      />

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
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedidos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No hay pedidos activos
                  </TableCell>
                </TableRow>
              ) : (
                pedidos.map(p => (
                  <>
                    <TableRow key={p.id}>
                      <TableCell className="font-mono">#{p.id}</TableCell>
                      <TableCell className="font-medium">{p.restaurante_nombre || `Restaurante #${p.restaurante_id}`}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{new Date(p.fecha).toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          p.estado === "pendiente" ? "bg-yellow-100 text-yellow-800" :
                          p.estado === "confirmado" ? "bg-blue-100 text-blue-800" :
                          p.estado === "en_preparacion" ? "bg-purple-100 text-purple-800" :
                          p.estado === "en_camino" ? "bg-orange-100 text-orange-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {p.estado.replace("_", " ")}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-semibold">${p.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPedidoExpandido(pedidoExpandido === p.id ? null : p.id)}
                        >
                          {pedidoExpandido === p.id ? "Ocultar" : "Ver detalle"}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {pedidoExpandido === p.id && p.items && (
                      <TableRow key={`${p.id}-detalle`}>
                        <TableCell colSpan={6} className="bg-muted/50">
                          <div className="p-4">
                            <h4 className="font-semibold mb-2">Detalle del pedido:</h4>
                            <ul className="space-y-1">
                              {p.items.map((item: any, idx: number) => (
                                <li key={idx} className="flex justify-between text-sm">
                                  <span>{item.cantidad}x {item.plato_nombre}</span>
                                  <span className="text-muted-foreground">${item.subtotal.toLocaleString()}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppShell>
  );
}
