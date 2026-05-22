from sqlalchemy.orm import Session

from src.dtos.platos_dto import (
    CreatePlatoDTO,
    UpdatePlatoDTO,
    GetPlatoDTO,
    DeletePlatoDTO,
    PlatoResponseDTO
)

from src.mappers.platos_mapper import to_plato_response
from src.repositories.platos_repository import PlatoRepository
from src.exceptions import NotFoundError


class PlatoService:
    def __init__(self, db: Session):
        self.repo = PlatoRepository(db)

    def create(self, dto: CreatePlatoDTO) -> PlatoResponseDTO:
        """Crea un plato y devuelve el DTO de respuesta."""

        plato = self.repo.create(
            restaurante_id=dto.restaurante_id,
            nombre=dto.nombre,
            descripcion=dto.descripcion,
            precio=dto.precio,
            disponible=dto.disponible
        )

        return to_plato_response(plato)

    def get_by_id(self, plato_id: int) -> PlatoResponseDTO:
        plato = self.repo.find_by_id(plato_id)

        if not plato:
            raise NotFoundError(
                f"Plato con id {plato_id} no encontrado"
            )

        return to_plato_response(plato)

    def list_all(self) -> list[PlatoResponseDTO]:
        platos = self.repo.list_all()

        return [
            to_plato_response(p)
            for p in platos
        ]

    def get_by_restaurante(
        self,
        restaurante_id: int
    ) -> list[PlatoResponseDTO]:

        platos = self.repo.find_by_restaurante(restaurante_id)

        return [
            to_plato_response(p)
            for p in platos
        ]

    def get_disponibles(self) -> list[PlatoResponseDTO]:
        platos = self.repo.find_disponibles()

        return [
            to_plato_response(p)
            for p in platos
        ]

    def update(
        self,
        plato_id: int,
        dto: UpdatePlatoDTO
    ) -> PlatoResponseDTO:

        plato = self.repo.update(
            plato_id,
            **dto.dict(exclude_unset=True)
        )

        if not plato:
            raise NotFoundError(
                f"Plato con id {plato_id} no encontrado"
            )

        return to_plato_response(plato)

    def delete(self, plato_id: int) -> None:
        success = self.repo.delete(plato_id)

        if not success:
            raise NotFoundError(
                f"Plato con id {plato_id} no encontrado"
            )