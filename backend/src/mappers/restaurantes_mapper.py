from src.db.models.resturantes_model import Restaurantes
from src.dtos.restaurantes_dto import RestaurantResponseDTO


def to_restaurant_response(restaurant: Restaurantes) -> RestaurantResponseDTO:
    """Convierte un Model SQLAlchemy en un DTO de respuesta (sin campos sensibles)."""
    return RestaurantResponseDTO.model_validate(restaurant)
