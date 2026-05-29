"""Create DB schema and seed data for development."""
from datetime import datetime, timedelta

from src.db.connection import Base, SessionLocal, engine
from src.db.models import (
    calificacion_model,
    clientes_model,
    cupones_model,
    notificacion_model,
    pedido_model,
    pedido_plato_model,
    platos_model,
    repartidor_model,
    resturantes_model,
    zonas_cobertura_model,
)


def create_schema():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


def seed():
    db = SessionLocal()
    try:
        r1 = resturantes_model.Restaurantes(
            nombre="Sushi Zen",
            categoria="sushi",
            direccion="Av. Cabildo 2200",
            calificacion_promedio=4.7,
        )
        r2 = resturantes_model.Restaurantes(
            nombre="La Pizzería",
            categoria="pizza",
            direccion="Corrientes 1234",
            calificacion_promedio=4.3,
        )
        r3 = resturantes_model.Restaurantes(
            nombre="Burger House",
            categoria="hamburguesas",
            direccion="Santa Fe 980",
            calificacion_promedio=4.5,
        )
        db.add_all([r1, r2, r3])
        db.flush()

        db.add_all(
            [
                zonas_cobertura_model.ZonasCobertura(
                    restaurante_id=r1.id, nombre="Belgrano", codigo_postal="1425"
                ),
                zonas_cobertura_model.ZonasCobertura(
                    restaurante_id=r2.id, nombre="Centro", codigo_postal="1043"
                ),
                zonas_cobertura_model.ZonasCobertura(
                    restaurante_id=r3.id, nombre="Palermo", codigo_postal="1414"
                ),
            ]
        )

        db.add_all(
            [
                platos_model.Platos(
                    restaurante_id=r1.id,
                    nombre="Roll Philadelphia",
                    descripcion="Salmón, queso crema, palta",
                    precio=4500,
                    disponible=True,
                ),
                platos_model.Platos(
                    restaurante_id=r1.id,
                    nombre="Roll California",
                    descripcion="Cangrejo, palta",
                    precio=4200,
                    disponible=True,
                ),
                platos_model.Platos(
                    restaurante_id=r2.id,
                    nombre="Muzzarella",
                    descripcion="Pizza clásica",
                    precio=5200,
                    disponible=True,
                ),
                platos_model.Platos(
                    restaurante_id=r3.id,
                    nombre="Cheeseburger",
                    descripcion="Doble carne",
                    precio=4800,
                    disponible=True,
                ),
            ]
        )

        c1 = clientes_model.Clientes(
            nombre="Lucía Pérez",
            email="lucia@mail.com",
            direccion="Av. Belgrano 100",
            telefono="11-2222-3333",
        )
        c2 = clientes_model.Clientes(
            nombre="Martín Gómez",
            email="martin@mail.com",
            direccion="Salguero 880",
            telefono="11-4444-5555",
        )
        db.add_all([c1, c2])

        rep1 = repartidor_model.Repartidor(nombre="Juan Díaz", vehiculo="moto", disponible=True)
        rep2 = repartidor_model.Repartidor(nombre="Ana Ríos", vehiculo="bici", disponible=False)
        rep3 = repartidor_model.Repartidor(nombre="Pedro Luna", vehiculo="moto", disponible=True)
        db.add_all([rep1, rep2, rep3])

        venc = (datetime.utcnow() + timedelta(days=365)).strftime("%Y-%m-%d")
        db.add_all(
            [
                cupones_model.Cupones(
                    codigo="BIENVENIDO20",
                    porcentaje_descuento=20,
                    fecha_vencimiento=venc,
                    usos_maximos=100,
                    usos_actuales=0,
                ),
                cupones_model.Cupones(
                    codigo="VERANO10",
                    porcentaje_descuento=10,
                    fecha_vencimiento=venc,
                    usos_maximos=500,
                    usos_actuales=0,
                ),
            ]
        )

        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    create_schema()
    seed()
    print("DB initialized with seed data")
