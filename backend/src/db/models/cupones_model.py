from sqlalchemy import Column, Integer, String
from sqlalchemy.sql import func

from src.db.connection import Base


class Cupones(Base):
    __tablename__ = "cupones"

    id = Column(Integer, primary_key=True)
    codigo = Column(String, unique=True, nullable=False)#
    porcentaje_descuento = Column(Integer, nullable=False)#
    fecha_expiracion = Column(String, nullable=False)#
    telefono = Column(Integer, nullable=False)#
    uso_maximo = Column(Integer, nullable=False)#
    usos_actuales = Column(Integer, default=0)#