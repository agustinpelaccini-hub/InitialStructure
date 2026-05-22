from src.db.models.cupones_model import Cupones
from src.dtos.cupones_dto import CuponResponseDTO, CuponResponseDTOResponseDTO


def to_cupones_response(cupones: Cupones) -> CuponResponseDTO:
    """Convierte un Model SQLAlchemy en un DTO de respuesta (sin campos sensibles)."""
    return CuponResponseDTO.model_validate(cupones)