from datetime import datetime, timezone

from sqlalchemy.orm import Session

from src.dtos.cupones_dto import CreateCuponDTO, UpdateCuponDTO, CuponResponseDTO
from src.mappers.cupones_mapper import to_cupones_response
from src.repositories.cupones_repository import CuponRepository
from src.utils.errors import BadRequestError, ConflictError, NotFoundError


class CuponService:
    def __init__(self, db: Session):
        self.repo = CuponRepository(db)

    def create(self, dto: CreateCuponDTO) -> CuponResponseDTO:
        if self.repo.find_by_codigo(dto.codigo):
            raise ConflictError(f"Ya existe un cupón con el código {dto.codigo}")
        cupon = self.repo.create(
            codigo=dto.codigo,
            porcentaje_descuento=dto.porcentaje_descuento,
            fecha_vencimiento=dto.fecha_vencimiento,
            usos_maximos=dto.usos_maximos,
            usos_actuales=dto.usos_actuales or 0,
        )
        return to_cupones_response(cupon)

    def get_by_id(self, cupon_id: int) -> CuponResponseDTO:
        cupon = self.repo.find_by_id(cupon_id)
        if not cupon:
            raise NotFoundError(f"Cupón con id {cupon_id} no encontrado")
        return to_cupones_response(cupon)

    def list_all(self) -> list[CuponResponseDTO]:
        return [to_cupones_response(c) for c in self.repo.list_all()]

    def validar(self, codigo: str) -> CuponResponseDTO:
        cupon = self.repo.find_by_codigo(codigo)
        if not cupon:
            raise BadRequestError("Cupón no encontrado")
        if cupon.usos_actuales >= cupon.usos_maximos:
            raise BadRequestError("Cupón sin usos disponibles")
        if cupon.fecha_vencimiento < datetime.now(timezone.utc).strftime("%Y-%m-%d"):
            raise BadRequestError("Cupón vencido")
        return to_cupones_response(cupon)

    def update(self, cupon_id: int, dto: UpdateCuponDTO) -> CuponResponseDTO:
        if dto.codigo:
            existing = self.repo.find_by_codigo(dto.codigo)
            if existing and existing.id != cupon_id:
                raise ConflictError(f"Ya existe un cupón con el código {dto.codigo}")
        cupon = self.repo.update(cupon_id, **dto.model_dump(exclude_unset=True))
        if not cupon:
            raise NotFoundError(f"Cupón con id {cupon_id} no encontrado")
        return to_cupones_response(cupon)

    def delete(self, cupon_id: int) -> None:
        if not self.repo.delete(cupon_id):
            raise NotFoundError(f"Cupón con id {cupon_id} no encontrado")
