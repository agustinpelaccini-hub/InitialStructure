import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/lib/client";
import { setAuthToken } from "@/lib/api";
import { toast } from "sonner";

export function useRestaurantesTop() {
  return useQuery(["restaurantes", "top"], () => client.getRestaurantesTop());
}

export function useLatestPedidos(limit = 10) {
  return useQuery(["pedidos", "latest", limit], () => client.listPedidos({ limit }));
}

export function usePlatosByRestaurant(restId?: number | null) {
  return useQuery(["restaurante", restId, "platos"], () => client.getPlatosByRestaurant(restId as number), { enabled: !!restId });
}

export function useRestaurantes(q = "", categoria = "") {
  return useQuery(["restaurantes", q, categoria], () => client.listRestaurantes());
}

export function useClientes() {
  return useQuery(["clientes"], () => client.listClientes());
}

export function useRepartidores() {
  return useQuery(["repartidores"], () => client.listRepartidores());
}

export function useClientePedidos(clienteId?: number | null) {
  return useQuery(["clientes", clienteId, "pedidos"], () => client.getClientePedidos(clienteId as number), { enabled: !!clienteId });
}

export function useRepartidorPedidos(repId?: number | null) {
  return useQuery(["repartidor", repId, "pedidos"], () => client.getRepartidorPedidos(repId as number), { enabled: !!repId });
}

export function useRestaurantePedidos(restId?: number | null) {
  return useQuery(["restaurante", restId, "pedidos"], () => client.getRestaurantePedidos(restId as number), { enabled: !!restId });
}

export function usePlatosTop() {
  return useQuery(["platos", "top"], () => client.getPlatosTop());
}

export function useCupones() {
  return useQuery(["cupones"], () => client.listCupones());
}

export function useClienteNotificaciones(clienteId?: number | null) {
  return useQuery(["clientes", clienteId, "notificaciones"], () => client.getClienteNotificaciones(clienteId as number), { enabled: !!clienteId });
}

// Mutations
export function useAssignPedido() {
  const qc = useQueryClient();
  return useMutation((pedidoId: number) => client.assignPedido(pedidoId), {
    onSuccess: () => {
      qc.invalidateQueries(["pedidos"]);
      toast.success("Pedido asignado correctamente");
    },
    onError: (err: any) => toast.error(err?.message || "Error asignando pedido"),
  });
}

export function useUpdatePedidoEstado() {
  const qc = useQueryClient();
  return useMutation(({ id, estado }: { id: number; estado: string }) => client.updatePedidoEstado(id, estado), {
    onSuccess: () => {
      qc.invalidateQueries(["pedidos"]);
      toast.success("Estado del pedido actualizado");
    },
    onError: (err: any) => toast.error(err?.message || "Error actualizando estado"),
  });
}

export function useToggleRepartidor() {
  const qc = useQueryClient();
  return useMutation(({ id, disponible }: { id: number; disponible: boolean }) => client.toggleRepartidor(id, { disponible }), {
    onSuccess: () => {
      qc.invalidateQueries(["repartidores"]);
      toast.success("Disponibilidad actualizada");
    },
    onError: (err: any) => toast.error(err?.message || "Error actualizando repartidor"),
  });
}

export function useMarkNotificacion() {
  const qc = useQueryClient();
  return useMutation(({ id, leida }: { id: number; leida: boolean }) => client.markNotificacion(id, { leida }), {
    onSuccess: () => {
      qc.invalidateQueries(["clientes"]);
      toast.success("Notificación marcada");
    },
    onError: (err: any) => toast.error(err?.message || "Error marcando notificación"),
  });
}

export function useTogglePlato() {
  const qc = useQueryClient();
  return useMutation(({ id, disponible }: { id: number; disponible: boolean }) => client.togglePlato(id, { disponible }), {
    onSuccess: () => {
      qc.invalidateQueries(["restaurante"]);
      toast.success("Plato actualizado");
    },
    onError: (err: any) => toast.error(err?.message || "Error actualizando plato"),
  });
}

export function useCreatePlato() {
  const qc = useQueryClient();
  return useMutation(({ restId, payload }: { restId: number; payload: any }) => client.createPlato(restId, payload), {
    onSuccess: () => {
      qc.invalidateQueries(["restaurante"]);
      toast.success("Plato creado");
    },
    onError: (err: any) => toast.error(err?.message || "Error creando plato"),
  });
}

export function useCreatePedido() {
  const qc = useQueryClient();
  return useMutation((payload: any) => client.createPedido(payload), {
    onSuccess: () => {
      qc.invalidateQueries(["pedidos"]);
      toast.success("Pedido creado");
    },
    onError: (err: any) => toast.error(err?.message || "Error creando pedido"),
  });
}

export function useCreateCliente() {
  const qc = useQueryClient();
  return useMutation((payload: any) => client.createCliente(payload), {
    onSuccess: () => {
      qc.invalidateQueries(["clientes"]);
      toast.success("Cliente creado");
    },
    onError: (err: any) => toast.error(err?.message || "Error creando cliente"),
  });
}

export function useApplyCupon() {
  const qc = useQueryClient();
  return useMutation(({ pedidoId, codigo }: { pedidoId: number; codigo: string }) => client.applyCupon(pedidoId, codigo), {
    onSuccess: () => {
      qc.invalidateQueries(["pedidos"]);
      toast.success("Cupón aplicado");
    },
    onError: (err: any) => toast.error(err?.message || "Error aplicando cupón"),
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation((creds: { email: string; password: string }) => client.login(creds), {
    onSuccess(data) {
      // Expected: { token, rol, entidad_id, nombre }
      if (data?.token) setAuthToken(data.token);
      qc.invalidateQueries();
      toast.success("Inicio de sesión correcto");
    },
    onError: (err: any) => toast.error(err?.message || "Error en login"),
  });
}

export function useLogout() {
  return () => {
    setAuthToken(null);
    // optionally call backend logout when available
  };
}
