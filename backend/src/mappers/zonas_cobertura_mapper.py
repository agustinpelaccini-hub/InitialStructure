from src.db.models.zonas_cobertura_model import ZonasCobertura
from src.dtos.zona_cobertura_dto import ZonaCoberturaResponseDTO


def to_zona_cobertura_response(zona: ZonasCobertura) -> ZonaCoberturaResponseDTO:
    return ZonaCoberturaResponseDTO(
        id=zona.id,
        nombre=zona.nombre,
        restaurante_id=zona.restaurante_id,
        codigo_postal=zona.codigo_postal,
    )
