from sqlalchemy import Column, Integer, Numeric

from src.db.connection import Base


class PedidoPlato(Base):
    __tablename__ = "pedido_platos"

    pedido_id = Column(Integer, primary_key=True)
    plato_id = Column(Integer, primary_key=True)
    cantidad = Column(Integer, nullable=False)
    precio_unitario = Column(Numeric(10, 2), nullable=False)
