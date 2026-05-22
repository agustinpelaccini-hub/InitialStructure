from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.db.connection import get_db

from src.dtos.calificacion_dto import (
    CreateCalificacionDTO,
    UpdateCalificacionDTO,
    CalificacionResponseDTO
)

from src.schemas.calificacion_schema import (
    CreateCalificacionSchema,
    UpdateCalificacionSchema
)

from src.services.calificacion_service import CalificacionService


router = APIRouter(
    prefix="/calificaciones",
    tags=["calificaciones"]
)


@router.post(
    "/",
    response_model=CalificacionResponseDTO,
    status_code=status.HTTP_201_CREATED
)
def create_calificacion(
    payload: CreateCalificacionSchema,
    db: Session = Depends(get_db)
):

    dto = CreateCalificacionDTO(**payload.model_dump())

    return CalificacionService(db).create(dto)


@router.get(
    "/{calificacion_id}",
    response_model=CalificacionResponseDTO
)
def get_calificacion(
    calificacion_id: int,
    db: Session = Depends(get_db)
):

    dto = CalificacionService(db).get_by_id(calificacion_id)

    return dto


@router.get(
    "/",
    response_model=list[CalificacionResponseDTO]
)
def list_calificaciones(
    db: Session = Depends(get_db)
):

    dtos = CalificacionService(db).list_all()

    return dtos


@router.put(
    "/{calificacion_id}",
    response_model=CalificacionResponseDTO
)
def update_calificacion(
    calificacion_id: int,
    payload: UpdateCalificacionSchema,
    db: Session = Depends(get_db)
):

    dto = UpdateCalificacionDTO(**payload.model_dump())

    updated = CalificacionService(db).update(
        calificacion_id,
        dto
    )

    return updated


@router.delete(
    "/{calificacion_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_calificacion(
    calificacion_id: int,
    db: Session = Depends(get_db)
):

    CalificacionService(db).delete(calificacion_id)