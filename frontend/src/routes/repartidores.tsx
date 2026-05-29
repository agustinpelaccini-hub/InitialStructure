import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockRepartidores } from "@/lib/mock-data";
import { useRepartidores, useCreateRepartidor, useDeleteRepartidor } from "@/hooks/apiHooks";
import { Plus, Bike, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/repartidores")({
  component: RepartidoresPage,
});

function RepartidoresPage() {
  const repartidoresQuery = useRepartidores();
  const createRepartidor = useCreateRepartidor();
  const deleteRepartidor = useDeleteRepartidor();
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [vehiculo, setVehiculo] = useState("moto");

  const lista = Array.isArray(repartidoresQuery.data) ? repartidoresQuery.data : mockRepartidores;

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

  return (
    <AppShell>
      <PageHeader
        title="Repartidores"
        subtitle="Flota disponible para asignar pedidos"
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {lista.map((r: { id: number; nombre: string; vehiculo: string; disponible: boolean }) => (
          <Card key={r.id}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center">
                <Bike className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="font-bold">{r.nombre}</div>
                <div className="text-xs text-muted-foreground capitalize">{r.vehiculo}</div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    r.disponible ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {r.disponible ? "Disponible" : "Ocupado"}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(r.id, r.nombre)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
