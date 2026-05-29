from sqlalchemy import Column, Integer, String, Boolean

from src.db.connection import Base


class Repartidor(Base):
    __tablename__ = "repartidores"

    id = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    vehiculo = Column(String(50), nullable=False)
    disponible = Column(Boolean, default=True)
