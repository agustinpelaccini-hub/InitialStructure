-- 1. Entidad Cliente
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    direccion TEXT NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    role VARCHAR(20) DEFAULT 'cliente'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Entidad Restaurante
CREATE TABLE restaurantes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    direccion TEXT NOT NULL,
    calificacion_promedio DECIMAL(3, 2) DEFAULT 0 CHECK (calificacion_promedio BETWEEN 0 AND 5)
);

-- 3. Entidad Zona de Cobertura (HU12)
CREATE TABLE zonas_cobertura (
    id SERIAL PRIMARY KEY,
    restaurante_id INTEGER REFERENCES restaurantes(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(10) NOT NULL
);

-- 4. Entidad Plato (HU1)
CREATE TABLE platos (
    id SERIAL PRIMARY KEY,
    restaurante_id INTEGER REFERENCES restaurantes(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL CHECK (precio > 0),
    disponible BOOLEAN DEFAULT TRUE
);

-- 5. Entidad Repartidor (HU2)
CREATE TABLE repartidores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    vehiculo VARCHAR(50) NOT NULL,
    disponible BOOLEAN DEFAULT TRUE
);

-- 6. Entidad Cupones (HU11)
CREATE TABLE cupones (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    porcentaje_descuento INTEGER NOT NULL CHECK (porcentaje_descuento BETWEEN 1 AND 100),
    fecha_vencimiento TIMESTAMP NOT NULL,
    usos_maximos INTEGER NOT NULL,
    usos_actuales INTEGER DEFAULT 0
);

-- 7. Entidad Pedido (HU4, HU5, HU6)
-- Estados: pendiente, confirmado, en_preparacion, en_camino, entregado, cancelado, sin_repartidor
CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes(id),
    restaurante_id INTEGER REFERENCES restaurantes(id),
    repartidor_id INTEGER REFERENCES repartidores(id),
    cupon_id INTEGER REFERENCES cupones(id),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'pendiente',
    subtotal DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) DEFAULT 0,
    direccion_entrega TEXT NOT NULL,
    codigo_postal_entrega VARCHAR(10) NOT NULL
);

-- 8. Relación N a M Pedido-Platos (HU4, HU7)
CREATE TABLE pedido_platos (
    pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
    plato_id INTEGER REFERENCES platos(id),
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10, 2) NOT NULL, -- Se guarda el precio del momento
    PRIMARY KEY (pedido_id, plato_id)
);

-- 9. Entidad Calificación (HU9)
CREATE TABLE calificaciones (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER UNIQUE REFERENCES pedidos(id),
    puntaje INTEGER NOT NULL CHECK (puntaje BETWEEN 1 AND 5),
    comentario TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Entidad Notificación (HU13)
CREATE TABLE notificaciones (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
    estado_nuevo VARCHAR(20) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    leida BOOLEAN DEFAULT FALSE
);

-- Índices sugeridos para mejorar el rendimiento en búsquedas (HU3, HU12)
CREATE INDEX idx_restaurante_nombre ON restaurantes(nombre);
CREATE INDEX idx_restaurante_categoria ON restaurantes(categoria);
CREATE INDEX idx_zona_cp ON zonas_cobertura(codigo_postal);

-- 