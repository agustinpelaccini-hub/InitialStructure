from sqlalchemy.orm import Session

from src.dtos.zona_cobertura_dto import CreateZonaCoberturaDTO, ZonaCoberturaResponseDTO
from src.mappers.zonas_cobertura_mapper import to_zona_cobertura_response
from src.repositories.zonas_cobertura_repository import ZonaCoberturaRepository
from src.utils.errors import NotFoundError


class ZonaCoberturaService:
    def __init__(self, db: Session):
        self.repo = ZonaCoberturaRepository(db)

    def create(self, dto: CreateZonaCoberturaDTO) -> ZonaCoberturaResponseDTO:
        zona = self.repo.create(
            restaurante_id=dto.restaurante_id,
            nombre=dto.nombre,
            codigo_postal=dto.codigo_postal,
        )
        return to_zona_cobertura_response(zona)

    def list_all(self) -> list[ZonaCoberturaResponseDTO]:
        return [to_zona_cobertura_response(z) for z in self.repo.list_all()]

    def get_by_id(self, zona_id: int) -> ZonaCoberturaResponseDTO:
        zona = self.repo.find_by_id(zona_id)
        if not zona:
            raise NotFoundError(f"Zona con id {zona_id} no encontrada")
        return to_zona_cobertura_response(zona)

    def get_by_restaurante(self, restaurante_id: int) -> list[ZonaCoberturaResponseDTO]:
        return [to_zona_cobertura_response(z) for z in self.repo.find_by_restaurante(restaurante_id)]

    def delete(self, zona_id: int) -> None:
        if not self.repo.delete(zona_id):
            raise NotFoundError(f"Zona {zona_id} no encontrada")
