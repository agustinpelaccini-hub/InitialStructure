import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { AppShell, PageHeader, EndpointHint, RoleGate } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockPlatos, mockRestaurantes, mockPedidos } from "@/lib/mock-data";
import { useRole } from "@/lib/role-context";
// Hooks removed during revert; rely on mock data instead.
import { Plus } from "lucide-react";
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/mi-restaurante")({
  component: MiRestaurante,
});

function MiRestaurante() {
  const { session } = useRole();
  const location = useLocation();
  const restId = session?.entidad_id;
  const restaurantesQuery = { data: mockRestaurantes };
  const rest = (restaurantesQuery.data ?? mockRestaurantes).find(r => r.id === restId);
  const platos = mockPlatos.filter(p => p.restaurante_id === restId);
  const pedidos = mockPedidos.filter(p => p.restaurante_id === restId);
  const [open, setOpen] = React.useState(false);
  const [nombrePlato, setNombrePlato] = React.useState("");
  const [precioPlato, setPrecioPlato] = React.useState<number | "">("");
  const [descripcionPlato, setDescripcionPlato] = React.useState("");
  const [disponiblePlato, setDisponiblePlato] = React.useState(true);

  const handleNewPlato = () => {
    setOpen(true);
  };

  const handleCreatePlato = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!restId || !nombrePlato) {
      alert("El nombre del plato es obligatorio");
      return;
    }
    const precio = typeof precioPlato === "number" ? precioPlato : Number(precioPlato || 0);
    const payload = { nombre: nombrePlato, descripcion: descripcionPlato, precio, disponible: disponiblePlato };
    // createPlato.mutate removed during revert — log instead
    console.log("Crear plato:", { restId, payload });
    setOpen(false);
    setNombrePlato("");
    setPrecioPlato("");
    setDescripcionPlato("");
    setDisponiblePlato(true);
  };

  // ============ ENDPOINTS — RESTAURANTE (HU1, HU7, HU14) ============
  // GET  /restaurantes/{id}                 -> datos del local
  // GET  /restaurantes/{id}/platos          -> menú propio
  // POST /restaurantes/{id}/platos          -> alta de plato
  //   body: { nombre, descripcion, precio>0, disponible }
  // PATCH /platos/{id}                      -> editar / habilitar / deshabilitar
  // GET  /restaurantes/{id}/pedidos         -> pedidos recibidos
  // PATCH /pedidos/{id}/estado              -> confirmar / preparar / cancelar
  // GET  /restaurantes/{id}/reporte?desde=&hasta= -> métricas propias (HU14)
  // ==================================================================

  if (location.pathname !== "/mi-restaurante") {
    return <AppShell><RoleGate allow={["restaurante"]}><Outlet /></RoleGate></AppShell>;
  }

  return (
    <AppShell>
      <RoleGate allow={["restaurante"]}>
        <PageHeader
          title={rest?.nombre || "Mi restaurante"}
          subtitle={`${rest?.categoria} · ★ ${rest?.calificacion_promedio} · ${rest?.direccion}`}
          actions={
            <>
              <Link to="/mi-restaurante/pedidos"><Button variant="outline">Pedidos recibidos ({pedidos.length})</Button></Link>
              <Button onClick={handleNewPlato}><Plus className="h-4 w-4" />Nuevo plato</Button>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nuevo plato</DialogTitle>
                    <DialogDescription>Agrega un plato al menú de tu restaurante.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreatePlato} className="grid gap-3 py-4">
                    <div>
                      <Label>Nombre</Label>
                      <Input value={nombrePlato} onChange={e => setNombrePlato(e.target.value)} />
                    </div>
                    <div>
                      <Label>Precio</Label>
                      <Input type="number" value={precioPlato} onChange={e => setPrecioPlato(e.target.value === "" ? "" : Number(e.target.value))} />
                    </div>
                    <div>
                      <Label>Descripción</Label>
                      <Input value={descripcionPlato} onChange={e => setDescripcionPlato(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label>Disponible</Label>
                      <Switch checked={disponiblePlato} onCheckedChange={(v: boolean) => setDisponiblePlato(v)} />
                    </div>
                    <DialogFooter>
                      <Button type="submit">Crear plato</Button>
                      <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </>
          }
        />
        <EndpointHint>GET {`{API_BASE_URL}`}/restaurantes/{restId}/platos · POST /restaurantes/{restId}/platos</EndpointHint>

        <Card className="mt-6">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plato</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead>Disponible</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {platos.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-semibold">{p.nombre}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{p.descripcion}</TableCell>
                    <TableCell className="text-right font-mono">${p.precio.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.disponible ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                        {p.disponible ? "Sí" : "No"}
                      </span>
                    </TableCell>
                    <TableCell><Button variant="ghost" size="sm">Editar</Button></TableCell>
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
