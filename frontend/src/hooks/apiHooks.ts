import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

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
    mutationFn: async (payload: any) => {
      const { data } = await api.post("/clientes", payload);
      return data;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["clientes"] }),
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
    mutationFn: async (payload: any) => {
      const { data } = await api.post("/cupones", payload);
      return data;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["cupones"] }),
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
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: ["pedidos"],
      }),
  });
}

// Platos & restaurantes helpers
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
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: ["pedidos"],
      }),
  });
}

export function useAssignPedido() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      repartidor_id,
    }: any) => {
      const { data } = await api.put(
        `/pedidos/${id}`,
        { repartidor_id }
      );

      return data;
    },
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