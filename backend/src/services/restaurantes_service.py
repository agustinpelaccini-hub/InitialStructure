from sqlalchemy.orm import Session

from src.dtos.restaurantes_dto import CreateRestaurantDTO, UpdateRestaurantDTO, GetRestaurantDTO, DeleteRestaurantDTO, RestaurantResponseDTO
from src.mappers.restaurantes_mapper import to_restaurant_response
from src.repositories.restaurantes_repository import RestaurantRepository


class RestaurantService:
    def __init__(self, db: Session):
        self.repo = RestaurantRepository(db)

    def create(self, dto: CreateRestaurantDTO) -> RestaurantResponseDTO:
        """Ejemplo completo: crea el restaurante y devuelve el DTO de respuesta."""
        restaurant = self.repo.create(
            nombre=dto.nombre,
            categoria=dto.categoria,
            direccion=dto.direccion,
            calificacion=dto.calificacion,
            telefono=dto.telefono
        )
        return to_restaurant_response(restaurant)

    def get_by_id(self, restaurant_id: int) -> RestaurantResponseDTO:
        restaurant = self.repo.find_by_id(restaurant_id)
        if not restaurant:
            raise NotFoundError(f"Restaurante con id {restaurant_id} no encontrado")
        return to_restaurant_response(restaurant)

    def list_all(self) -> list[RestaurantResponseDTO]:
        restaurants = self.repo.list_all()
        return [to_restaurant_response(r) for r in restaurants]

    def update(self, restaurant_id: int, dto: UpdateRestaurantDTO) -> RestaurantResponseDTO:
        restaurant = self.repo.update(restaurant_id, **dto.dict(exclude_unset=True))
        if not restaurant:
            raise NotFoundError(f"Restaurante con id {restaurant_id} no encontrado")
        return to_restaurant_response(restaurant)
    
    def delete(self, restaurant_id: int) -> None:
        success = self.repo.delete(restaurant_id)
        if not success:
            raise NotFoundError(f"Restaurante con id {restaurant_id} no encontrado")
