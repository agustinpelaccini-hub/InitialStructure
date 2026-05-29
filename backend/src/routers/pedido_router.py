from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from src.db.connection import get_db
from src.dtos.pedido_dto import UpdatePedidoDTO
from src.schemas.pedido_schema import CreatePedidoSchema, UpdatePedidoSchema, PatchEstadoSchema
from src.services.pedido_service import PedidoService

router = APIRouter(prefix="/pedidos", tags=["pedidos"])


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_pedido(payload: CreatePedidoSchema, db: Session = Depends(get_db)):
    return PedidoService(db).create_with_items(payload.model_dump())


@router.get("/")
def list_pedidos(limit: int | None = Query(None), db: Session = Depends(get_db)):
    return PedidoService(db).list_all(limit=limit)


@router.get("/{pedido_id}")
def get_pedido(pedido_id: int, db: Session = Depends(get_db)):
    return PedidoService(db).get_detail(pedido_id)


@router.post("/{pedido_id}/asignar")
def asignar_pedido(pedido_id: int, db: Session = Depends(get_db)):
    return PedidoService(db).asignar_repartidor(pedido_id)


@router.patch("/{pedido_id}/estado")
def patch_estado(pedido_id: int, payload: PatchEstadoSchema, db: Session = Depends(get_db)):
    return PedidoService(db).cambiar_estado(pedido_id, payload.estado)


@router.put("/{pedido_id}")
def update_pedido(pedido_id: int, payload: UpdatePedidoSchema, db: Session = Depends(get_db)):
    dto = UpdatePedidoDTO(**payload.model_dump(exclude_unset=True))
    return PedidoService(db).update(pedido_id, dto)


@router.delete("/{pedido_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_pedido(pedido_id: int, db: Session = Depends(get_db)):
    PedidoService(db).delete(pedido_id)
