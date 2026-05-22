from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.db.connection import get_db

from src.dtos.platos_dto import (
    CreatePlatoDTO,
    UpdatePlatoDTO,
    PlatoResponseDTO
)

from src.schemas.platos_schema import (
    CreatePlatoSchema,
    UpdatePlatoSchema
)

from src.services.platos_service import PlatoService


router = APIRouter(
    prefix="/platos",
    tags=["platos"]
)


@router.post(
    "/",
    response_model=PlatoResponseDTO,
    status_code=status.HTTP_201_CREATED
)
def create_plato(
    payload: CreatePlatoSchema,
    db: Session = Depends(get_db)
):

    dto = CreatePlatoDTO(**payload.model_dump())

    return PlatoService(db).create(dto)


@router.get(
    "/{plato_id}",
    response_model=PlatoResponseDTO
)
def get_plato(
    plato_id: int,
    db: Session = Depends(get_db)
):

    dto = PlatoService(db).get_by_id(plato_id)

    return dto


@router.get(
    "/",
    response_model=list[PlatoResponseDTO]
)
def list_platos(
    db: Session = Depends(get_db)
):

    dtos = PlatoService(db).list_all()

    return dtos


@router.put(
    "/{plato_id}",
    response_model=PlatoResponseDTO
)
def update_plato(
    plato_id: int,
    payload: UpdatePlatoSchema,
    db: Session = Depends(get_db)
):

    dto = UpdatePlatoDTO(**payload.model_dump())

    updated = PlatoService(db).update(
        plato_id,
        dto
    )

    return updated


@router.delete(
    "/{plato_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_plato(
    plato_id: int,
    db: Session = Depends(get_db)
):

    PlatoService(db).delete(plato_id)