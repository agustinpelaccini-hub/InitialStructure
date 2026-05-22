from src.db.models.pedido_model import Pedidos
from src.dtos.pedido_dto import PedidoResponseDTO


def to_pedido_response(pedido: Pedidos) -> PedidoResponseDTO:
    """Convierte un Model SQLAlchemy en un DTO de respuesta (sin campos sensibles)."""
    return PedidoResponseDTO.model_validate(pedido)