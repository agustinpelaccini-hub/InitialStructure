from sqlalchemy import Column, Integer, String

from src.db.connection import Base


class ZonasCobertura(Base):
    __tablename__ = "zonas_cobertura"

    id = Column(Integer, primary_key=True)
    restaurante_id = Column(Integer, nullable=False)
    nombre = Column(String(100), nullable=False)
    codigo_postal = Column(String(10), nullable=False)
