from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.db.connection import get_db

from src.dtos.pedido_plato_dto import (
    CreatePedidoPlatoDTO,
    UpdatePedidoPlatoDTO,
    PedidoPlatoResponseDTO
)

from src.schemas.pedido_plato_schema import (
    CreatePedidoPlatoSchema,
    UpdatePedidoPlatoSchema
)

from src.services.pedido_plato_service import PedidoPlatoService


router = APIRouter(
    prefix="/pedido-platos",
    tags=["pedido-platos"]
)


@router.post(
    "/",
    response_model=PedidoPlatoResponseDTO,
    status_code=status.HTTP_201_CREATED
)
def create_pedido_plato(
    payload: CreatePedidoPlatoSchema,
    db: Session = Depends(get_db)
):

    dto = CreatePedidoPlatoDTO(**payload.model_dump())

    return PedidoPlatoService(db).create(dto)


@router.get(
    "/{pedido_plato_id}",
    response_model=PedidoPlatoResponseDTO
)
def get_pedido_plato(
    pedido_plato_id: int,
    db: Session = Depends(get_db)
):

    dto = PedidoPlatoService(db).get_by_id(pedido_plato_id)

    return dto


@router.get(
    "/",
    response_model=list[PedidoPlatoResponseDTO]
)
def list_pedido_platos(
    db: Session = Depends(get_db)
):

    dtos = PedidoPlatoService(db).list_all()

    return dtos


@router.put(
    "/{pedido_plato_id}",
    response_model=PedidoPlatoResponseDTO
)
def update_pedido_plato(
    pedido_plato_id: int,
    payload: UpdatePedidoPlatoSchema,
    db: Session = Depends(get_db)
):

    dto = UpdatePedidoPlatoDTO(**payload.model_dump())

    updated = PedidoPlatoService(db).update(
        pedido_plato_id,
        dto
    )

    return updated


@router.delete(
    "/{pedido_plato_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_pedido_plato(
    pedido_plato_id: int,
    db: Session = Depends(get_db)
):

    PedidoPlatoService(db).delete(pedido_plato_id)