from sqlalchemy import Column, Integer, String, Boolean, Datetime
from sqlalchemy.sql import func

from src.db.connection import Base


class Restaurantes(Base):
    __tablename__ = "restaurantes"

    id = Column(Integer, primary_key=True)
    nombre = Column(String, nullable=False)
    categoria = Column(String, nullable=False)#
    direccion = Column(String, nullable=False)#
    calificacion = Column(Integer, nullable=True)#
    telefono = Column(String, nullable=False)##