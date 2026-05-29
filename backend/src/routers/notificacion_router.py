from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from src.db.connection import get_db
from src.dtos.notificacion_dto import NotificacionResponseDTO
from src.services.notificacion_service import NotificacionService

router = APIRouter(prefix="/notificaciones", tags=["notificaciones"])


class PatchNotificacionSchema(BaseModel):
    leida: bool = True


@router.get("/", response_model=list[NotificacionResponseDTO])
def list_notificaciones(db: Session = Depends(get_db)):
    return NotificacionService(db).list_all()


@router.patch("/{notificacion_id}", response_model=NotificacionResponseDTO)
def patch_notificacion(
    notificacion_id: int,
    payload: PatchNotificacionSchema,
    db: Session = Depends(get_db),
):
    return NotificacionService(db).marcar_leida(notificacion_id, payload.leida)
