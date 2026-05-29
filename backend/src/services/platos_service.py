from sqlalchemy.orm import Session

from src.dtos.platos_dto import CreatePlatoDTO, UpdatePlatoDTO, PlatoResponseDTO
from src.mappers.plato_mapper import to_plato_response
from src.repositories.platos_repository import PlatoRepository
from src.repositories.pedido_plato_repository import PedidoPlatoRepository
from src.utils.errors import BadRequestError, NotFoundError


class PlatoService:
    def __init__(self, db: Session):
        self.repo = PlatoRepository(db)
        self.items_repo = PedidoPlatoRepository(db)

    def create(self, dto: CreatePlatoDTO) -> PlatoResponseDTO:
        if dto.precio <= 0:
            raise BadRequestError("El precio debe ser mayor a 0")
        if not dto.restaurante_id:
            raise BadRequestError("El restaurante_id es requerido")
        plato = self.repo.create(
            restaurante_id=dto.restaurante_id,
            nombre=dto.nombre,
            descripcion=dto.descripcion,
            precio=float(dto.precio),
            disponible=dto.disponible if dto.disponible is not None else True,
        )
        return to_plato_response(plato)

    def get_by_id(self, plato_id: int) -> PlatoResponseDTO:
        plato = self.repo.find_by_id(plato_id)
        if not plato:
            raise NotFoundError(f"Plato con id {plato_id} no encontrado")
        return to_plato_response(plato)

    def list_all(self, restaurante_id: int | None = None) -> list[PlatoResponseDTO]:
        if restaurante_id:
            platos = self.repo.find_by_restaurante(restaurante_id)
        else:
            platos = self.repo.list_all()
        return [to_plato_response(p) for p in platos]

    def top(self, limit: int = 10) -> list[dict]:
        return self.items_repo.top_platos(limit)

    def update(self, plato_id: int, dto: UpdatePlatoDTO) -> PlatoResponseDTO:
        if dto.precio is not None and dto.precio <= 0:
            raise BadRequestError("El precio debe ser mayor a 0")
        data = dto.model_dump(exclude_unset=True)
        if "precio" in data and data["precio"] is not None:
            data["precio"] = float(data["precio"])
        plato = self.repo.update(plato_id, **data)
        if not plato:
            raise NotFoundError(f"Plato con id {plato_id} no encontrado")
        return to_plato_response(plato)

    def delete(self, plato_id: int) -> None:
        if not self.repo.delete(plato_id):
            raise NotFoundError(f"Plato con id {plato_id} no encontrado")
