from sqlalchemy import func
from sqlalchemy.orm import Session

from src.db.models.pedido_plato_model import PedidoPlato
from src.db.models.platos_model import Platos


class PedidoPlatoRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, pedido_id: int, plato_id: int, cantidad: int, precio_unitario: float) -> PedidoPlato:
        row = PedidoPlato(
            pedido_id=pedido_id,
            plato_id=plato_id,
            cantidad=cantidad,
            precio_unitario=precio_unitario,
        )
        self.db.add(row)
        self.db.commit()
        return row

    def find_by_pedido(self, pedido_id: int) -> list[PedidoPlato]:
        return self.db.query(PedidoPlato).filter(PedidoPlato.pedido_id == pedido_id).all()

    def top_platos(self, limit: int = 10) -> list[dict]:
        rows = (
            self.db.query(
                Platos.id,
                Platos.nombre,
                Platos.restaurante_id,
                func.sum(PedidoPlato.cantidad).label("cantidad_total"),
            )
            .join(Platos, Platos.id == PedidoPlato.plato_id)
            .group_by(Platos.id, Platos.nombre, Platos.restaurante_id)
            .order_by(func.sum(PedidoPlato.cantidad).desc())
            .limit(limit)
            .all()
        )
        return [
            {
                "id": r.id,
                "nombre": r.nombre,
                "restaurante_id": r.restaurante_id,
                "cantidad_total": int(r.cantidad_total),
            }
            for r in rows
        ]
