from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.db.connection import get_db

from src.dtos.notificacion_dto import (
    CreateNotificacionDTO,
    UpdateNotificacionDTO,
    NotificacionResponseDTO
)

from src.schemas.notificacion_schema import (
    CreateNotificacionSchema,
    UpdateNotificacionSchema
)

from src.services.notificacion_service import NotificacionService


router = APIRouter(
    prefix="/notificaciones",
    tags=["notificaciones"]
)


@router.post(
    "/",
    response_model=NotificacionResponseDTO,
    status_code=status.HTTP_201_CREATED
)
def create_notificacion(
    payload: CreateNotificacionSchema,
    db: Session = Depends(get_db)
):

    dto = CreateNotificacionDTO(**payload.model_dump())

    return NotificacionService(db).create(dto)


@router.get(
    "/{notificacion_id}",
    response_model=NotificacionResponseDTO
)
def get_notificacion(
    notificacion_id: int,
    db: Session = Depends(get_db)
):

    dto = NotificacionService(db).get_by_id(notificacion_id)

    return dto


@router.get(
    "/",
    response_model=list[NotificacionResponseDTO]
)
def list_notificaciones(
    db: Session = Depends(get_db)
):

    dtos = NotificacionService(db).list_all()

    return dtos


@router.put(
    "/{notificacion_id}",
    response_model=NotificacionResponseDTO
)
def update_notificacion(
    notificacion_id: int,
    payload: UpdateNotificacionSchema,
    db: Session = Depends(get_db)
):

    dto = UpdateNotificacionDTO(**payload.model_dump())

    updated = NotificacionService(db).update(
        notificacion_id,
        dto
    )

    return updated


@router.delete(
    "/{notificacion_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_notificacion(
    notificacion_id: int,
    db: Session = Depends(get_db)
):

    NotificacionService(db).delete(notificacion_id)