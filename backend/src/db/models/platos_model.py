from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.sql import func

from src.db.connection import Base


class Platos(Base):
    __tablename__ = "platos"

    id = Column(Integer, primary_key=True)
    restaurante_id = Column(Integer, nullable=False)
    nombre = Column(String, nullable=False)
    descripcion = Column(String, nullable=True)
    precio = Column(Integer, nullable=False)
    disponible = Column(Boolean, default=True)
  