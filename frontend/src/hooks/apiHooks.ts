import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api, { alertApiError } from "@/lib/api";

const onMutationError = (err: unknown) => alertApiError(err);

// Clientes
export function useClientes() {
  return useQuery({
    queryKey: ["clientes"],
    queryFn: async () => {
      const { data } = await api.get("/clientes");
      return data;
    },
  });
}

export function useCreateCliente() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Record<string, string>) => {
      const { data } = await api.post("/clientes", payload);
      return data;
    },
    onError: onMutationError,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["clientes"] }),
  });
}

export function useDeleteCliente() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/clientes/${id}`);
    },
    onError: onMutationError,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clientes"] });
    },
  });
}

// Cupones
export function useCupones() {
  return useQuery({
    queryKey: ["cupones"],
    queryFn: async () => {
      const { data } = await api.get("/cupones");
      return data;
    },
  });
}

export function useCreateCupon() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await api.post("/cupones", payload);
      return data;
    },
    onError: onMutationError,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["cupones"] }),
  });
}

export function useDeleteCupon() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/cupones/${id}`);
    },
    onError: onMutationError,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cupones"] });
    },
  });
}

// Restaurantes
export function useRestaurantes(q?: string, categoria?: string) {
  return useQuery({
    queryKey: ["restaurantes", q ?? "", categoria ?? ""],
    queryFn: async () => {
      const params: string[] = [];

      if (q) params.push(`q=${encodeURIComponent(q)}`);
      if (categoria)
        params.push(`categoria=${encodeURIComponent(categoria)}`);

      const query = params.length
        ? `?${params.join("&")}`
        : "";

      const { data } = await api.get(
        `/restaurantes${query}`
      );

      return data;
    },
  });
}

export function useRestaurantesTop() {
  return useQuery({
    queryKey: ["restaurantes", "top"],
    queryFn: async () => {
      const { data } = await api.get(
        "/restaurantes/top"
      );

      return data;
    },
  });
}

// Platos
export function usePlatos() {
  return useQuery({
    queryKey: ["platos"],
    queryFn: async () => {
      const { data } = await api.get("/platos");
      return data;
    },
  });
}

// Pedidos
export function usePedidos() {
  return useQuery({
    queryKey: ["pedidos"],
    queryFn: async () => {
      const { data } = await api.get("/pedidos");
      return data;
    },
  });
}

export function useLatestPedidos(limit = 10) {
  return useQuery({
    queryKey: ["pedidos", "latest", limit],
    queryFn: async () => {
      const { data } = await api.get(
        `/pedidos?limit=${limit}`
      );

      return data;
    },
  });
}

// Cliente-specific
export function useClientePedidos(
  clienteId?: number | null
) {
  return useQuery({
    queryKey: ["clientes", clienteId, "pedidos"],
    queryFn: async () => {
      if (!clienteId) return [];

      const { data } = await api.get(
        `/clientes/${clienteId}/pedidos`
      );

      return data;
    },
    enabled: !!clienteId,
  });
}

export function useClienteNotificaciones(
  clienteId?: number | null
) {
  return useQuery({
    queryKey: [
      "clientes",
      clienteId,
      "notificaciones",
    ],
    queryFn: async () => {
      if (!clienteId) return [];

      const { data } = await api.get(
        `/clientes/${clienteId}/notificaciones`
      );

      return data;
    },
    enabled: !!clienteId,
  });
}

export function useMarkNotificacion() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, leida }: any) => {
      const { data } = await api.patch(
        `/notificaciones/${id}`,
        { leida }
      );

      return data;
    },
    onError: onMutationError,
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: ["clientes"],
      }),
  });
}

// Repartidor-specific
export function useRepartidorPedidos(
  repartidorId?: number | null
) {
  return useQuery({
    queryKey: [
      "repartidor",
      repartidorId,
      "pedidos",
    ],
    queryFn: async () => {
      if (!repartidorId) return [];

      const { data } = await api.get(
        `/repartidores/${repartidorId}/pedidos`
      );

      return data;
    },
    enabled: !!repartidorId,
  });
}

export function useToggleRepartidor() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      disponible,
    }: any) => {
      const { data } = await api.put(
        `/repartidores/${id}`,
        { disponible }
      );

      return data;
    },
    onError: onMutationError,
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: ["repartidores"],
      }),
  });
}

export function useUpdatePedidoEstado() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, estado }: any) => {
      const { data } = await api.put(
        `/pedidos/${id}`,
        { estado }
      );

      return data;
    },
    onError: onMutationError,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pedidos"] });
      qc.invalidateQueries({ queryKey: ["repartidores"] });
    },
  });
}

// Platos & restaurantes helpers
export function useCreatePlato() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      restauranteId,
      payload,
    }: {
      restauranteId: number;
      payload: Record<string, unknown>;
    }) => {
      const { data } = await api.post(
        `/restaurantes/${restauranteId}/platos`,
        payload
      );
      return data;
    },
    onError: onMutationError,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["platos"] });
    },
  });
}

export function useDeletePlato() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/platos/${id}`);
    },
    onError: onMutationError,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["platos"] });
    },
  });
}

export function useCreateRepartidor() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await api.post("/repartidores", payload);
      return data;
    },
    onError: onMutationError,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["repartidores"] });
    },
  });
}

export function useDeleteRepartidor() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/repartidores/${id}`);
    },
    onError: onMutationError,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["repartidores"] });
    },
  });
}

export function useCreateRestaurante() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await api.post("/restaurantes", payload);
      return data;
    },
    onError: onMutationError,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["restaurantes"] });
    },
  });
}

export function useDeleteRestaurante() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/restaurantes/${id}`);
    },
    onError: onMutationError,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["restaurantes"] });
    },
  });
}

export function useZonas() {
  return useQuery({
    queryKey: ["zonas"],
    queryFn: async () => {
      const { data } = await api.get("/zonas");
      return data;
    },
  });
}

export function useCreateZona() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await api.post("/zonas", payload);
      return data;
    },
    onError: onMutationError,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["zonas"] });
    },
  });
}

export function useDeleteZona() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/zonas/${id}`);
    },
    onError: onMutationError,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["zonas"] }),
  });
}

export function usePlatosByRestaurant(
  restauranteId?: number | null
) {
  return useQuery({
    queryKey: [
      "platos",
      "byRest",
      restauranteId,
    ],
    queryFn: async () => {
      if (!restauranteId) return [];

      const { data } = await api.get(
        `/platos?restaurante_id=${restauranteId}`
      );

      return data;
    },
    enabled: !!restauranteId,
  });
}

export function useTogglePlato() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      disponible,
    }: any) => {
      const { data } = await api.put(
        `/platos/${id}`,
        { disponible }
      );

      return data;
    },
    onError: onMutationError,
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: ["platos"],
      }),
  });
}

export function usePlatosTop() {
  return useQuery({
    queryKey: ["platos", "top"],
    queryFn: async () => {
      const { data } = await api.get("/platos/top");
      return data;
    },
  });
}

// Pedidos management
export function useCreatePedido() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post(
        `/pedidos`,
        payload
      );

      return data;
    },
    onError: onMutationError,
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: ["pedidos"],
      }),
  });
}

export function useAssignPedido() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: { pedido_id: number; repartidor_id?: number }) => {
      const { pedido_id, repartidor_id } = data;
      const { data: responseData } = await api.post(`/pedidos/${pedido_id}/asignar`, repartidor_id ? { repartidor_id } : {});

      return responseData;
    },
    onError: onMutationError,
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: ["pedidos"],
      }),
  });
}

export function useRepartidores() {
  return useQuery({
    queryKey: ["repartidores"],
    queryFn: async () => {
      const { data } = await api.get(
        `/repartidores`
      );

      return data;
    },
  });
}

export function useRestaurantePedidos(
  restauranteId?: number | null
) {
  return useQuery({
    queryKey: [
      "restaurante",
      restauranteId,
      "pedidos",
    ],
    queryFn: async () => {
      if (!restauranteId) return [];

      const { data } = await api.get(
        `/restaurantes/${restauranteId}/pedidos`
      );

      return data;
    },
    enabled: !!restauranteId,
  });
}

// Notificaciones
export function useNotificaciones() {
  return useQuery({
    queryKey: ["notificaciones"],
    queryFn: async () => {
      const { data } = await api.get(
        "/notificaciones"
      );

      return data;
    },
  });
}

export default {};