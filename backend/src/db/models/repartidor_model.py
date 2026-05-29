from sqlalchemy import Column, Integer, String, Boolean

from src.db.connection import Base


class Repartidor(Base):
    __tablename__ = "repartidores"

    id = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=True)  # Temporalmente nullable
    password = Column(String(255), nullable=True)  # Temporalmente nullable
    vehiculo = Column(String(50), nullable=False)
    disponible = Column(Boolean, default=True)
