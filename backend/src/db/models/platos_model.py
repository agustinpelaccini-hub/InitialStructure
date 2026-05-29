from sqlalchemy import Column, Integer, String, Boolean, Numeric

from src.db.connection import Base


class Platos(Base):
    __tablename__ = "platos"

    id = Column(Integer, primary_key=True)
    restaurante_id = Column(Integer, nullable=False)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(String, nullable=True)
    precio = Column(Numeric(10, 2), nullable=False)
    disponible = Column(Boolean, default=True)
