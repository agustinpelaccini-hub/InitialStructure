from sqlalchemy import Column, Integer, String, Boolean, Datetime
from sqlalchemy.sql import func

from src.db.connection import Base


class Pedidos(Base):
    __tablename__ = "pedidos"

    id = Column(Integer, primary_key=True)
    cliente_id = Column(Integer, nullable=False)#
    restaurante_id = Column(Integer, nullable=False)#
    repartidor_id = Column(Integer, nullable=True)#
    cupon_id = Column(Integer, nullable=True)#
    fecha = Column(String, default=func.now())#
    estado = Column(String, default='pendiente')#
    subtotal = Column(Integer, nullable=False)#
    total = Column(Integer, nullable=False)#
    direccion_entrega = Column(String, nullable=False)#
    codigo_postal_entrega = Column(String, nullable=False)#