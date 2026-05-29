from sqlalchemy.orm import Session

from src.dtos.notificacion_dto import NotificacionResponseDTO
from src.mappers.notificacion_mapper import to_notificacion_response
from src.repositories.notificacion_repository import NotificacionRepository
from src.utils.errors import NotFoundError


class NotificacionService:
    def __init__(self, db: Session):
        self.repo = NotificacionRepository(db)

    def list_all(self) -> list[NotificacionResponseDTO]:
        return [to_notificacion_response(n) for n in self.repo.list_all()]

    def find_by_cliente(self, cliente_id: int) -> list[NotificacionResponseDTO]:
        return [to_notificacion_response(n) for n in self.repo.find_by_cliente(cliente_id)]

    def marcar_leida(self, notificacion_id: int, leida: bool = True) -> NotificacionResponseDTO:
        n = self.repo.update(notificacion_id, leida=leida)
        if not n:
            raise NotFoundError(f"Notificación {notificacion_id} no encontrada")
        return to_notificacion_response(n)
