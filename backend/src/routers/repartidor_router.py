from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.db.connection import get_db

from src.dtos.repartidor_dto import (
    CreateRepartidorDTO,
    UpdateRepartidorDTO,
    RepartidorResponseDTO
)

from src.schemas.repartidor_schema import (
    CreateRepartidorSchema,
    UpdateRepartidorSchema
)

from src.services.repartidor_service import RepartidorService


router = APIRouter(
    prefix="/repartidores",
    tags=["repartidores"]
)


@router.post(
    "/",
    response_model=RepartidorResponseDTO,
    status_code=status.HTTP_201_CREATED
)
def create_repartidor(
    payload: CreateRepartidorSchema,
    db: Session = Depends(get_db)
):

    dto = CreateRepartidorDTO(**payload.model_dump())

    return RepartidorService(db).create(dto)


@router.get(
    "/{repartidor_id}",
    response_model=RepartidorResponseDTO
)
def get_repartidor(
    repartidor_id: int,
    db: Session = Depends(get_db)
):

    dto = RepartidorService(db).get_by_id(repartidor_id)

    return dto


@router.get(
    "/",
    response_model=list[RepartidorResponseDTO]
)
def list_repartidores(
    db: Session = Depends(get_db)
):

    dtos = RepartidorService(db).list_all()

    return dtos


@router.put(
    "/{repartidor_id}",
    response_model=RepartidorResponseDTO
)
def update_repartidor(
    repartidor_id: int,
    payload: UpdateRepartidorSchema,
    db: Session = Depends(get_db)
):

    dto = UpdateRepartidorDTO(**payload.model_dump())

    updated = RepartidorService(db).update(
        repartidor_id,
        dto
    )

    return updated


@router.delete(
    "/{repartidor_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_repartidor(
    repartidor_id: int,
    db: Session = Depends(get_db)
):

    RepartidorService(db).delete(repartidor_id)