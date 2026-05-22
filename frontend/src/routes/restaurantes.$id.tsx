import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader, EndpointHint } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockRestaurantes, mockPlatos } from "@/lib/mock-data";
import { usePlatosByRestaurant, useRestaurantes, useTogglePlato } from "@/hooks/apiHooks";
import { ArrowLeft, Plus } from "lucide-react";

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
        actions={<Button><Plus className="h-4 w-4" />Agregar plato</Button>}
      />

      <EndpointHint>GET {`{API_BASE_URL}`}/restaurantes/{id}/menu</EndpointHint>

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
