from src.db.models.repartidor_model import Repartidor
from src.dtos.repartidor_dto import RepartidorResponseDTO


def to_repartidor_response(repartidor: Repartidor) -> RepartidorResponseDTO:
    return RepartidorResponseDTO(
        id=repartidor.id,
        nombre=repartidor.nombre,
        vehiculo=repartidor.vehiculo,
        disponible=repartidor.disponible,
    )
