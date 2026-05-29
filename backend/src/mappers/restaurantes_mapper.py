from src.db.models.resturantes_model import Restaurantes
from src.dtos.restaurantes_dto import RestaurantResponseDTO


def to_restaurant_response(restaurant: Restaurantes) -> RestaurantResponseDTO:
    cal = restaurant.calificacion_promedio
    return RestaurantResponseDTO(
        id=restaurant.id,
        nombre=restaurant.nombre,
        categoria=restaurant.categoria,
        direccion=restaurant.direccion,
        calificacion_promedio=float(cal) if cal is not None else 0.0,
    )
