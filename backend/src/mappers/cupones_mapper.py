from src.db.models.cupones_model import Cupones
from src.dtos.cupones_dto import CuponResponseDTO


def to_cupones_response(cupon: Cupones) -> CuponResponseDTO:
    return CuponResponseDTO(
        id=cupon.id,
        codigo=cupon.codigo,
        porcentaje_descuento=cupon.porcentaje_descuento,
        fecha_vencimiento=cupon.fecha_vencimiento,
        usos_maximos=cupon.usos_maximos,
        usos_actuales=cupon.usos_actuales,
        porcentaje=cupon.porcentaje_descuento,
        vencimiento=cupon.fecha_vencimiento,
    )
