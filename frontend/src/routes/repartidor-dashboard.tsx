import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRepartidores, useCreateRepartidor, useDeleteRepartidor, useLatestPedidos } from "@/hooks/apiHooks";
import { Plus, Bike, Trash2, RefreshCw } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

export const Route = createFileRoute("/repartidor-dashboard")({
  component: RepartidorDashboard,
});

function RepartidorDashboard() {
  const repartidoresQuery = useRepartidores();
  const pedidosQuery = useLatestPedidos();
  const createRepartidor = useCreateRepartidor();
  const deleteRepartidor = useDeleteRepartidor();
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [vehiculo, setVehiculo] = useState("moto");

  const lista = Array.isArray(repartidoresQuery.data) ? repartidoresQuery.data : [];
  const pedidos = pedidosQuery.data ?? [];

  const getPedidosPorRepartidor = (repartidorId: number) => {
    return pedidos.filter(p => p.repartidor_id === repartidorId);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }
    createRepartidor.mutate(
      { nombre: nombre.trim(), vehiculo: vehiculo.trim(), disponible: true },
      {
        onSuccess: () => {
          setOpen(false);
          setNombre("");
          setVehiculo("moto");
        },
      },
    );
  };

  const handleDelete = (id: number, nombre: string) => {
    if (confirm(`¿Estás seguro de eliminar al repartidor "${nombre}"?`)) {
      deleteRepartidor.mutate(id);
    }
  };

  const handleToggleDisponible = async (id: number, disponible: boolean) => {
    try {
      await api.patch(`/repartidores/${id}`, { disponible: !disponible });
      repartidoresQuery.refetch();
    } catch (error) {
      alert("Error al actualizar estado del repartidor");
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Panel de Repartidores"
        subtitle="Gestión de flota y asignaciones"
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" />
            Nuevo repartidor
          </Button>
        }
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo repartidor</DialogTitle>
            <DialogDescription>Registro de repartidor en la flota.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="grid gap-3 py-4">
            <div>
              <Label>Nombre</Label>
              <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <div>
              <Label>Vehículo</Label>
              <Input value={vehiculo} onChange={(e) => setVehiculo(e.target.value)} placeholder="moto, bici…" required />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createRepartidor.isPending}>
                Crear
              </Button>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card className="mt-6">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Vehículo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Pedidos asignados</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lista.map((r: { id: number; nombre: string; vehiculo: string; disponible: boolean }) => {
                const pedidosAsignados = getPedidosPorRepartidor(r.id);
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.nombre}</TableCell>
                    <TableCell className="capitalize">{r.vehiculo}</TableCell>
                    <TableCell>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          r.disponible ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {r.disponible ? "Disponible" : "Ocupado"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {pedidosAsignados.length > 0 ? (
                        <div className="text-sm">
                          <div className="font-semibold">{pedidosAsignados.length} pedido(s)</div>
                          {pedidosAsignados.map(p => (
                            <div key={p.id} className="text-xs text-muted-foreground">
                              #{p.id} - {p.estado}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Sin pedidos</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleDisponible(r.id, r.disponible)}
                          title={r.disponible ? "Marcar como ocupado" : "Marcar como disponible"}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(r.id, r.nombre)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
