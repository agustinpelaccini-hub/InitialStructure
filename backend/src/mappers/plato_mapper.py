from src.db.models.platos_model import Plato
from src.dtos.platos_dto import PlatoResponseDTO


def to_plato_response(plato: Plato) -> PlatoResponseDTO:
    """Convierte un Model SQLAlchemy en un DTO de respuesta (sin campos sensibles)."""
    return PlatoResponseDTO.model_validate(plato)