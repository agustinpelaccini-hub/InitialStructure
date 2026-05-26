"""Create DB schema and seed minimal data if missing.
"""
from src.db.connection import engine, SessionLocal
from src.db.models import resturantes_model, clientes_model, platos_model, repartidor_model
from src.db.connection import Base


def create_schema():
    Base.metadata.create_all(bind=engine)


def seed():
    db = SessionLocal()
    try:
        # Restaurantes
        if db.query(resturantes_model.Restaurantes).count() == 0:
            r1 = resturantes_model.Restaurantes(nombre="Sushi Zen", categoria="sushi", direccion="Av. Cabildo 2200", calificacion=47, telefono="111222333")
            r2 = resturantes_model.Restaurantes(nombre="La Pizzería", categoria="pizza", direccion="Corrientes 1234", calificacion=43, telefono="114445555")
            db.add_all([r1, r2])

        # Platos
        if db.query(platos_model.Platos).count() == 0:
            p1 = platos_model.Platos(restaurante_id=1, nombre="Roll Philadelphia", descripcion="Salmón, queso crema, palta", precio=4500, disponible=True)
            p2 = platos_model.Platos(restaurante_id=2, nombre="Muzzarella", descripcion="Pizza clásica", precio=5200, disponible=True)
            db.add_all([p1, p2])

        # Clientes
        if db.query(clientes_model.Clientes).count() == 0:
            c1 = clientes_model.Clientes(email="lucia@mail.com", nombre="Lucía Pérez", direccion="Av. Belgrano 100", telefono=1122223333)
            c2 = clientes_model.Clientes(email="martin@mail.com", nombre="Martín Gómez", direccion="Salguero 880", telefono=1144445555)
            db.add_all([c1, c2])

        # Repartidores
        if db.query(repartidor_model.Repartidor).count() == 0:
            rep1 = repartidor_model.Repartidor(nombre="Juan Díaz", telefono=1133344455, vehiculo="moto", disponible=True)
            rep2 = repartidor_model.Repartidor(nombre="Ana Ríos", telefono=1166677788, vehiculo="bici", disponible=False)
            db.add_all([rep1, rep2])

        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    create_schema()
    seed()
    print("DB initialized")
