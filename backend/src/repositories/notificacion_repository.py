from sqlalchemy.orm import Session

from src.db.models.notificacion_model import Notificacion
from src.db.models.pedido_model import Pedidos


class NotificacionRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, pedido_id: int, estado_nuevo: str) -> Notificacion:
        n = Notificacion(pedido_id=pedido_id, estado_nuevo=estado_nuevo, leida=False)
        self.db.add(n)
        self.db.commit()
        self.db.refresh(n)
        return n

    def find_by_id(self, notificacion_id: int) -> Notificacion | None:
        return self.db.query(Notificacion).filter(Notificacion.id == notificacion_id).first()

    def list_all(self) -> list[Notificacion]:
        return self.db.query(Notificacion).all()

    def find_by_cliente(self, cliente_id: int) -> list[Notificacion]:
        return (
            self.db.query(Notificacion)
            .join(Pedidos, Pedidos.id == Notificacion.pedido_id)
            .filter(Pedidos.cliente_id == cliente_id)
            .order_by(Notificacion.leida.asc(), Notificacion.fecha.desc())
            .all()
        )

    def update(self, notificacion_id: int, **fields) -> Notificacion | None:
        n = self.find_by_id(notificacion_id)
        if not n:
            return None
        for key, value in fields.items():
            setattr(n, key, value)
        self.db.commit()
        self.db.refresh(n)
        return n
