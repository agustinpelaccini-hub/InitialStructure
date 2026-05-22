from src.db.models.clientes_model import Clientes
from src.dtos.clientes_dto import ClienteResponseDTO


def to_clientes_response(clientes: Clientes) -> ClienteResponseDTO:
    """Convierte un Model SQLAlchemy en un DTO de respuesta (sin campos sensibles)."""
    return ClienteResponseDTO.model_validate(clientes)