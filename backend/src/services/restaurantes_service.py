from sqlalchemy.orm import Session

from src.dtos.restaurantes_dto import CreateRestaurantDTO, UpdateRestaurantDTO, RestaurantResponseDTO
from src.mappers.restaurantes_mapper import to_restaurant_response
from src.repositories.restaurantes_repository import RestaurantRepository
from src.repositories.platos_repository import PlatoRepository
from src.repositories.pedido_repository import PedidoRepository
from src.utils.errors import NotFoundError


class RestaurantService:
    def __init__(self, db: Session):
        self.repo = RestaurantRepository(db)
        self.platos_repo = PlatoRepository(db)
        self.pedidos_repo = PedidoRepository(db)

    def create(self, dto: CreateRestaurantDTO) -> RestaurantResponseDTO:
        restaurant = self.repo.create(
            nombre=dto.nombre,
            categoria=dto.categoria,
            direccion=dto.direccion,
            calificacion_promedio=dto.calificacion_promedio or 0,
        )
        return to_restaurant_response(restaurant)

    def get_by_id(self, restaurant_id: int) -> RestaurantResponseDTO:
        restaurant = self.repo.find_by_id(restaurant_id)
        if not restaurant:
            raise NotFoundError(f"Restaurante con id {restaurant_id} no encontrado")
        return to_restaurant_response(restaurant)

    def list_all(
        self,
        q: str | None = None,
        categoria: str | None = None,
        codigo_postal: str | None = None,
    ) -> list[RestaurantResponseDTO]:
        if q or categoria or codigo_postal:
            restaurants = self.repo.search(q=q, categoria=categoria, codigo_postal=codigo_postal)
        else:
            restaurants = self.repo.list_all()
            restaurants = sorted(
                restaurants,
                key=lambda r: float(r.calificacion_promedio or 0),
                reverse=True,
            )
        return [to_restaurant_response(r) for r in restaurants]

    def top(self, limit: int = 5) -> list[dict]:
        rows = self.repo.top_by_entregas(limit)
        result = []
        for rest, cnt in rows:
            dto = to_restaurant_response(rest)
            result.append({**dto.model_dump(), "pedidos_entregados": cnt})
        return result

    def menu_disponible(self, restaurant_id: int) -> list:
        from src.mappers.plato_mapper import to_plato_response

        platos = self.platos_repo.find_by_restaurante(restaurant_id)
        return [to_plato_response(p).model_dump() for p in platos if p.disponible]

    def reporte(self, restaurant_id: int, desde: str, hasta: str) -> dict:
        if not self.repo.find_by_id(restaurant_id):
            raise NotFoundError(f"Restaurante {restaurant_id} no encontrado")
        return self.repo.reporte(restaurant_id, desde, hasta)

    def update(self, restaurant_id: int, dto: UpdateRestaurantDTO) -> RestaurantResponseDTO:
        restaurant = self.repo.update(restaurant_id, **dto.model_dump(exclude_unset=True))
        if not restaurant:
            raise NotFoundError(f"Restaurante con id {restaurant_id} no encontrado")
        return to_restaurant_response(restaurant)

    def delete(self, restaurant_id: int) -> None:
        if not self.repo.delete(restaurant_id):
            raise NotFoundError(f"Restaurante con id {restaurant_id} no encontrado")
