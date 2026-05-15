from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.sql import func

from src.db.connection import Base


class PedidoPlato(Base):
    __tablename__ = "pedido_plato"

    id = Column(Integer, primary_key=True)
    pedido_id = Column(Integer, nullable=False)#
    plato_id = Column(Integer, nullable=False)#
    cantidad = Column(Integer, nullable=False)#
    precio_unitario = Column(Integer, nullable=False)#

  