import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, EndpointHint } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockRestaurantes } from "@/lib/mock-data";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/zonas")({
  component: ZonasPage,
});

const mockZonas = [
  { id: 1, restaurante_id: 1, nombre: "Belgrano", codigo_postal: "1428" },
  { id: 2, restaurante_id: 1, nombre: "Núñez", codigo_postal: "1429" },
  { id: 3, restaurante_id: 2, nombre: "Centro", codigo_postal: "1043" },
  { id: 4, restaurante_id: 3, nombre: "Recoleta", codigo_postal: "1414" },
];

function ZonasPage() {
  // ============ ENDPOINTS — HU12 ============
  // GET  /restaurantes/{id}/zonas        -> zonas que cubre el restaurante
  // POST /restaurantes/{id}/zonas        -> agregar zona { nombre, codigo_postal }
  // DELETE /zonas/{id}                   -> eliminar zona
  // GET  /restaurantes?codigo_postal=1414-> restaurantes que cubren esa zona
  // 
  // Validación al crear pedido:
  //  POST /pedidos -> 400 si direccion_entrega.codigo_postal no está en zonas del restaurante
  // ===========================================

  return (
    <AppShell>
      <PageHeader
        title="Zonas de cobertura"
        subtitle="Códigos postales habilitados para entrega por restaurante"
        actions={<Button><Plus className="h-4 w-4" />Nueva zona</Button>}
      />
      <EndpointHint>GET {`{API_BASE_URL}`}/restaurantes/{`{id}`}/zonas  ·  GET {`{API_BASE_URL}`}/restaurantes?codigo_postal=1414</EndpointHint>
      <Card className="mt-6">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Restaurante</TableHead>
                <TableHead>Zona</TableHead>
                <TableHead>Código postal</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockZonas.map(z => (
                <TableRow key={z.id}>
                  <TableCell className="font-semibold">{mockRestaurantes.find(r=>r.id===z.restaurante_id)?.nombre}</TableCell>
                  <TableCell>{z.nombre}</TableCell>
                  <TableCell className="font-mono">{z.codigo_postal}</TableCell>
                  <TableCell><Button variant="ghost" size="sm">Eliminar</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppShell>
  );
}
