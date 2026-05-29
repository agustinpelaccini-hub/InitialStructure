from src.db.models.platos_model import Platos
from src.dtos.platos_dto import PlatoResponseDTO


def to_plato_response(plato: Platos) -> PlatoResponseDTO:
    return PlatoResponseDTO(
        id=plato.id,
        restaurante_id=plato.restaurante_id,
        nombre=plato.nombre,
        descripcion=plato.descripcion,
        precio=float(plato.precio),
        disponible=plato.disponible,
    )
