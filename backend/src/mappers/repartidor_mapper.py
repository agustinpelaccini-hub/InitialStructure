from src.db.models.repartidor_model import Repartidores
from src.dtos.pedido_dto import RepartidorResponseDTO


def to_repartidor_response(repartidor: Repartidores) -> RepartidorResponseDTO:
    """Convierte un Model SQLAlchemy en un DTO de respuesta (sin campos sensibles)."""
    return RepartidorResponseDTO.model_validate(repartidor)