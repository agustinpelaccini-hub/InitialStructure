from sqlalchemy.orm import Session

from src.dtos.notificaciones_dto import (
    CreateNotificacionDTO,
    UpdateNotificacionDTO,
    GetNotificacionDTO,
    DeleteNotificacionDTO,
    NotificacionResponseDTO
)

from src.mappers.notificaciones_mapper import to_notificaciones_response
from src.repositories.notificaciones_repository import NotificacionRepository
from src.exceptions import NotFoundError


class NotificacionService:
    def __init__(self, db: Session):
        self.repo = NotificacionRepository(db)

    def create(
        self,
        dto: CreateNotificacionDTO
    ) -> NotificacionResponseDTO:
        """Crea una notificación y devuelve el DTO de respuesta."""

        notificacion = self.repo.create(
            pedido_id=dto.pedido_id,
            estado_nuevo=dto.estado_nuevo,
            usuario_id=dto.usuario_id,
            leida=dto.leida,
            precio=dto.precio
        )

        return to_notificaciones_response(notificacion)

    def get_by_id(
        self,
        notificacion_id: int
    ) -> NotificacionResponseDTO:

        notificacion = self.repo.find_by_id(notificacion_id)

        if not notificacion:
            raise NotFoundError(
                f"Notificación con id {notificacion_id} no encontrada"
            )

        return to_notificaciones_response(notificacion)

    def list_all(self) -> list[NotificacionResponseDTO]:
        notificaciones = self.repo.list_all()

        return [
            to_notificaciones_response(n)
            for n in notificaciones
        ]

    def get_by_usuario(
        self,
        usuario_id: int
    ) -> list[NotificacionResponseDTO]:

        notificaciones = self.repo.find_by_usuario(usuario_id)

        return [
            to_notificaciones_response(n)
            for n in notificaciones
        ]

    def update(
        self,
        notificacion_id: int,
        dto: UpdateNotificacionDTO
    ) -> NotificacionResponseDTO:

        notificacion = self.repo.update(
            notificacion_id,
            **dto.dict(exclude_unset=True)
        )

        if not notificacion:
            raise NotFoundError(
                f"Notificación con id {notificacion_id} no encontrada"
            )

        return to_notificaciones_response(notificacion)

    def delete(self, notificacion_id: int) -> None:
        success = self.repo.delete(notificacion_id)

        if not success:
            raise NotFoundError(
                f"Notificación con id {notificacion_id} no encontrada"
            )