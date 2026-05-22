from sqlalchemy.orm import Session

from src.dtos.zona_cobertura_dto import (
    CreateZonaCoberturaDTO,
    UpdateZonaCoberturaDTO,
    GetZonaCoberturaDTO,
    DeleteZonaCoberturaDTO,
    ZonaCoberturaResponseDTO
)

from src.mappers.zona_cobertura_mapper import (
    to_zonas_cobertura_response
)

from src.repositories.zona_cobertura_repository import (
    ZonaCoberturaRepository
)

from src.exceptions import NotFoundError


class ZonaCoberturaService:
    def __init__(self, db: Session):
        self.repo = ZonaCoberturaRepository(db)

    def create(
        self,
        dto: CreateZonaCoberturaDTO
    ) -> ZonaCoberturaResponseDTO:
        """Crea una zona de cobertura y devuelve el DTO de respuesta."""

        zona = self.repo.create(
            nombre=dto.nombre,
            restaurante_id=dto.restaurante_id,
            role=dto.role,
            codigo_postal=dto.codigo_postal
        )

        return to_zonas_cobertura_response(zona)

    def get_by_id(
        self,
        zona_id: int
    ) -> ZonaCoberturaResponseDTO:

        zona = self.repo.find_by_id(zona_id)

        if not zona:
            raise NotFoundError(
                f"Zona de cobertura con id {zona_id} no encontrada"
            )

        return to_zonas_cobertura_response(zona)

    def list_all(self) -> list[ZonaCoberturaResponseDTO]:
        zonas = self.repo.list_all()

        return [
            to_zonas_cobertura_response(z)
            for z in zonas
        ]

    def get_by_restaurante(
        self,
        restaurante_id: int
    ) -> list[ZonaCoberturaResponseDTO]:

        zonas = self.repo.find_by_restaurante(
            restaurante_id
        )

        return [
            to_zonas_cobertura_response(z)
            for z in zonas
        ]

    def update(
        self,
        zona_id: int,
        dto: UpdateZonaCoberturaDTO
    ) -> ZonaCoberturaResponseDTO:

        zona = self.repo.update(
            zona_id,
            **dto.dict(exclude_unset=True)
        )

        if not zona:
            raise NotFoundError(
                f"Zona de cobertura con id {zona_id} no encontrada"
            )

        return to_zonas_cobertura_response(zona)

    def delete(self, zona_id: int) -> None:
        success = self.repo.delete(zona_id)

        if not success:
            raise NotFoundError(
                f"Zona de cobertura con id {zona_id} no encontrada"
            )