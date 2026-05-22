from src.db.models.calificacion_model import Calificaciones
from src.dtos.calificacion_dto import CalificacionResponseDTO


def to_calificacion_response(calificacion: Calificaciones) -> CalificacionResponseDTO:
    """Convierte un Model SQLAlchemy en un DTO de respuesta (sin campos sensibles)."""
    return CalificacionResponseDTO.model_validate(calificacion)