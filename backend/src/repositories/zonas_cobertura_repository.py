from sqlalchemy.orm import Session

from src.db.models.zonas_cobertura_model import ZonasCobertura


class ZonaCoberturaRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        nombre: str,
        restaurante_id: int,
        role: str = "cliente",
        codigo_postal: str = ""
    ) -> ZonasCobertura:

        zona = ZonasCobertura(
            nombre=nombre,
            restaurante_id=restaurante_id,
            role=role,
            codigo_postal=codigo_postal
        )

        self.db.add(zona)
        self.db.commit()
        self.db.refresh(zona)

        return zona

    def find_by_id(self, zona_id: int) -> ZonasCobertura | None:
        return (
            self.db.query(ZonasCobertura)
            .filter(ZonasCobertura.id == zona_id)
            .first()
        )

    def list_all(self) -> list[ZonasCobertura]:
        return self.db.query(ZonasCobertura).all()

    def find_by_restaurante(
        self,
        restaurante_id: int
    ) -> list[ZonasCobertura]:

        return (
            self.db.query(ZonasCobertura)
            .filter(
                ZonasCobertura.restaurante_id == restaurante_id
            )
            .all()
        )

    def update(
        self,
        zona_id: int,
        **fields
    ) -> ZonasCobertura | None:

        zona = (
            self.db.query(ZonasCobertura)
            .filter(ZonasCobertura.id == zona_id)
            .first()
        )

        if not zona:
            return None

        for key, value in fields.items():
            setattr(zona, key, value)

        self.db.commit()
        self.db.refresh(zona)

        return zona

    def delete(self, zona_id: int) -> bool:
        zona = (
            self.db.query(ZonasCobertura)
            .filter(ZonasCobertura.id == zona_id)
            .first()
        )

        if not zona:
            return False

        self.db.delete(zona)
        self.db.commit()

        return True