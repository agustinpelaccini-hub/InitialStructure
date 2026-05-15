from sqlalchemy import Column, Integer, String, Boolean, Datetime
from sqlalchemy.sql import func

from src.db.connection import Base


class Clientes(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    nombre = Column(String, nullable=False)
    direccion = Column(String, nullable=False)
    telefono = Column(Integer, nullable=False)
    role = Column(String, default='cliente')
    created_at = Column(String, default=func.now())