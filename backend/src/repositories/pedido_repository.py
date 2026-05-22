from sqlalchemy.orm import Session

from src.db.models.pedidos_model import Pedidos


class PedidoRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        cliente_id: int,
        restaurante_id: int,
        repartidor_id: int | None,
        cupon_id: int | None,
        estado: str,
        subtotal: int,
        total: int,
        direccion_entrega: str,
        codigo_postal_entrega: str
    ) -> Pedidos:

        pedido = Pedidos(
            cliente_id=cliente_id,
            restaurante_id=restaurante_id,
            repartidor_id=repartidor_id,
            cupon_id=cupon_id,
            estado=estado,
            subtotal=subtotal,
            total=total,
            direccion_entrega=direccion_entrega,
            codigo_postal_entrega=codigo_postal_entrega
        )

        self.db.add(pedido)
        self.db.commit()
        self.db.refresh(pedido)

        return pedido

    def find_by_id(self, pedido_id: int) -> Pedidos | None:
        return (
            self.db.query(Pedidos)
            .filter(Pedidos.id == pedido_id)
            .first()
        )

    def list_all(self) -> list[Pedidos]:
        return self.db.query(Pedidos).all()

    def find_by_cliente(self, cliente_id: int) -> list[Pedidos]:
        return (
            self.db.query(Pedidos)
            .filter(Pedidos.cliente_id == cliente_id)
            .all()
        )

    def find_by_restaurante(self, restaurante_id: int) -> list[Pedidos]:
        return (
            self.db.query(Pedidos)
            .filter(Pedidos.restaurante_id == restaurante_id)
            .all()
        )

    def find_by_estado(self, estado: str) -> list[Pedidos]:
        return (
            self.db.query(Pedidos)
            .filter(Pedidos.estado == estado)
            .all()
        )

    def update(self, pedido_id: int, **fields) -> Pedidos | None:
        pedido = (
            self.db.query(Pedidos)
            .filter(Pedidos.id == pedido_id)
            .first()
        )

        if not pedido:
            return None

        for key, value in fields.items():
            setattr(pedido, key, value)

        self.db.commit()
        self.db.refresh(pedido)

        return pedido

    def delete(self, pedido_id: int) -> bool:
        pedido = (
            self.db.query(Pedidos)
            .filter(Pedidos.id == pedido_id)
            .first()
        )

        if not pedido:
            return False

        self.db.delete(pedido)
        self.db.commit()

        return True