import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, EndpointHint } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockClientes } from "@/lib/mock-data";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/clientes")({
  component: ClientesPage,
});

function ClientesPage() {
  // ============ ENDPOINTS — HU2, HU8 ============
  // GET /clientes                              -> listar clientes
  // POST /clientes                             -> alta de cliente (email único)
  //   body: { nombre, email, direccion, telefono }
  // GET /clientes/{id}/pedidos                 -> historial (orden fecha desc)
  // GET /clientes/{id}/pedidos?estado=entregado-> filtrar por estado
  // GET /clientes/{id}/notificaciones          -> notificaciones (HU13)
  // ==============================================

  return (
    <AppShell>
      <PageHeader
        title="Clientes"
        subtitle="Registro de usuarios que realizan pedidos"
        actions={<Button><Plus className="h-4 w-4" />Nuevo cliente</Button>}
      />
      <EndpointHint>GET {`{API_BASE_URL}`}/clientes</EndpointHint>
      <Card className="mt-6">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockClientes.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono">{c.id}</TableCell>
                  <TableCell className="font-semibold">{c.nombre}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.direccion}</TableCell>
                  <TableCell>{c.telefono}</TableCell>
                  <TableCell><Button variant="ghost" size="sm">Ver pedidos</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppShell>
  );
}
