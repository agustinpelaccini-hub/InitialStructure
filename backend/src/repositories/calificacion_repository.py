from sqlalchemy.orm import Session

from src.db.models.calificacion_model import Calificacion


class CalificacionRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, pedido_id: int, puntaje: int, comentario: str | None) -> Calificacion:
        cal = Calificacion(pedido_id=pedido_id, puntaje=puntaje, comentario=comentario)
        self.db.add(cal)
        self.db.commit()
        self.db.refresh(cal)
        return cal

    def find_by_pedido(self, pedido_id: int) -> Calificacion | None:
        return self.db.query(Calificacion).filter(Calificacion.pedido_id == pedido_id).first()

    def find_by_id(self, calificacion_id: int) -> Calificacion | None:
        return self.db.query(Calificacion).filter(Calificacion.id == calificacion_id).first()

    def list_all(self) -> list[Calificacion]:
        return self.db.query(Calificacion).all()
