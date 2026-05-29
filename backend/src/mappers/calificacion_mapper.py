from src.db.models.calificacion_model import Calificacion
from src.dtos.calificacion_dto import CalificacionResponseDTO


def to_calificacion_response(calificacion: Calificacion) -> CalificacionResponseDTO:
    return CalificacionResponseDTO.model_validate(calificacion)
