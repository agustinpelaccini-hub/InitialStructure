from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.sql import func

from src.db.connection import Base


class Notificacion(Base):
    __tablename__ = "notificaciones"

    id = Column(Integer, primary_key=True)
    pedido_id = Column(Integer, nullable=False)#
    estado_nuevo = Column(String, nullable=False)#
    usuario_id = Column(Integer, nullable=False)##
    leida = Column(Boolean, default=False)#
    fecha = Column(String, default=func.now())#
    precio = Column(Integer, nullable=False)##
  