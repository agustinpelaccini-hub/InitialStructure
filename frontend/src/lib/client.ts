import api from "./api";

// CLIENT: funciones por recurso. Mantener simples y manejables.

export async function getRestaurantesTop() {
  const res = await api.get("/restaurantes/top");
  return res.data;
}

export async function listRestaurantes() {
  const res = await api.get("/restaurantes");
  return res.data;
}

export async function listPedidos(params?: Record<string, any>) {
  const res = await api.get("/pedidos", { params });
  return res.data;
}

export async function getPedido(id: number) {
  const res = await api.get(`/pedidos/${id}`);
  return res.data;
}

export async function createPedido(payload: any) {
  const res = await api.post(`/pedidos`, payload);
  return res.data;
}

export async function getPlatosByRestaurant(restId: number) {
  const res = await api.get(`/restaurantes/${restId}/platos`);
  return res.data;
}

export async function listPlatos() {
  const res = await api.get(`/platos`);
  return res.data;
}

export async function getPlatosTop() {
  const res = await api.get(`/platos/top`);
  return res.data;
}

export async function listClientes() {
  const res = await api.get(`/clientes`);
  return res.data;
}

export async function createCliente(payload: { nombre: string; email: string; direccion?: string; telefono?: string }) {
  const res = await api.post(`/clientes`, payload);
  return res.data;
}

export async function listRepartidores() {
  const res = await api.get(`/repartidores`);
  return res.data;
}

export async function getClientePedidos(clienteId: number) {
  const res = await api.get(`/clientes/${clienteId}/pedidos`);
  return res.data;
}

export async function getRepartidorPedidos(repId: number) {
  const res = await api.get(`/repartidores/${repId}/pedidos`);
  return res.data;
}

export async function getRestaurantePedidos(restId: number) {
  const res = await api.get(`/restaurantes/${restId}/pedidos`);
  return res.data;
}

export async function listCupones() {
  const res = await api.get(`/cupones`);
  return res.data;
}

export async function getRestauranteById(id: number) {
  const res = await api.get(`/restaurantes/${id}`);
  return res.data;
}

export async function getClienteNotificaciones(clienteId: number) {
  const res = await api.get(`/clientes/${clienteId}/notificaciones`);
  return res.data;
}

export async function assignPedido(pedidoId: number, body?: any) {
  const res = await api.post(`/pedidos/${pedidoId}/asignar`, body || {});
  return res.data;
}

export async function updatePedidoEstado(pedidoId: number, estado: string) {
  const res = await api.patch(`/pedidos/${pedidoId}/estado`, { estado });
  return res.data;
}

export async function toggleRepartidor(repartidorId: number, payload: { disponible: boolean }) {
  const res = await api.patch(`/repartidores/${repartidorId}`, payload);
  return res.data;
}

export async function markNotificacion(notId: number, payload: { leida: boolean }) {
  const res = await api.patch(`/notificaciones/${notId}`, payload);
  return res.data;
}

export async function togglePlato(platoId: number, payload: { disponible: boolean }) {
  const res = await api.patch(`/platos/${platoId}`, payload);
  return res.data;
}

export async function createPlato(restId: number, payload: any) {
  const res = await api.post(`/restaurantes/${restId}/platos`, payload);
  return res.data;
}

export async function applyCupon(pedidoId: number, codigo: string) {
  const res = await api.post(`/pedidos/${pedidoId}/aplicar-cupon`, { codigo });
  return res.data;
}

export async function login(credentials: { email: string; password: string }) {
  const res = await api.post(`/auth/login`, credentials);
  return res.data;
}

export async function getSession() {
  const res = await api.get(`/auth/me`);
  return res.data;
}

export default {
  getRestaurantesTop,
  listRestaurantes,
  listPedidos,
  getPedido,
  createPedido,
  getPlatosByRestaurant,
  listPlatos,
  login,
  getSession,
};
