from src.db.models.pedido_plato_model import PedidosPlato
from src.dtos.pedido_plato_dto import PedidoPlatoResponseDTO


def to_pedido_response(pedido: PedidosPlato) -> PedidoPlatoResponseDTO:
    """Convierte un Model SQLAlchemy en un DTO de respuesta (sin campos sensibles)."""
    return PedidoPlatoResponseDTO.model_validate(pedido)