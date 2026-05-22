from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.db.connection import get_db

from src.dtos.pedidos_dto import (
    CreatePedidoDTO,
    UpdatePedidoDTO,
    PedidoResponseDTO
)

from src.schemas.pedidos_schema import (
    CreatePedidoSchema,
    UpdatePedidoSchema
)

from src.services.pedidos_service import PedidoService


router = APIRouter(
    prefix="/pedidos",
    tags=["pedidos"]
)


@router.post(
    "/",
    response_model=PedidoResponseDTO,
    status_code=status.HTTP_201_CREATED
)
def create_pedido(
    payload: CreatePedidoSchema,
    db: Session = Depends(get_db)
):

    dto = CreatePedidoDTO(**payload.model_dump())

    return PedidoService(db).create(dto)


@router.get(
    "/{pedido_id}",
    response_model=PedidoResponseDTO
)
def get_pedido(
    pedido_id: int,
    db: Session = Depends(get_db)
):

    dto = PedidoService(db).get_by_id(pedido_id)

    return dto


@router.get(
    "/",
    response_model=list[PedidoResponseDTO]
)
def list_pedidos(
    db: Session = Depends(get_db)
):

    dtos = PedidoService(db).list_all()

    return dtos


@router.put(
    "/{pedido_id}",
    response_model=PedidoResponseDTO
)
def update_pedido(
    pedido_id: int,
    payload: UpdatePedidoSchema,
    db: Session = Depends(get_db)
):

    dto = UpdatePedidoDTO(**payload.model_dump())

    updated = PedidoService(db).update(
        pedido_id,
        dto
    )

    return updated


@router.delete(
    "/{pedido_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_pedido(
    pedido_id: int,
    db: Session = Depends(get_db)
):

    PedidoService(db).delete(pedido_id)