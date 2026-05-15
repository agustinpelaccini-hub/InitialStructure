from sqlalchemy import Column, Integer, String
from sqlalchemy.sql import func

from src.db.connection import Base


class ZonasCobertura(Base):
    __tablename__ = "zonas_cobertura"

    id = Column(Integer, primary_key=True)
    nombre = Column(String, nullable=False)#
    restaurante_id = Column(Integer, nullable=False)
    role = Column(String, default='cliente')#revisar y pensar
    codigo_postal = Column(String, nullable=False)#