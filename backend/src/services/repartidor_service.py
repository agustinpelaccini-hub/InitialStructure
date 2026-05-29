from sqlalchemy.orm import Session

from src.dtos.repartidor_dto import CreateRepartidorDTO, UpdateRepartidorDTO, RepartidorResponseDTO
from src.mappers.repartidor_mapper import to_repartidor_response
from src.repositories.repartidor_repository import RepartidorRepository
from src.utils.errors import NotFoundError


class RepartidorService:
    def __init__(self, db: Session):
        self.repo = RepartidorRepository(db)

    def create(self, dto: CreateRepartidorDTO) -> RepartidorResponseDTO:
        repartidor = self.repo.create(
            nombre=dto.nombre,
            vehiculo=dto.vehiculo,
            disponible=dto.disponible if dto.disponible is not None else True,
        )
        return to_repartidor_response(repartidor)

    def get_by_id(self, repartidor_id: int) -> RepartidorResponseDTO:
        repartidor = self.repo.find_by_id(repartidor_id)
        if not repartidor:
            raise NotFoundError(f"Repartidor con id {repartidor_id} no encontrado")
        return to_repartidor_response(repartidor)

    def list_all(self) -> list[RepartidorResponseDTO]:
        return [to_repartidor_response(r) for r in self.repo.list_all()]

    def get_disponibles(self) -> list[RepartidorResponseDTO]:
        return [to_repartidor_response(r) for r in self.repo.find_disponibles()]

    def update(self, repartidor_id: int, dto: UpdateRepartidorDTO) -> RepartidorResponseDTO:
        data = dto.model_dump(exclude_unset=True)
        data.pop("telefono", None)
        data.pop("role", None)
        repartidor = self.repo.update(repartidor_id, **data)
        if not repartidor:
            raise NotFoundError(f"Repartidor con id {repartidor_id} no encontrado")
        return to_repartidor_response(repartidor)

    def delete(self, repartidor_id: int) -> None:
        if not self.repo.delete(repartidor_id):
            raise NotFoundError(f"Repartidor con id {repartidor_id} no encontrado")
