from sqlalchemy.orm import Session

from src.dtos.pedido_dto import (
    CreatePedidoDTO,
    UpdatePedidoDTO,
    GetPedidoDTO,
    DeletePedidoDTO,
    PedidoResponseDTO
)

from src.mappers.pedido_mapper import to_pedido_response
from src.repositories.pedidos_repository import PedidoRepository
from src.exceptions import NotFoundError


class PedidoService:
    def __init__(self, db: Session):
        self.repo = PedidoRepository(db)

    def create(self, dto: CreatePedidoDTO) -> PedidoResponseDTO:
        """Crea un pedido y devuelve el DTO de respuesta."""

        pedido = self.repo.create(
            cliente_id=dto.cliente_id,
            restaurante_id=dto.restaurante_id,
            repartidor_id=dto.repartidor_id,
            cupon_id=dto.cupon_id,
            estado=dto.estado,
            subtotal=dto.subtotal,
            total=dto.total,
            direccion_entrega=dto.direccion_entrega,
            codigo_postal_entrega=dto.codigo_postal_entrega
        )

        return to_pedido_response(pedido)

    def get_by_id(self, pedido_id: int) -> PedidoResponseDTO:
        pedido = self.repo.find_by_id(pedido_id)

        if not pedido:
            raise NotFoundError(
                f"Pedido con id {pedido_id} no encontrado"
            )

        return to_pedido_response(pedido)

    def list_all(self) -> list[PedidoResponseDTO]:
        pedidos = self.repo.list_all()

        return [
            to_pedido_response(p)
            for p in pedidos
        ]

    def get_by_cliente(
        self,
        cliente_id: int
    ) -> list[PedidoResponseDTO]:

        pedidos = self.repo.find_by_cliente(cliente_id)

        return [
            to_pedido_response(p)
            for p in pedidos
        ]

    def get_by_restaurante(
        self,
        restaurante_id: int
    ) -> list[PedidoResponseDTO]:

        pedidos = self.repo.find_by_restaurante(restaurante_id)

        return [
            to_pedido_response(p)
            for p in pedidos
        ]

    def get_by_estado(
        self,
        estado: str
    ) -> list[PedidoResponseDTO]:

        pedidos = self.repo.find_by_estado(estado)

        return [
            to_pedido_response(p)
            for p in pedidos
        ]

    def update(
        self,
        pedido_id: int,
        dto: UpdatePedidoDTO
    ) -> PedidoResponseDTO:

        pedido = self.repo.update(
            pedido_id,
            **dto.dict(exclude_unset=True)
        )

        if not pedido:
            raise NotFoundError(
                f"Pedido con id {pedido_id} no encontrado"
            )

        return to_pedido_response(pedido)

    def delete(self, pedido_id: int) -> None:
        success = self.repo.delete(pedido_id)

        if not success:
            raise NotFoundError(
                f"Pedido con id {pedido_id} no encontrado"
            )