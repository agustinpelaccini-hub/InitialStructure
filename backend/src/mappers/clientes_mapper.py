from src.db.models.clientes_model import Restaurantes
from src.dtos.clientes_dto import RestaurantResponseDTO


def to_clientes_response(clientes: Clientes) -> ClientesResponseDTO:
    """Convierte un Model SQLAlchemy en un DTO de respuesta (sin campos sensibles)."""
    return ClientesResponseDTO.model_validate(clientes)