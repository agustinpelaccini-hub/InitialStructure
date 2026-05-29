import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, RoleGate } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockClientes } from "@/lib/mock-data";
import { useClientes, useCreateCliente, useDeleteCliente } from "@/hooks/apiHooks";
import { getApiErrorMessage } from "@/lib/api";
import { Plus, Trash2 } from "lucide-react";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/clientes")({
  component: ClientesPage,
});

function ClientesPage() {
  const clientesQuery = useClientes();
  const createCliente = useCreateCliente();
  const deleteCliente = useDeleteCliente();

  const [open, setOpen] = React.useState(false);
  const [nombre, setNombre] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [direccion, setDireccion] = React.useState("");
  const [telefono, setTelefono] = React.useState("");

  const lista = Array.isArray(clientesQuery.data)
    ? clientesQuery.data
    : clientesQuery.isError
      ? mockClientes
      : mockClientes;

  if (clientesQuery.isLoading) {
    return (
      <AppShell>
        <PageHeader title="Clientes" subtitle="Registro de usuarios que realizan pedidos" />
        <Card className="mt-6">
          <CardContent className="p-6 text-center text-muted-foreground">
            Cargando...
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  if (clientesQuery.isError) {
    return (
      <AppShell>
        <PageHeader title="Clientes" subtitle="Registro de usuarios que realizan pedidos" />
        <Card className="mt-6">
          <CardContent className="p-6 text-center text-destructive">
            Error al cargar clientes. Mostrando datos de respaldo.
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !email.trim() || !direccion.trim() || !telefono.trim()) {
      alert("Completá nombre, email, dirección y teléfono");
      return;
    }
    createCliente.mutate(
      { nombre: nombre.trim(), email: email.trim(), direccion: direccion.trim(), telefono: telefono.trim() },
      {
        onSuccess: () => {
          setOpen(false);
          setNombre("");
          setEmail("");
          setDireccion("");
          setTelefono("");
        },
      },
    );
  };

  const handleDelete = (id: number, nombre: string) => {
    if (confirm(`¿Estás seguro de eliminar al cliente "${nombre}"?`)) {
      deleteCliente.mutate(id);
    }
  };

  return (
    <AppShell>
      <RoleGate allow={["admin"]}>
        <PageHeader
          title="Clientes"
          subtitle="Registro de usuarios que realizan pedidos"
          actions={
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" />
              Nuevo cliente
            </Button>
          }
        />

        {clientesQuery.isError && (
          <p className="text-sm text-destructive mb-4">
            No se pudo cargar desde el servidor: {getApiErrorMessage(clientesQuery.error)}. Mostrando datos de respaldo.
          </p>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo cliente</DialogTitle>
              <DialogDescription>Completa los datos del nuevo cliente.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-3 py-4">
              <div>
                <Label>Nombre</Label>
                <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label>Dirección</Label>
                <Input value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
              </div>
              <div>
                <Label>Teléfono</Label>
                <Input value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createCliente.isPending}>
                  {createCliente.isPending ? "Guardando…" : "Crear"}
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
                {lista.map((c: { id: number; nombre: string; email: string; direccion: string; telefono: string }) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono">{c.id}</TableCell>
                    <TableCell className="font-semibold">{c.nombre}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.direccion}</TableCell>
                    <TableCell>{c.telefono}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(c.id, c.nombre)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </RoleGate>
    </AppShell>
  );
}
