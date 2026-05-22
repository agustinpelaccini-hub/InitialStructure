import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, EndpointHint } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockRestaurantes, mockPlatos } from "@/lib/mock-data";
import { useRestaurantesTop, usePlatosTop } from "@/hooks/apiHooks";
import { Trophy } from "lucide-react";

export const Route = createFileRoute("/rankings")({
  component: RankingsPage,
});

function RankingsPage() {
  // ============ ENDPOINTS — HU10 ============
  // GET /restaurantes/top   -> 5 restaurantes con MÁS pedidos entregados (desc)
  // GET /platos/top         -> 10 platos más vendidos por cantidad total (desc)
  //
  // SQL ejemplo (PostgreSQL):
  //  SELECT r.*, COUNT(p.id) AS pedidos
  //  FROM restaurantes r
  //  JOIN pedidos p ON p.restaurante_id = r.id AND p.estado='entregado'
  //  GROUP BY r.id ORDER BY pedidos DESC LIMIT 5;
  // ===========================================

  const topRestQuery = useRestaurantesTop();
  const topPlatosQuery = usePlatosTop();

  const topRest = topRestQuery.data ?? [...mockRestaurantes].sort((a,b)=>b.calificacion_promedio-a.calificacion_promedio).slice(0,5);
  const topPlatos = topPlatosQuery.data ?? [...mockPlatos].slice(0,10);

  return (
    <AppShell>
      <PageHeader title="Rankings" subtitle="Lo más pedido de la plataforma" />
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="h-4 w-4 text-primary" />Top 5 restaurantes</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {topRest.map((r,i)=>(
              <div key={r.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                <span className="font-black text-2xl text-primary w-8">{i+1}</span>
                <div className="flex-1">
                  <div className="font-semibold">{r.nombre}</div>
                  <div className="text-xs text-muted-foreground capitalize">{r.categoria}</div>
                </div>
                <div className="font-bold">★ {r.calificacion_promedio}</div>
              </div>
            ))}
            <EndpointHint>GET {`{API_BASE_URL}`}/restaurantes/top</EndpointHint>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="h-4 w-4 text-primary" />Top 10 platos</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {topPlatos.map((p,i)=>(
              <div key={p.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                <span className="font-black text-2xl text-primary w-8">{i+1}</span>
                <div className="flex-1">
                  <div className="font-semibold">{p.nombre}</div>
                  <div className="text-xs text-muted-foreground">{mockRestaurantes.find(r=>r.id===p.restaurante_id)?.nombre}</div>
                </div>
                <div className="font-bold">${p.precio.toLocaleString()}</div>
              </div>
            ))}
            <EndpointHint>GET {`{API_BASE_URL}`}/platos/top</EndpointHint>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
