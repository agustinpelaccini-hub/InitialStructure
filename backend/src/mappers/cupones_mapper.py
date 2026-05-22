from src.db.models.cupones_model import Cupones
from src.dtos.cupones_dto import RestaurantResponseDTO


def to_cupones_response(cupones: Cupones) -> CuponesResponseDTO:
    """Convierte un Model SQLAlchemy en un DTO de respuesta (sin campos sensibles)."""
    return CuponesResponseDTO.model_validate(cupones)