from sqlalchemy.orm import Session

from src.dtos.repartidor_dto import (
    CreateRepartidorDTO,
    UpdateRepartidorDTO,
    GetRepartidorDTO,
    DeleteRepartidorDTO,
    RepartidorResponseDTO
)

from src.mappers.repartidor_mapper import to_repartidor_response
from src.repositories.repartidor_repository import RepartidorRepository
from src.exceptions import NotFoundError


class RepartidorService:
    def __init__(self, db: Session):
        self.repo = RepartidorRepository(db)

    def create(
        self,
        dto: CreateRepartidorDTO
    ) -> RepartidorResponseDTO:
        """Crea un repartidor y devuelve el DTO de respuesta."""

        repartidor = self.repo.create(
            nombre=dto.nombre,
            telefono=dto.telefono,
            role=dto.role,
            vehiculo=dto.vehiculo,
            disponible=dto.disponible
        )

        return to_repartidor_response(repartidor)

    def get_by_id(
        self,
        repartidor_id: int
    ) -> RepartidorResponseDTO:

        repartidor = self.repo.find_by_id(repartidor_id)

        if not repartidor:
            raise NotFoundError(
                f"Repartidor con id {repartidor_id} no encontrado"
            )

        return to_repartidor_response(repartidor)

    def list_all(self) -> list[RepartidorResponseDTO]:
        repartidores = self.repo.list_all()

        return [
            to_repartidor_response(r)
            for r in repartidores
        ]

    def get_disponibles(self) -> list[RepartidorResponseDTO]:
        repartidores = self.repo.find_disponibles()

        return [
            to_repartidor_response(r)
            for r in repartidores
        ]

    def update(
        self,
        repartidor_id: int,
        dto: UpdateRepartidorDTO
    ) -> RepartidorResponseDTO:

        repartidor = self.repo.update(
            repartidor_id,
            **dto.dict(exclude_unset=True)
        )

        if not repartidor:
            raise NotFoundError(
                f"Repartidor con id {repartidor_id} no encontrado"
            )

        return to_repartidor_response(repartidor)

    def delete(self, repartidor_id: int) -> None:
        success = self.repo.delete(repartidor_id)

        if not success:
            raise NotFoundError(
                f"Repartidor con id {repartidor_id} no encontrado"
            )