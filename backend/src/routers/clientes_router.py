from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.db.connection import get_db

from src.dtos.clientes_dto import (
    CreateClienteDTO,
    UpdateClienteDTO,
    ClienteResponseDTO
)

from src.schemas.clientes_schema import (
    CreateClienteSchema,
    UpdateClienteSchema
)

from src.services.clientes_service import ClienteService


router = APIRouter(
    prefix="/clientes",
    tags=["clientes"]
)


@router.post(
    "/",
    response_model=ClienteResponseDTO,
    status_code=status.HTTP_201_CREATED
)
def create_cliente(
    payload: CreateClienteSchema,
    db: Session = Depends(get_db)
):

    dto = CreateClienteDTO(**payload.model_dump())

    return ClienteService(db).create(dto)


@router.get(
    "/{cliente_id}",
    response_model=ClienteResponseDTO
)
def get_cliente(
    cliente_id: int,
    db: Session = Depends(get_db)
):

    dto = ClienteService(db).get_by_id(cliente_id)

    return dto


@router.get(
    "/",
    response_model=list[ClienteResponseDTO]
)
def list_clientes(
    db: Session = Depends(get_db)
):

    dtos = ClienteService(db).list_all()

    return dtos


@router.put(
    "/{cliente_id}",
    response_model=ClienteResponseDTO
)
def update_cliente(
    cliente_id: int,
    payload: UpdateClienteSchema,
    db: Session = Depends(get_db)
):

    dto = UpdateClienteDTO(**payload.model_dump())

    updated = ClienteService(db).update(
        cliente_id,
        dto
    )

    return updated


@router.delete(
    "/{cliente_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_cliente(
    cliente_id: int,
    db: Session = Depends(get_db)
):

    ClienteService(db).delete(cliente_id)