from src.db.models.zonas_cobertura_model import ZonasCobertura
from src.dtos.zonas_cobertura_dto import ZonasCoberturaResponseDTO


def to_zonas_cobertura_response(zona: ZonasCobertura) -> ZonasCoberturaResponseDTO:
    """Convierte un Model SQLAlchemy en un DTO de respuesta (sin campos sensibles)."""
    return ZonasCoberturaResponseDTO.model_validate(zona)