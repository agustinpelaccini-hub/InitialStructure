import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockRestaurantes } from "@/lib/mock-data";
import { useZonas, useCreateZona, useDeleteZona, useRestaurantes } from "@/hooks/apiHooks";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/zonas")({
  component: ZonasPage,
});

function ZonasPage() {
  const zonasQuery = useZonas();
  const restaurantesQuery = useRestaurantes();
  const createZona = useCreateZona();
  const deleteZona = useDeleteZona();

  const [open, setOpen] = useState(false);
  const [restauranteId, setRestauranteId] = useState("");
  const [nombre, setNombre] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");

  const restaurantes = Array.isArray(restaurantesQuery.data) ? restaurantesQuery.data : mockRestaurantes;
  const zonas = Array.isArray(zonasQuery.data) ? zonasQuery.data : [];

  if (zonasQuery.isLoading) {
    return (
      <AppShell>
        <PageHeader title="Zonas de cobertura" subtitle="Códigos postales habilitados para entrega por restaurante" />
        <Card className="mt-6">
          <CardContent className="p-6 text-center text-muted-foreground">
            Cargando...
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  if (zonasQuery.isError) {
    return (
      <AppShell>
        <PageHeader title="Zonas de cobertura" subtitle="Códigos postales habilitados para entrega por restaurante" />
        <Card className="mt-6">
          <CardContent className="p-6 text-center text-destructive">
            Error al cargar zonas. Mostrando datos de respaldo.
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  if (!restaurantes || restaurantes.length === 0) {
    return (
      <AppShell>
        <PageHeader title="Zonas de cobertura" subtitle="Códigos postales habilitados para entrega por restaurante" />
        <Card className="mt-6">
          <CardContent className="p-6 text-center text-destructive">
            No hay restaurantes disponibles. Primero crea restaurantes.
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restauranteId || !nombre.trim() || !codigoPostal.trim()) {
      alert("Completá restaurante, nombre y código postal");
      return;
    }
    createZona.mutate(
      {
        restaurante_id: Number(restauranteId),
        nombre: nombre.trim(),
        codigo_postal: codigoPostal.trim(),
      },
      {
        onSuccess: () => {
          setOpen(false);
          setNombre("");
          setCodigoPostal("");
        },
      },
    );
  };

  return (
    <AppShell>
      <PageHeader
        title="Zonas de cobertura"
        subtitle="Códigos postales habilitados para entrega por restaurante"
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" />
            Nueva zona
          </Button>
        }
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva zona</DialogTitle>
            <DialogDescription>Asociá un código postal a un restaurante.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="grid gap-3 py-4">
            <div>
              <Label>Restaurante</Label>
              <Select value={restauranteId} onValueChange={(value) => {
                try {
                  setRestauranteId(value);
                } catch (error) {
                  console.error("Error al seleccionar restaurante:", error);
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Elegir restaurante" />
                </SelectTrigger>
                <SelectContent>
                  {restaurantes && restaurantes.length > 0 ? (
                    restaurantes.map((r: { id: number; nombre: string }) => (
                      <SelectItem key={r.id} value={String(r.id)}>
                        {r.nombre}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-muted-foreground">Cargando restaurantes...</div>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Nombre de zona</Label>
              <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <div>
              <Label>Código postal</Label>
              <Input value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} required />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createZona.isPending}>
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
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Restaurante</th>
                <th className="text-left p-4">Zona</th>
                <th className="text-left p-4">CP</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {zonas.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-muted-foreground">
                    No hay zonas cargadas. Creá una con el botón de arriba.
                  </td>
                </tr>
              ) : (
                zonas.map((z: { id: number; restaurante_id: number; nombre: string; codigo_postal: string }) => (
                  <tr key={z.id} className="border-b">
                    <td className="p-4 font-semibold">
                      {restaurantes.find((r: { id: number }) => r.id === z.restaurante_id)?.nombre ?? `#${z.restaurante_id}`}
                    </td>
                    <td className="p-4">{z.nombre}</td>
                    <td className="p-4 font-mono">{z.codigo_postal}</td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="sm" onClick={() => deleteZona.mutate(z.id)}>
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </AppShell>
  );
}
