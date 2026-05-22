from sqlalchemy.orm import Session

from src.db.models.pedido_plato_model import PedidoPlato


class PedidoPlatoRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        pedido_id: int,
        plato_id: int,
        cantidad: int,
        precio_unitario: int
    ) -> PedidoPlato:

        pedido_plato = PedidoPlato(
            pedido_id=pedido_id,
            plato_id=plato_id,
            cantidad=cantidad,
            precio_unitario=precio_unitario
        )

        self.db.add(pedido_plato)
        self.db.commit()
        self.db.refresh(pedido_plato)

        return pedido_plato

    def find_by_id(self, pedido_plato_id: int) -> PedidoPlato | None:
        return (
            self.db.query(PedidoPlato)
            .filter(PedidoPlato.id == pedido_plato_id)
            .first()
        )

    def list_all(self) -> list[PedidoPlato]:
        return self.db.query(PedidoPlato).all()

    def find_by_pedido(self, pedido_id: int) -> list[PedidoPlato]:
        return (
            self.db.query(PedidoPlato)
            .filter(PedidoPlato.pedido_id == pedido_id)
            .all()
        )

    def find_by_plato(self, plato_id: int) -> list[PedidoPlato]:
        return (
            self.db.query(PedidoPlato)
            .filter(PedidoPlato.plato_id == plato_id)
            .all()
        )

    def update(self, pedido_plato_id: int, **fields) -> PedidoPlato | None:
        pedido_plato = (
            self.db.query(PedidoPlato)
            .filter(PedidoPlato.id == pedido_plato_id)
            .first()
        )

        if not pedido_plato:
            return None

        for key, value in fields.items():
            setattr(pedido_plato, key, value)

        self.db.commit()
        self.db.refresh(pedido_plato)

        return pedido_plato

    def delete(self, pedido_plato_id: int) -> bool:
        pedido_plato = (
            self.db.query(PedidoPlato)
            .filter(PedidoPlato.id == pedido_plato_id)
            .first()
        )

        if not pedido_plato:
            return False

        self.db.delete(pedido_plato)
        self.db.commit()

        return True