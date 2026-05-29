import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { mockRestaurantes } from "@/lib/mock-data";
import { useRestaurantes, useCreateRestaurante, useDeleteRestaurante } from "@/hooks/apiHooks";
import { Plus, Search, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/restaurantes/")({
  component: RestaurantesPage,
});

function RestaurantesPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [direccion, setDireccion] = useState("");

  const restaurantesQuery = useRestaurantes(q, cat);
  const createRestaurante = useCreateRestaurante();
  const deleteRestaurante = useDeleteRestaurante();

  const restaurantes = Array.isArray(restaurantesQuery.data) ? restaurantesQuery.data : mockRestaurantes;
  const filtered = restaurantes
    .filter((r: { nombre: string }) => !q || r.nombre.toLowerCase().includes(q.toLowerCase()))
    .filter((r: { categoria: string }) => !cat || r.categoria === cat.toLowerCase())
    .sort(
      (a: { calificacion_promedio?: number }, b: { calificacion_promedio?: number }) =>
        (b.calificacion_promedio ?? 0) - (a.calificacion_promedio ?? 0),
    );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !categoria.trim() || !direccion.trim()) {
      alert("Completá nombre, categoría y dirección");
      return;
    }
    createRestaurante.mutate(
      {
        nombre: nombre.trim(),
        categoria: categoria.trim().toLowerCase(),
        direccion: direccion.trim(),
        calificacion_promedio: 0,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setNombre("");
          setCategoria("");
          setDireccion("");
        },
      },
    );
  };

  const handleDelete = (id: number, nombre: string) => {
    if (confirm(`¿Estás seguro de eliminar el restaurante "${nombre}"?`)) {
      deleteRestaurante.mutate(id);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Restaurantes"
        subtitle="Buscá, filtrá y administrá los restaurantes y su menú"
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" />
            Nuevo restaurante
          </Button>
        }
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo restaurante</DialogTitle>
            <DialogDescription>Alta de restaurante en la plataforma.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="grid gap-3 py-4">
            <div>
              <Label>Nombre</Label>
              <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <div>
              <Label>Categoría</Label>
              <Input placeholder="sushi, pizza…" value={categoria} onChange={(e) => setCategoria(e.target.value)} required />
            </div>
            <div>
              <Label>Dirección</Label>
              <Input value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createRestaurante.isPending}>
                Crear
              </Button>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>
          <Input
            placeholder="Categoría exacta (ej: sushi)"
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="md:w-64"
          />
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filtered.map((r: { id: number; nombre: string; categoria: string; direccion: string; calificacion_promedio?: number }) => (
          <Card key={r.id} className="hover:shadow-lg transition-shadow h-full">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <Link to="/restaurantes/$id" params={{ id: String(r.id) }} className="flex-1">
                  <h3 className="font-bold text-lg hover:text-primary transition-colors">{r.nombre}</h3>
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    ★ {r.calificacion_promedio ?? 0}
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
              </div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{r.categoria}</div>
              <div className="text-sm text-muted-foreground mt-3">{r.direccion}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
