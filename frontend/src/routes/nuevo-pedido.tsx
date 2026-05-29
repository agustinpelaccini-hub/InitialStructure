import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell, PageHeader, RoleGate } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRole } from "@/lib/role-context";
import { useRestaurantes, usePlatosByRestaurant, useCreatePedido, useClientes } from "@/hooks/apiHooks";
import { ArrowLeft, Plus, Minus, ShoppingCart } from "lucide-react";
import * as React from "react";

export const Route = createFileRoute("/nuevo-pedido")({
  component: NuevoPedido,
});

interface CartItem {
  plato_id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

function NuevoPedido() {
  const { session } = useRole();
  const navigate = useNavigate();
  const restaurantesQuery = useRestaurantes();
  const clientesQuery = useClientes();
  const [selectedRestauranteId, setSelectedRestauranteId] = React.useState<number | null>(null);
  const platosQuery = usePlatosByRestaurant(selectedRestauranteId);
  const createPedido = useCreatePedido();

  const clienteActual = clientesQuery.data?.find(c => c.id === session?.entidad_id);

  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [direccion, setDireccion] = React.useState(clienteActual?.direccion ?? "");
  const [codigoPostal, setCodigoPostal] = React.useState("");
  const [cuponCodigo, setCuponCodigo] = React.useState("");

  if (!session || session.rol !== "cliente") {
    return (
      <AppShell>
        <PageHeader title="Acceso denegado" subtitle="Solo clientes pueden crear pedidos" />
        <Card className="mt-6">
          <CardContent className="p-6 text-center text-destructive">
            Acceso denegado
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const restaurantes = restaurantesQuery.data ?? [];
  const platos = platosQuery.data ?? [];

  const addToCart = (plato: { id: number; nombre: string; precio: number }) => {
    setCart(prev => {
      const existing = prev.find(item => item.plato_id === plato.id);
      if (existing) {
        return prev.map(item =>
          item.plato_id === plato.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, { plato_id: plato.id, nombre: plato.nombre, precio: plato.precio, cantidad: 1 }];
    });
  };

  const removeFromCart = (plato_id: number) => {
    setCart(prev => prev.filter(item => item.plato_id !== plato_id));
  };

  const updateQuantity = (plato_id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.plato_id === plato_id) {
        const newCantidad = Math.max(1, item.cantidad + delta);
        return { ...item, cantidad: newCantidad };
      }
      return item;
    }));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  const handleCreatePedido = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRestauranteId) {
      alert("Seleccioná un restaurante");
      return;
    }
    if (cart.length === 0) {
      alert("Agregá al menos un plato al carrito");
      return;
    }
    if (!direccion.trim() || !codigoPostal.trim()) {
      alert("Completá dirección y código postal");
      return;
    }

    const payload = {
      cliente_id: session.entidad_id,
      restaurante_id: selectedRestauranteId,
      direccion_entrega: direccion.trim(),
      codigo_postal_entrega: codigoPostal.trim(),
      items: cart.map(item => ({ plato_id: item.plato_id, cantidad: item.cantidad })),
      cupon_codigo: cuponCodigo.trim() || undefined,
    };

    createPedido.mutate(payload, {
      onSuccess: () => {
        navigate({ to: "/mis-pedidos" });
      },
    });
  };

  return (
    <AppShell>
      <PageHeader
        title="Nuevo pedido"
        subtitle="Seleccioná restaurante y platos"
        actions={
          <Button variant="ghost" onClick={() => navigate({ to: "/mis-pedidos" })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        }
      />

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {/* Selección de restaurante y platos */}
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">1. Seleccioná un restaurante</h3>
              <div className="grid gap-3">
                {restaurantes.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRestauranteId(r.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-colors ${
                      selectedRestauranteId === r.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="font-semibold">{r.nombre}</div>
                    <div className="text-sm text-muted-foreground">{r.categoria}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedRestauranteId && (
            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">2. Seleccioná platos</h3>
                <div className="grid gap-3">
                  {platos.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-semibold">{p.nombre}</div>
                        <div className="text-sm text-muted-foreground">${p.precio}</div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => addToCart(p)}
                        disabled={!p.disponible}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Carrito y formulario */}
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Carrito ({cart.length})
              </h3>
              
              {cart.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  El carrito está vacío
                </p>
              ) : (
                <div className="space-y-3 mb-6">
                  {cart.map(item => (
                    <div key={item.plato_id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{item.nombre}</div>
                        <div className="text-sm text-muted-foreground">
                          ${item.precio} x {item.cantidad} = ${item.precio * item.cantidad}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.plato_id, -1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.cantidad}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.plato_id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.plato_id)}
                          className="text-destructive"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between font-semibold">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <form onSubmit={handleCreatePedido} className="space-y-4">
                <div>
                  <Label>Dirección de entrega</Label>
                  <Input
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    placeholder="Calle y número"
                    required
                  />
                </div>
                <div>
                  <Label>Código postal</Label>
                  <Input
                    value={codigoPostal}
                    onChange={(e) => setCodigoPostal(e.target.value)}
                    placeholder="1425"
                    required
                  />
                </div>
                <div>
                  <Label>Código de cupón (opcional)</Label>
                  <Input
                    value={cuponCodigo}
                    onChange={(e) => setCuponCodigo(e.target.value)}
                    placeholder="PROMO10"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={cart.length === 0 || createPedido.isPending}
                >
                  {createPedido.isPending ? "Procesando..." : "Realizar pedido"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
