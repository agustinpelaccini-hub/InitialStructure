from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.sql import func

from src.db.connection import Base


class Repartidor(Base):
    __tablename__ = "repartidores"

    id = Column(Integer, primary_key=True)
    nombre = Column(String, nullable=False)
    telefono = Column(Integer, nullable=False)##
    role = Column(String, default='repartidor')##
    vehiculo = Column(String, nullable=False)#
    disponible = Column(Boolean, default=True)#