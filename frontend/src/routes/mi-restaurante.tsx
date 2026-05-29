import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { AppShell, PageHeader, RoleGate } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRole } from "@/lib/role-context";
import { useCreatePlato, usePlatosByRestaurant, useRestaurantePedidos } from "@/hooks/apiHooks";
import { Plus } from "lucide-react";
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import api from "@/lib/api";

export const Route = createFileRoute("/mi-restaurante")({
  component: MiRestaurante,
});

function MiRestaurante() {
  const { session } = useRole();
  const location = useLocation();
  const restId = session?.entidad_id;
  const platosQuery = usePlatosByRestaurant(restId);
  const pedidosQuery = useRestaurantePedidos(restId);
  const createPlato = useCreatePlato();
  const [rest, setRest] = React.useState<{ nombre?: string; categoria?: string; calificacion_promedio?: number; direccion?: string } | null>(null);

  React.useEffect(() => {
    if (!restId) return;
    api.get(`/restaurantes/${restId}`).then(({ data }) => setRest(data));
  }, [restId]);

  const platos = platosQuery.data ?? [];
  const pedidos = pedidosQuery.data ?? [];
  const [open, setOpen] = React.useState(false);
  const [nombrePlato, setNombrePlato] = React.useState("");
  const [precioPlato, setPrecioPlato] = React.useState<number | "">("");
  const [descripcionPlato, setDescripcionPlato] = React.useState("");
  const [disponiblePlato, setDisponiblePlato] = React.useState(true);

  const handleCreatePlato = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!restId || !nombrePlato) {
      alert("El nombre del plato es obligatorio");
      return;
    }
    const precio = typeof precioPlato === "number" ? precioPlato : Number(precioPlato || 0);
    createPlato.mutate({
      restauranteId: restId,
      payload: { nombre: nombrePlato, descripcion: descripcionPlato, precio, disponible: disponiblePlato },
    });
    setOpen(false);
    setNombrePlato("");
    setPrecioPlato("");
    setDescripcionPlato("");
    setDisponiblePlato(true);
  };

  if (location.pathname !== "/mi-restaurante") {
    return (
      <AppShell>
        <RoleGate allow={["restaurante"]}>
          <Outlet />
        </RoleGate>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <RoleGate allow={["restaurante"]}>
        <PageHeader
          title={rest?.nombre || "Mi restaurante"}
          subtitle={`${rest?.categoria ?? ""} · ★ ${rest?.calificacion_promedio ?? 0} · ${rest?.direccion ?? ""}`}
          actions={
            <>
              <Link to="/mi-restaurante/pedidos">
                <Button variant="outline">Pedidos recibidos ({pedidos.length})</Button>
              </Link>
              <Button onClick={() => setOpen(true)}>
                <Plus className="h-4 w-4" />
                Nuevo plato
              </Button>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nuevo plato</DialogTitle>
                    <DialogDescription>Agrega un plato al menú de tu restaurante.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreatePlato} className="grid gap-3 py-4">
                    <div>
                      <Label>Nombre</Label>
                      <Input value={nombrePlato} onChange={(e) => setNombrePlato(e.target.value)} />
                    </div>
                    <div>
                      <Label>Precio</Label>
                      <Input
                        type="number"
                        value={precioPlato}
                        onChange={(e) => setPrecioPlato(e.target.value === "" ? "" : Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Descripción</Label>
                      <Input value={descripcionPlato} onChange={(e) => setDescripcionPlato(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label>Disponible</Label>
                      <Switch checked={disponiblePlato} onCheckedChange={setDisponiblePlato} />
                    </div>
                    <DialogFooter>
                      <Button type="submit">Crear plato</Button>
                      <Button variant="ghost" type="button" onClick={() => setOpen(false)}>
                        Cancelar
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </>
          }
        />

        <Card className="mt-6">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plato</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead>Disponible</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {platos.map((p: { id: number; nombre: string; descripcion?: string; precio: number; disponible: boolean }) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-semibold">{p.nombre}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{p.descripcion}</TableCell>
                    <TableCell className="text-right font-mono">${Number(p.precio).toLocaleString()}</TableCell>
                    <TableCell>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          p.disponible ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {p.disponible ? "Sí" : "No"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </RoleGate>
    </AppShell>
  );
}
