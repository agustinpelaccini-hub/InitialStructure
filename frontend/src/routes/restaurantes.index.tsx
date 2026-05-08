import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageHeader, EndpointHint } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockRestaurantes } from "@/lib/mock-data";
import { Plus, Search } from "lucide-react";

export const Route = createFileRoute("/restaurantes/")({
  component: RestaurantesPage,
});

function RestaurantesPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");

  // ============ ENDPOINTS — HU1, HU3, HU12 ============
  // GET /restaurantes                          -> listar todos
  // GET /restaurantes?q=texto                  -> filtrar por nombre parcial
  // GET /restaurantes?categoria=sushi          -> filtrar por categoría exacta
  // GET /restaurantes?codigo_postal=1414       -> filtrar por zona de cobertura
  // POST /restaurantes                         -> alta de restaurante (admin)
  //   body: { nombre, categoria, direccion }
  //
  // const { data: restaurantes } = useQuery({
  //   queryKey: ["restaurantes", q, cat],
  //   queryFn: () => api(`/restaurantes?q=${q}&categoria=${cat}`),
  // });
  // ====================================================

  const filtered = mockRestaurantes
    .filter(r => !q || r.nombre.toLowerCase().includes(q.toLowerCase()))
    .filter(r => !cat || r.categoria === cat.toLowerCase())
    .sort((a,b)=>b.calificacion_promedio - a.calificacion_promedio);

  return (
    <AppShell>
      <PageHeader
        title="Restaurantes"
        subtitle="Buscá, filtrá y administrá los restaurantes y su menú"
        actions={<Button><Plus className="h-4 w-4" />Nuevo restaurante</Button>}
      />

      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por nombre..." value={q} onChange={e=>setQ(e.target.value)} className="pl-9" />
          </div>
          <Input placeholder="Categoría exacta (ej: sushi)" value={cat} onChange={e=>setCat(e.target.value)} className="md:w-64" />
        </CardContent>
      </Card>

      <EndpointHint>GET {`{API_BASE_URL}`}/restaurantes?q={q || "<vacio>"}&categoria={cat || "<vacio>"}</EndpointHint>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filtered.map(r => (
          <Link key={r.id} to={"/restaurantes/$id" as string} params={{ id: String(r.id) }}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-lg">{r.nombre}</h3>
                  <span className="text-sm font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">★ {r.calificacion_promedio}</span>
                </div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{r.categoria}</div>
                <div className="text-sm text-muted-foreground mt-3">{r.direccion}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
