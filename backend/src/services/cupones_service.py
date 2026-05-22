from sqlalchemy.orm import Session

from src.dtos.cupones_dto import (
    CreateCuponDTO,
    UpdateCuponDTO,
    GetCuponDTO,
    DeleteCuponDTO,
    CuponResponseDTO
)

from src.mappers.cupones_mapper import to_cupones_response
from src.repositories.cupones_repository import CuponRepository
from src.exceptions import NotFoundError


class CuponService:
    def __init__(self, db: Session):
        self.repo = CuponRepository(db)

    def create(self, dto: CreateCuponDTO) -> CuponResponseDTO:
        """Crea un cupón y devuelve el DTO de respuesta."""

        existing_cupon = self.repo.find_by_codigo(dto.codigo)

        if existing_cupon:
            raise ValueError(
                f"Ya existe un cupón con el código {dto.codigo}"
            )

        cupon = self.repo.create(
            codigo=dto.codigo,
            porcentaje_descuento=dto.porcentaje_descuento,
            fecha_expiracion=dto.fecha_expiracion,
            telefono=dto.telefono,
            uso_maximo=dto.uso_maximo,
            usos_actuales=dto.usos_actuales
        )

        return to_cupones_response(cupon)

    def get_by_id(self, cupon_id: int) -> CuponResponseDTO:
        cupon = self.repo.find_by_id(cupon_id)

        if not cupon:
            raise NotFoundError(
                f"Cupón con id {cupon_id} no encontrado"
            )

        return to_cupones_response(cupon)

    def list_all(self) -> list[CuponResponseDTO]:
        cupones = self.repo.list_all()

        return [
            to_cupones_response(c)
            for c in cupones
        ]

    def update(
        self,
        cupon_id: int,
        dto: UpdateCuponDTO
    ) -> CuponResponseDTO:

        if dto.codigo:
            existing_cupon = self.repo.find_by_codigo(dto.codigo)

            if existing_cupon and existing_cupon.id != cupon_id:
                raise ValueError(
                    f"Ya existe un cupón con el código {dto.codigo}"
                )

        cupon = self.repo.update(
            cupon_id,
            **dto.dict(exclude_unset=True)
        )

        if not cupon:
            raise NotFoundError(
                f"Cupón con id {cupon_id} no encontrado"
            )

        return to_cupones_response(cupon)

    def delete(self, cupon_id: int) -> None:
        success = self.repo.delete(cupon_id)

        if not success:
            raise NotFoundError(
                f"Cupón con id {cupon_id} no encontrado"
            )