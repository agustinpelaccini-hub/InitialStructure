from sqlalchemy import Column, Integer, String
from sqlalchemy.sql import func

from src.db.connection import Base


class Calificacion(Base):
    __tablename__ = "calificaciones"

    id = Column(Integer, primary_key=True)
    pedido_id = Column(Integer, unique=True, nullable=False)
    puntaje = Column(Integer, nullable=False)
    comentario = Column(String, nullable=True)
    fecha = Column(String, server_default=func.now())
