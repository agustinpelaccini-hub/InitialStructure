from sqlalchemy.orm import Session

from src.db.models.cupones_model import Cupones


class CuponRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        codigo: str,
        porcentaje_descuento: int,
        fecha_vencimiento: str,
        usos_maximos: int,
        usos_actuales: int = 0,
    ) -> Cupones:
        cupon = Cupones(
            codigo=codigo,
            porcentaje_descuento=porcentaje_descuento,
            fecha_vencimiento=fecha_vencimiento,
            usos_maximos=usos_maximos,
            usos_actuales=usos_actuales,
        )
        self.db.add(cupon)
        self.db.commit()
        self.db.refresh(cupon)
        return cupon

    def find_by_id(self, cupon_id: int) -> Cupones | None:
        return self.db.query(Cupones).filter(Cupones.id == cupon_id).first()

    def find_by_codigo(self, codigo: str) -> Cupones | None:
        return self.db.query(Cupones).filter(Cupones.codigo == codigo).first()

    def list_all(self) -> list[Cupones]:
        return self.db.query(Cupones).all()

    def update(self, cupon_id: int, **fields) -> Cupones | None:
        cupon = self.find_by_id(cupon_id)
        if not cupon:
            return None
        for key, value in fields.items():
            setattr(cupon, key, value)
        self.db.commit()
        self.db.refresh(cupon)
        return cupon

    def delete(self, cupon_id: int) -> bool:
        cupon = self.find_by_id(cupon_id)
        if not cupon:
            return False
        self.db.delete(cupon)
        self.db.commit()
        return True
