import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader, EndpointHint } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockRestaurantes, mockPlatos } from "@/lib/mock-data";
import { usePlatosByRestaurant, useRestaurantes, useTogglePlato, useCreatePlato } from "@/hooks/apiHooks";
import { ArrowLeft, Plus } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/restaurantes/$id")({
  component: MenuPage,
});

function MenuPage() {
  const { id } = Route.useParams();
  const restaurantesQuery = useRestaurantes();
  const restaurante = (restaurantesQuery.data ?? mockRestaurantes).find(r => r.id === Number(id));
  const platosQuery = usePlatosByRestaurant(Number(id));
  const platos = platosQuery.data ?? mockPlatos.filter(p => p.restaurante_id === Number(id));
  const togglePlato = useTogglePlato();
  const createPlato = useCreatePlato();

  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !precio.trim()) {
      alert("Completá nombre y precio");
      return;
    }
    createPlato.mutate(
      {
        restauranteId: Number(id),
        payload: {
          nombre: nombre.trim(),
          descripcion: descripcion.trim() || undefined,
          precio: Number(precio),
          disponible: true,
        },
      },
      {
        onSuccess: () => {
          setOpen(false);
          setNombre("");
          setDescripcion("");
          setPrecio("");
        },
      },
    );
  };

  // ============ ENDPOINTS — HU1 ============
  // GET /restaurantes/{id}            -> info del restaurante
  // GET /restaurantes/{id}/menu       -> SOLO platos disponibles (HU1)
  // POST /restaurantes/{id}/platos    -> crear plato (precio > 0)
  // PATCH /platos/{id}                -> marcar disponible/no disponible
  //
  // const { data: menu } = useQuery({
  //   queryKey: ["menu", id],
  //   queryFn: () => api(`/restaurantes/${id}/menu`),
  // });
  // ==========================================

  if (!restaurante) return <AppShell><p>Restaurante no encontrado</p></AppShell>;

  return (
    <AppShell>
      <Link to={"/restaurantes" as string} className="text-sm text-muted-foreground inline-flex items-center gap-1 mb-4 hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Volver
      </Link>
      <PageHeader
        title={restaurante.nombre}
        subtitle={`${restaurante.categoria} · ${restaurante.direccion} · ★ ${restaurante.calificacion_promedio}`}
        actions={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" />Agregar plato</Button>}
      />

      <EndpointHint>GET {`{API_BASE_URL}`}/restaurantes/{id}/menu</EndpointHint>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo plato</DialogTitle>
            <DialogDescription>Agregá un plato al menú del restaurante.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="grid gap-3 py-4">
            <div>
              <Label>Nombre</Label>
              <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <div>
              <Label>Descripción</Label>
              <Input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            </div>
            <div>
              <Label>Precio</Label>
              <Input type="number" step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createPlato.isPending}>
                {createPlato.isPending ? "Guardando…" : "Crear"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {platos.map(p => (
          <Card key={p.id} className={!p.disponible ? "opacity-60" : ""}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold">{p.nombre}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{p.descripcion}</p>
                </div>
                <div className="text-right">
                  <div className="font-black text-primary">${p.precio.toLocaleString()}</div>
                  <div className="mt-2 flex flex-col items-end gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full inline-block ${p.disponible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {p.disponible ? "Disponible" : "No disponible"}
                    </span>
                    <button className="text-sm text-muted-foreground underline" onClick={() => togglePlato.mutate({ id: p.id, disponible: !p.disponible })}>
                      {p.disponible ? "Desactivar" : "Activar"}
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
