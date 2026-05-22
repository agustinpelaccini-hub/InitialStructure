from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.db.connection import get_db

from src.dtos.zonas_cobertura_dto import (
    CreateZonaCoberturaDTO,
    UpdateZonaCoberturaDTO,
    ZonaCoberturaResponseDTO
)

from src.schemas.zonas_cobertura_schema import (
    CreateZonaCoberturaSchema,
    UpdateZonaCoberturaSchema
)

from src.services.zonas_cobertura_service import (
    ZonaCoberturaService
)


router = APIRouter(
    prefix="/zonas-cobertura",
    tags=["zonas-cobertura"]
)


@router.post(
    "/",
    response_model=ZonaCoberturaResponseDTO,
    status_code=status.HTTP_201_CREATED
)
def create_zona_cobertura(
    payload: CreateZonaCoberturaSchema,
    db: Session = Depends(get_db)
):

    dto = CreateZonaCoberturaDTO(
        **payload.model_dump()
    )

    return ZonaCoberturaService(db).create(dto)


@router.get(
    "/{zona_id}",
    response_model=ZonaCoberturaResponseDTO
)
def get_zona_cobertura(
    zona_id: int,
    db: Session = Depends(get_db)
):

    dto = ZonaCoberturaService(db).get_by_id(zona_id)

    return dto


@router.get(
    "/",
    response_model=list[ZonaCoberturaResponseDTO]
)
def list_zonas_cobertura(
    db: Session = Depends(get_db)
):

    dtos = ZonaCoberturaService(db).list_all()

    return dtos


@router.put(
    "/{zona_id}",
    response_model=ZonaCoberturaResponseDTO
)
def update_zona_cobertura(
    zona_id: int,
    payload: UpdateZonaCoberturaSchema,
    db: Session = Depends(get_db)
):

    dto = UpdateZonaCoberturaDTO(
        **payload.model_dump()
    )

    updated = ZonaCoberturaService(db).update(
        zona_id,
        dto
    )

    return updated


@router.delete(
    "/{zona_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_zona_cobertura(
    zona_id: int,
    db: Session = Depends(get_db)
):

    ZonaCoberturaService(db).delete(zona_id)