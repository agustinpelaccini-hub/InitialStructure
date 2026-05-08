// Datos mock para visualizar las pantallas mientras conectás el backend FastAPI.
export const mockRestaurantes = [
  { id: 1, nombre: "Sushi Zen", categoria: "sushi", direccion: "Av. Cabildo 2200", calificacion_promedio: 4.7 },
  { id: 2, nombre: "La Pizzería", categoria: "pizza", direccion: "Corrientes 1234", calificacion_promedio: 4.3 },
  { id: 3, nombre: "Burger House", categoria: "hamburguesas", direccion: "Santa Fe 980", calificacion_promedio: 4.5 },
  { id: 4, nombre: "Tacos del Sur", categoria: "mexicana", direccion: "Honduras 4500", calificacion_promedio: 4.1 },
];

export const mockPlatos = [
  { id: 1, nombre: "Roll Philadelphia", descripcion: "Salmón, queso crema, palta", precio: 4500, disponible: true, restaurante_id: 1 },
  { id: 2, nombre: "Roll California", descripcion: "Cangrejo, palta, pepino", precio: 4200, disponible: true, restaurante_id: 1 },
  { id: 3, nombre: "Sashimi mix", descripcion: "12 cortes variados", precio: 6800, disponible: false, restaurante_id: 1 },
  { id: 4, nombre: "Muzzarella", descripcion: "Pizza clásica", precio: 5200, disponible: true, restaurante_id: 2 },
  { id: 5, nombre: "Cheeseburger", descripcion: "Doble carne y cheddar", precio: 4800, disponible: true, restaurante_id: 3 },
];

export const mockClientes = [
  { id: 1, nombre: "Lucía Pérez", email: "lucia@mail.com", direccion: "Av. Belgrano 100", telefono: "11-2222-3333" },
  { id: 2, nombre: "Martín Gómez", email: "martin@mail.com", direccion: "Salguero 880", telefono: "11-4444-5555" },
];

export const mockRepartidores = [
  { id: 1, nombre: "Juan Díaz", vehiculo: "moto", disponible: true },
  { id: 2, nombre: "Ana Ríos", vehiculo: "bici", disponible: false },
  { id: 3, nombre: "Pedro Luna", vehiculo: "moto", disponible: true },
];

export const mockPedidos = [
  { id: 101, cliente_id: 1, restaurante_id: 1, repartidor_id: 1, fecha: "2026-05-07T20:30:00", estado: "en_camino", total: 13200, direccion_entrega: "Av. Belgrano 100" },
  { id: 102, cliente_id: 2, restaurante_id: 3, repartidor_id: null, fecha: "2026-05-08T13:10:00", estado: "pendiente", total: 4800, direccion_entrega: "Salguero 880" },
  { id: 103, cliente_id: 1, restaurante_id: 2, repartidor_id: 2, fecha: "2026-05-06T21:00:00", estado: "entregado", total: 10400, direccion_entrega: "Av. Belgrano 100" },
];

export const mockCupones = [
  { id: 1, codigo: "BIENVENIDO20", porcentaje: 20, vencimiento: "2026-12-31", usos_maximos: 100, usos_actuales: 23 },
  { id: 2, codigo: "VERANO10", porcentaje: 10, vencimiento: "2026-03-01", usos_maximos: 500, usos_actuales: 487 },
];

export const mockNotificaciones = [
  { id: 1, pedido_id: 101, estado_nuevo: "en_camino", fecha: "2026-05-07T20:35:00", leida: false },
  { id: 2, pedido_id: 101, estado_nuevo: "confirmado", fecha: "2026-05-07T20:31:00", leida: false },
  { id: 3, pedido_id: 103, estado_nuevo: "entregado", fecha: "2026-05-06T21:45:00", leida: true },
];

export const ESTADOS = ["pendiente", "confirmado", "en_preparacion", "en_camino", "entregado", "cancelado", "sin_repartidor"] as const;
