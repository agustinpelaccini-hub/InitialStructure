from sqlalchemy import Column, Integer, String, Numeric

from src.db.connection import Base


class Restaurantes(Base):
    __tablename__ = "restaurantes"

    id = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    categoria = Column(String(50), nullable=False)
    direccion = Column(String, nullable=False)
    calificacion_promedio = Column(Numeric(3, 2), default=0)
