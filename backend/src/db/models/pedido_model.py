from sqlalchemy import Column, Integer, String, Numeric
from sqlalchemy.sql import func

from src.db.connection import Base


class Pedidos(Base):
    __tablename__ = "pedidos"

    id = Column(Integer, primary_key=True)
    cliente_id = Column(Integer, nullable=False)
    restaurante_id = Column(Integer, nullable=False)
    repartidor_id = Column(Integer, nullable=True)
    cupon_id = Column(Integer, nullable=True)
    fecha = Column(String, server_default=func.now())
    estado = Column(String(20), default="pendiente")
    subtotal = Column(Numeric(10, 2), default=0)
    total = Column(Numeric(10, 2), default=0)
    direccion_entrega = Column(String, nullable=False)
    codigo_postal_entrega = Column(String(10), nullable=False)
