import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, EndpointHint } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockClientes } from "@/lib/mock-data";
import { useClientes, useCreateCliente } from "@/hooks/apiHooks";
// Hooks removed during revert; use mock data for now.
import { Plus } from "lucide-react";
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  const clientesQuery = useClientes();
  const createCliente = useCreateCliente();

  const [open, setOpen] = React.useState(false);
  const [nombre, setNombre] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [direccion, setDireccion] = React.useState("");
  const [telefono, setTelefono] = React.useState("");

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!nombre) {
      alert("El nombre es obligatorio");
      return;
    }
    createCliente.mutate({ nombre, email, direccion, telefono });
    setOpen(false);
    setNombre("");
    setEmail("");
    setDireccion("");
    setTelefono("");
  };

  return (
    <AppShell>
      <PageHeader
        title="Clientes"
        subtitle="Registro de usuarios que realizan pedidos"
        actions={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" />Nuevo cliente</Button>}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo cliente</DialogTitle>
            <DialogDescription>Completa los datos del nuevo cliente.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-3 py-4">
            <div>
              <Label>Nombre</Label>
              <Input value={nombre} onChange={e => setNombre(e.target.value)} />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <Label>Dirección</Label>
              <Input value={direccion} onChange={e => setDireccion(e.target.value)} />
            </div>
            <div>
              <Label>Teléfono</Label>
              <Input value={telefono} onChange={e => setTelefono(e.target.value)} />
            </div>
            <DialogFooter>
              <Button type="submit">Crear</Button>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
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
              {(clientesQuery.data ?? mockClientes).map(c => (
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
