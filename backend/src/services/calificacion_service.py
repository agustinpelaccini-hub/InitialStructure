from sqlalchemy.orm import Session

from src.dtos.calificacion_dto import (
    CreateCalificacionDTO,
    UpdateCalificacionDTO,
    GetCalificacionDTO,
    DeleteCalificacionDTO,
    CalificacionResponseDTO
)

from src.mappers.calificacion_mapper import to_calificacion_response
from src.repositories.calificacion_repository import CalificacionRepository
from src.exceptions import NotFoundError


class CalificacionService:
    def __init__(self, db: Session):
        self.repo = CalificacionRepository(db)

    def create(self, dto: CreateCalificacionDTO) -> CalificacionResponseDTO:
        """Crea una calificación y devuelve el DTO de respuesta."""

        calificacion = self.repo.create(
            pedido_id=dto.pedido_id,
            cliente_id=dto.cliente_id,
            puntaje=dto.puntaje,
            comentario=dto.comentario
        )

        return to_calificacion_response(calificacion)

    def get_by_id(self, calificacion_id: int) -> CalificacionResponseDTO:
        calificacion = self.repo.find_by_id(calificacion_id)

        if not calificacion:
            raise NotFoundError(
                f"Calificación con id {calificacion_id} no encontrada"
            )

        return to_calificacion_response(calificacion)

    def list_all(self) -> list[CalificacionResponseDTO]:
        calificaciones = self.repo.list_all()

        return [
            to_calificacion_response(c)
            for c in calificaciones
        ]

    def update(
        self,
        calificacion_id: int,
        dto: UpdateCalificacionDTO
    ) -> CalificacionResponseDTO:

        calificacion = self.repo.update(
            calificacion_id,
            **dto.dict(exclude_unset=True)
        )

        if not calificacion:
            raise NotFoundError(
                f"Calificación con id {calificacion_id} no encontrada"
            )

        return to_calificacion_response(calificacion)

    def delete(self, calificacion_id: int) -> None:
        success = self.repo.delete(calificacion_id)

        if not success:
            raise NotFoundError(
                f"Calificación con id {calificacion_id} no encontrada"
            )