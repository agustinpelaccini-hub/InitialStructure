from src.db.models.notificacion_model import Notificaciones
from src.dtos.notificaciones_dto import NotificacionesResponseDTO


def to_notificaciones_response(notificacion: Notificaciones) -> NotificacionesResponseDTO:
    """Convierte un Model SQLAlchemy en un DTO de respuesta (sin campos sensibles)."""
    return NotificacionesResponseDTO.model_validate(notificacion)