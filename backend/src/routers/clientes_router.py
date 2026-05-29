from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from src.db.connection import get_db
from src.dtos.clientes_dto import CreateClienteDTO, UpdateClienteDTO, ClienteResponseDTO
from src.schemas.clientes_schema import CreateClienteSchema, UpdateClienteSchema
from src.services.clientes_service import ClienteService
from src.services.pedido_service import PedidoService
from src.services.notificacion_service import NotificacionService

router = APIRouter(prefix="/clientes", tags=["clientes"])


@router.post("/", response_model=ClienteResponseDTO, status_code=status.HTTP_201_CREATED)
def create_cliente(payload: CreateClienteSchema, db: Session = Depends(get_db)):
    return ClienteService(db).create(CreateClienteDTO(**payload.model_dump()))


@router.get("/", response_model=list[ClienteResponseDTO])
def list_clientes(db: Session = Depends(get_db)):
    return ClienteService(db).list_all()


@router.get("/{cliente_id}", response_model=ClienteResponseDTO)
def get_cliente(cliente_id: int, db: Session = Depends(get_db)):
    return ClienteService(db).get_by_id(cliente_id)


@router.get("/{cliente_id}/pedidos")
def pedidos_cliente(
    cliente_id: int,
    estado: str | None = Query(None),
    db: Session = Depends(get_db),
):
    return PedidoService(db).get_by_cliente(cliente_id, estado)


@router.get("/{cliente_id}/notificaciones")
def notificaciones_cliente(cliente_id: int, db: Session = Depends(get_db)):
    return NotificacionService(db).find_by_cliente(cliente_id)


@router.put("/{cliente_id}", response_model=ClienteResponseDTO)
def update_cliente(cliente_id: int, payload: UpdateClienteSchema, db: Session = Depends(get_db)):
    return ClienteService(db).update(cliente_id, UpdateClienteDTO(**payload.model_dump(exclude_unset=True)))


@router.delete("/{cliente_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_cliente(cliente_id: int, db: Session = Depends(get_db)):
    ClienteService(db).delete(cliente_id)
