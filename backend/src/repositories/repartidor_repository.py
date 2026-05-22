from sqlalchemy.orm import Session

from src.db.models.repartidor_model import Repartidor


class RepartidorRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        nombre: str,
        telefono: int,
        role: str = "repartidor",
        vehiculo: str = "",
        disponible: bool = True
    ) -> Repartidor:

        repartidor = Repartidor(
            nombre=nombre,
            telefono=telefono,
            role=role,
            vehiculo=vehiculo,
            disponible=disponible
        )

        self.db.add(repartidor)
        self.db.commit()
        self.db.refresh(repartidor)

        return repartidor

    def find_by_id(self, repartidor_id: int) -> Repartidor | None:
        return (
            self.db.query(Repartidor)
            .filter(Repartidor.id == repartidor_id)
            .first()
        )

    def list_all(self) -> list[Repartidor]:
        return self.db.query(Repartidor).all()

    def find_disponibles(self) -> list[Repartidor]:
        return (
            self.db.query(Repartidor)
            .filter(Repartidor.disponible == True)
            .all()
        )

    def update(self, repartidor_id: int, **fields) -> Repartidor | None:
        repartidor = (
            self.db.query(Repartidor)
            .filter(Repartidor.id == repartidor_id)
            .first()
        )

        if not repartidor:
            return None

        for key, value in fields.items():
            setattr(repartidor, key, value)

        self.db.commit()
        self.db.refresh(repartidor)

        return repartidor

    def delete(self, repartidor_id: int) -> bool:
        repartidor = (
            self.db.query(Repartidor)
            .filter(Repartidor.id == repartidor_id)
            .first()
        )

        if not repartidor:
            return False

        self.db.delete(repartidor)
        self.db.commit()

        return True