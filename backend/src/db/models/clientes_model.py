from sqlalchemy import Column, Integer, String
from sqlalchemy.sql import func

from src.db.connection import Base


class Clientes(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    direccion = Column(String, nullable=False)
    telefono = Column(String(20), nullable=False)
    role = Column(String(20), default="cliente")
    created_at = Column(String, server_default=func.now())
