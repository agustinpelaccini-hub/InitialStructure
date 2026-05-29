import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockCupones } from "@/lib/mock-data";
import { useCupones, useCreateCupon, useDeleteCupon } from "@/hooks/apiHooks";
import { Plus, Ticket, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/cupones")({
  component: CuponesPage,
});

type CuponRow = {
  id: number;
  codigo: string;
  porcentaje?: number;
  porcentaje_descuento?: number;
  vencimiento?: string;
  fecha_vencimiento?: string;
  usos_maximos?: number;
  uso_maximo?: number;
  usos_actuales: number;
};

function CuponesPage() {
  const cuponesQuery = useCupones();
  const createCupon = useCreateCupon();
  const deleteCupon = useDeleteCupon();
  const [open, setOpen] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [porcentaje, setPorcentaje] = useState(10);
  const [vencimiento, setVencimiento] = useState("");
  const [usosMaximos, setUsosMaximos] = useState(100);

  const lista: CuponRow[] = Array.isArray(cuponesQuery.data) ? cuponesQuery.data : mockCupones;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo.trim() || !vencimiento) {
      alert("Completá código y fecha de vencimiento");
      return;
    }
    createCupon.mutate(
      {
        codigo: codigo.trim().toUpperCase(),
        porcentaje_descuento: porcentaje,
        fecha_vencimiento: vencimiento,
        usos_maximos: usosMaximos,
        usos_actuales: 0,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setCodigo("");
          setPorcentaje(10);
          setVencimiento("");
          setUsosMaximos(100);
        },
      },
    );
  };

  const handleDelete = (id: number, codigo: string) => {
    if (confirm(`¿Estás seguro de eliminar el cupón "${codigo}"?`)) {
      deleteCupon.mutate(id);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Cupones"
        subtitle="Códigos de descuento aplicables sobre el subtotal"
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" />
            Nuevo cupón
          </Button>
        }
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo cupón</DialogTitle>
            <DialogDescription>Código único con porcentaje de descuento.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="grid gap-3 py-4">
            <div>
              <Label>Código</Label>
              <Input value={codigo} onChange={(e) => setCodigo(e.target.value)} required />
            </div>
            <div>
              <Label>Porcentaje (1-100)</Label>
              <Input
                type="number"
                min={1}
                max={100}
                value={porcentaje}
                onChange={(e) => setPorcentaje(Number(e.target.value))}
                required
              />
            </div>
            <div>
              <Label>Vencimiento</Label>
              <Input type="date" value={vencimiento} onChange={(e) => setVencimiento(e.target.value)} required />
            </div>
            <div>
              <Label>Usos máximos</Label>
              <Input
                type="number"
                min={1}
                value={usosMaximos}
                onChange={(e) => setUsosMaximos(Number(e.target.value))}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createCupon.isPending}>
                Crear
              </Button>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {lista.map((c) => {
          const pct = c.porcentaje_descuento ?? c.porcentaje ?? 0;
          const vencStr = c.fecha_vencimiento ?? c.vencimiento ?? "";
          const maxUsos = c.usos_maximos ?? c.uso_maximo ?? 0;
          const venc = vencStr ? new Date(vencStr) : new Date(0);
          const expirado = vencStr ? venc < new Date() : false;
          const agotado = c.usos_actuales >= maxUsos;
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
                    <div className="text-xs text-muted-foreground">
                      Vence {vencStr ? venc.toLocaleDateString() : "—"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-3xl font-black text-primary">{pct}%</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(c.id, c.codigo)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-4 text-sm flex justify-between">
                  <span className="text-muted-foreground">
                    Usos: {c.usos_actuales} / {maxUsos}
                  </span>
                  <span className={valido ? "text-green-700 font-medium" : "text-red-700 font-medium"}>
                    {valido ? "Válido" : expirado ? "Vencido" : "Agotado"}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
