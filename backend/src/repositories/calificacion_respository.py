from sqlalchemy.orm import Session

from src.db.models.calificacion_model import Calificacion


class CalificacionRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        pedido_id: int,
        cliente_id: int,
        puntaje: int,
        comentario: str | None
    ) -> Calificacion:

        calificacion = Calificacion(
            pedido_id=pedido_id,
            cliente_id=cliente_id,
            puntaje=puntaje,
            comentario=comentario
        )

        self.db.add(calificacion)
        self.db.commit()
        self.db.refresh(calificacion)

        return calificacion

    def find_by_id(self, calificacion_id: int) -> Calificacion | None:
        return (
            self.db.query(Calificacion)
            .filter(Calificacion.id == calificacion_id)
            .first()
        )

    def list_all(self) -> list[Calificacion]:
        return self.db.query(Calificacion).all()

    def update(self, calificacion_id: int, **fields) -> Calificacion | None:
        calificacion = (
            self.db.query(Calificacion)
            .filter(Calificacion.id == calificacion_id)
            .first()
        )

        if not calificacion:
            return None

        for key, value in fields.items():
            setattr(calificacion, key, value)

        self.db.commit()
        self.db.refresh(calificacion)

        return calificacion

    def delete(self, calificacion_id: int) -> bool:
        calificacion = (
            self.db.query(Calificacion)
            .filter(Calificacion.id == calificacion_id)
            .first()
        )

        if not calificacion:
            return False

        self.db.delete(calificacion)
        self.db.commit()

        return True