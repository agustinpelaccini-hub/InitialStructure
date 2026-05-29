import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageHeader, EndpointHint } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockRestaurantes } from "@/lib/mock-data";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export const Route = createFileRoute("/reportes")({
  component: ReportesPage,
});

function ReportesPage() {
  const [desde, setDesde] = useState("2026-05-01");
  const [hasta, setHasta] = useState("2026-05-08");
  const [restId, setRestId] = useState(1);
  const [generar, setGenerar] = useState(false);

  const reporteQuery = useQuery({
    queryKey: ["reporte", restId, desde, hasta],
    queryFn: async () => {
      const { data } = await api.get(`/restaurantes/${restId}/reporte?desde=${desde}&hasta=${hasta}`);
      return data;
    },
    enabled: generar,
  });

  const reporte = reporteQuery.data || { pedidos_entregados: 0, facturacion_total: 0, ticket_promedio: 0, top_platos: [] };

  const handleGenerar = () => {
    setGenerar(true);
  };

  // ============ ENDPOINTS — HU14 ============
  // GET /restaurantes/{id}/reporte?desde=YYYY-MM-DD&hasta=YYYY-MM-DD
  // Devuelve:
  //   {
  //     pedidos_entregados: number,
  //     facturacion_total: number,
  //     ticket_promedio: number,
  //     top_platos: [{ plato_id, nombre, cantidad }]   // top 5 del rango
  //   }
  // * Solo pedidos en estado 'entregado'
  // * Si no hay pedidos -> totales = 0 y lista vacía
  // ===========================================

  return (
    <AppShell>
      <PageHeader title="Reportes de ventas" subtitle="Por restaurante y rango de fechas" />

      <Card className="mb-6">
        <CardContent className="p-4 grid md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Restaurante</label>
            <select className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm" value={restId} onChange={e=>setRestId(Number(e.target.value))}>
              {mockRestaurantes.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Desde</label>
            <Input type="date" value={desde} onChange={e=>setDesde(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Hasta</label>
            <Input type="date" value={hasta} onChange={e=>setHasta(e.target.value)} />
          </div>
          <div className="flex items-end">
            <Button className="w-full" onClick={handleGenerar} disabled={reporteQuery.isLoading}>
              {reporteQuery.isLoading ? "Generando..." : "Generar reporte"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <EndpointHint>GET {`{API_BASE_URL}`}/restaurantes/{restId}/reporte?desde={desde}&hasta={hasta}</EndpointHint>

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <Card><CardContent className="p-5"><div className="text-sm text-muted-foreground">Pedidos entregados</div><div className="text-3xl font-black mt-1">{reporte.pedidos_entregados}</div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="text-sm text-muted-foreground">Facturación total</div><div className="text-3xl font-black mt-1 text-primary">${reporte.facturacion_total.toLocaleString()}</div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="text-sm text-muted-foreground">Ticket promedio</div><div className="text-3xl font-black mt-1">${reporte.ticket_promedio.toLocaleString()}</div></CardContent></Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Top 5 platos del rango</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {reporte.top_platos && reporte.top_platos.length > 0 ? (
            reporte.top_platos.map((p: any, i: number) => (
              <div key={p.id || i} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <span className="font-black text-primary w-6">#{i+1}</span>
                  <span className="font-semibold">{p.nombre}</span>
                </div>
                <span className="font-bold">{p.cantidad} unidades</span>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-4">No hay datos para mostrar</div>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
