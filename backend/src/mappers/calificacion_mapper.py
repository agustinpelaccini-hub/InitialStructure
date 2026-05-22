from src.db.models.calificion_model import Restaurantes
from src.dtos.calificacion_dto import RestaurantResponseDTO


def to_calificacion_response(calificacion: Calificaciones) -> CalificacionResponseDTO:
    """Convierte un Model SQLAlchemy en un DTO de respuesta (sin campos sensibles)."""
    return CalificacionResponseDTO.model_validate(calificacion)