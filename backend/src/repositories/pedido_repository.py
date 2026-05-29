from sqlalchemy.orm import Session

from src.db.models.pedido_model import Pedidos


class PedidoRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, **fields) -> Pedidos:
        pedido = Pedidos(**fields)
        self.db.add(pedido)
        self.db.commit()
        self.db.refresh(pedido)
        return pedido

    def find_by_id(self, pedido_id: int) -> Pedidos | None:
        return self.db.query(Pedidos).filter(Pedidos.id == pedido_id).first()

    def list_all(self, limit: int | None = None) -> list[Pedidos]:
        q = self.db.query(Pedidos).order_by(Pedidos.fecha.desc())
        if limit:
            q = q.limit(limit)
        return q.all()

    def find_by_cliente(self, cliente_id: int, estado: str | None = None) -> list[Pedidos]:
        q = self.db.query(Pedidos).filter(Pedidos.cliente_id == cliente_id)
        if estado:
            q = q.filter(Pedidos.estado == estado)
        return q.order_by(Pedidos.fecha.desc()).all()

    def find_by_restaurante(self, restaurante_id: int) -> list[Pedidos]:
        return (
            self.db.query(Pedidos)
            .filter(Pedidos.restaurante_id == restaurante_id)
            .order_by(Pedidos.fecha.desc())
            .all()
        )

    def find_by_repartidor(self, repartidor_id: int) -> list[Pedidos]:
        return (
            self.db.query(Pedidos)
            .filter(Pedidos.repartidor_id == repartidor_id)
            .order_by(Pedidos.fecha.desc())
            .all()
        )

    def update(self, pedido_id: int, **fields) -> Pedidos | None:
        pedido = self.find_by_id(pedido_id)
        if not pedido:
            return None
        for key, value in fields.items():
            setattr(pedido, key, value)
        self.db.commit()
        self.db.refresh(pedido)
        return pedido

    def delete(self, pedido_id: int) -> bool:
        pedido = self.find_by_id(pedido_id)
        if not pedido:
            return False
        self.db.delete(pedido)
        self.db.commit()
        return True
