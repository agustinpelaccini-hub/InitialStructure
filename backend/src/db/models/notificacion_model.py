from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.sql import func

from src.db.connection import Base


class Notificacion(Base):
    __tablename__ = "notificaciones"

    id = Column(Integer, primary_key=True)
    pedido_id = Column(Integer, nullable=False)
    estado_nuevo = Column(String(20), nullable=False)
    fecha = Column(String, server_default=func.now())
    leida = Column(Boolean, default=False)
