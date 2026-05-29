from sqlalchemy.orm import Session

from src.db.models.platos_model import Platos


class PlatoRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        restaurante_id: int,
        nombre: str,
        descripcion: str | None,
        precio: float,
        disponible: bool = True
    ) -> Platos:

        plato = Platos(
            restaurante_id=restaurante_id,
            nombre=nombre,
            descripcion=descripcion,
            precio=precio,
            disponible=disponible
        )

        self.db.add(plato)
        self.db.commit()
        self.db.refresh(plato)

        return plato

    def find_by_id(self, plato_id: int) -> Platos | None:
        return (
            self.db.query(Platos)
            .filter(Platos.id == plato_id)
            .first()
        )

    def list_all(self) -> list[Platos]:
        return self.db.query(Platos).all()

    def find_by_restaurante(self, restaurante_id: int) -> list[Platos]:
        return (
            self.db.query(Platos)
            .filter(Platos.restaurante_id == restaurante_id)
            .all()
        )

    def find_disponibles(self) -> list[Platos]:
        return (
            self.db.query(Platos)
            .filter(Platos.disponible == True)
            .all()
        )

    def update(self, plato_id: int, **fields) -> Platos | None:
        plato = (
            self.db.query(Platos)
            .filter(Platos.id == plato_id)
            .first()
        )

        if not plato:
            return None

        for key, value in fields.items():
            setattr(plato, key, value)

        self.db.commit()
        self.db.refresh(plato)

        return plato

    def delete(self, plato_id: int) -> bool:
        plato = (
            self.db.query(Platos)
            .filter(Platos.id == plato_id)
            .first()
        )

        if not plato:
            return False

        self.db.delete(plato)
        self.db.commit()

        return True