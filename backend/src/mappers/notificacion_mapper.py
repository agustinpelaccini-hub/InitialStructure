from src.db.models.notificacion_model import Notificacion
from src.dtos.notificacion_dto import NotificacionResponseDTO


def to_notificacion_response(notificacion: Notificacion) -> NotificacionResponseDTO:
    return NotificacionResponseDTO.model_validate(notificacion)
