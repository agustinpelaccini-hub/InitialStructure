from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.sql import func

from src.db.connection import Base


class Calificacion(Base):
    __tablename__ = "calificaciones"

    id = Column(Integer, primary_key=True)
    pedido_id = Column(Integer, nullable=False)#
    cliente_id = Column(Integer, nullable=False)##
    puntaje = Column(Integer, nullable=False)#
    comentario = Column(String, nullable=True)#
    fecha = Column(String, default=func.now())#

  