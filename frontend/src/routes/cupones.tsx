import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, EndpointHint } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockCupones } from "@/lib/mock-data";
import { useCupones } from "@/hooks/apiHooks";
import { Plus, Ticket } from "lucide-react";

export const Route = createFileRoute("/cupones")({
  component: CuponesPage,
});

function CuponesPage() {
  // ============ ENDPOINTS — HU11 ============
  // GET  /cupones                  -> listar cupones
  // POST /cupones                  -> crear cupón
  //   body: { codigo (único), porcentaje (1-100), vencimiento, usos_maximos }
  // POST /cupones/validar          -> validar antes de aplicar
  //   body: { codigo }
  //   * Rechazar si vencido o sin usos
  // POST /pedidos/{id}/aplicar-cupon
  //   * Descuento sobre el subtotal
  //   * Al confirmar el pedido se incrementa usos_actuales
  //   * Si se cancela antes de confirmado, NO se cuenta
  // ===========================================

  const cuponesQuery = useCupones();

  return (
    <AppShell>
      <PageHeader
        title="Cupones"
        subtitle="Códigos de descuento aplicables sobre el subtotal"
        actions={<Button><Plus className="h-4 w-4" />Nuevo cupón</Button>}
      />
      <EndpointHint>GET {`{API_BASE_URL}`}/cupones  ·  POST {`{API_BASE_URL}`}/cupones/validar</EndpointHint>
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {(cuponesQuery.data ?? mockCupones).map(c => {
          const venc = new Date(c.vencimiento);
          const expirado = venc < new Date();
          const agotado = c.usos_actuales >= c.usos_maximos;
          const valido = !expirado && !agotado;
          return (
            <Card key={c.id} className={!valido ? "opacity-60" : ""}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Ticket className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-mono font-black text-lg">{c.codigo}</div>
                    <div className="text-xs text-muted-foreground">Vence {venc.toLocaleDateString()}</div>
                  </div>
                  <div className="text-3xl font-black text-primary">{c.porcentaje}%</div>
                </div>
                <div className="mt-4 text-sm flex justify-between">
                  <span className="text-muted-foreground">Usos: {c.usos_actuales} / {c.usos_maximos}</span>
                  <span className={valido ? "text-green-700 font-medium" : "text-red-700 font-medium"}>{valido ? "Válido" : (expirado ? "Vencido" : "Agotado")}</span>
                </div>
                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${(c.usos_actuales/c.usos_maximos)*100}%` }} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
