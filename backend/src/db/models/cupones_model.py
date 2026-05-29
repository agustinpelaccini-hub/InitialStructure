from sqlalchemy import Column, Integer, String

from src.db.connection import Base


class Cupones(Base):
    __tablename__ = "cupones"

    id = Column(Integer, primary_key=True)
    codigo = Column(String(20), unique=True, nullable=False)
    porcentaje_descuento = Column(Integer, nullable=False)
    fecha_vencimiento = Column(String, nullable=False)
    usos_maximos = Column(Integer, nullable=False)
    usos_actuales = Column(Integer, default=0)
