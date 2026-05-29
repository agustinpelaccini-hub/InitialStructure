from sqlalchemy.orm import Session

from src.db.models.zonas_cobertura_model import ZonasCobertura


class ZonaCoberturaRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, restaurante_id: int, nombre: str, codigo_postal: str) -> ZonasCobertura:
        zona = ZonasCobertura(
            restaurante_id=restaurante_id,
            nombre=nombre,
            codigo_postal=codigo_postal,
        )
        self.db.add(zona)
        self.db.commit()
        self.db.refresh(zona)
        return zona

    def find_by_id(self, zona_id: int) -> ZonasCobertura | None:
        return self.db.query(ZonasCobertura).filter(ZonasCobertura.id == zona_id).first()

    def list_all(self) -> list[ZonasCobertura]:
        return self.db.query(ZonasCobertura).all()

    def find_by_restaurante(self, restaurante_id: int) -> list[ZonasCobertura]:
        return (
            self.db.query(ZonasCobertura)
            .filter(ZonasCobertura.restaurante_id == restaurante_id)
            .all()
        )

    def covers_postal(self, restaurante_id: int, codigo_postal: str) -> bool:
        return (
            self.db.query(ZonasCobertura)
            .filter(
                ZonasCobertura.restaurante_id == restaurante_id,
                ZonasCobertura.codigo_postal == codigo_postal,
            )
            .first()
            is not None
        )

    def delete(self, zona_id: int) -> bool:
        zona = self.find_by_id(zona_id)
        if not zona:
            return False
        self.db.delete(zona)
        self.db.commit()
        return True
