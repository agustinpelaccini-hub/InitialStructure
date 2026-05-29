from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.db.connection import get_db
from src.dtos.repartidor_dto import CreateRepartidorDTO, UpdateRepartidorDTO, RepartidorResponseDTO
from src.schemas.repartidor_schema import CreateRepartidorSchema, UpdateRepartidorSchema
from src.services.repartidor_service import RepartidorService
from src.services.pedido_service import PedidoService

router = APIRouter(prefix="/repartidores", tags=["repartidores"])


@router.get("/disponibles", response_model=list[RepartidorResponseDTO])
def disponibles(db: Session = Depends(get_db)):
    return RepartidorService(db).get_disponibles()


@router.post("/", response_model=RepartidorResponseDTO, status_code=status.HTTP_201_CREATED)
def create_repartidor(payload: CreateRepartidorSchema, db: Session = Depends(get_db)):
    return RepartidorService(db).create(CreateRepartidorDTO(**payload.model_dump()))


@router.get("/", response_model=list[RepartidorResponseDTO])
def list_repartidores(db: Session = Depends(get_db)):
    return RepartidorService(db).list_all()


@router.get("/{repartidor_id}/pedidos")
def pedidos_repartidor(repartidor_id: int, db: Session = Depends(get_db)):
    from src.repositories.pedido_repository import PedidoRepository

    svc = PedidoService(db)
    pedidos = PedidoRepository(db).find_by_repartidor(repartidor_id)
    return [svc._to_dto(p) for p in pedidos]


@router.get("/{repartidor_id}", response_model=RepartidorResponseDTO)
def get_repartidor(repartidor_id: int, db: Session = Depends(get_db)):
    return RepartidorService(db).get_by_id(repartidor_id)


@router.put("/{repartidor_id}", response_model=RepartidorResponseDTO)
def update_repartidor(repartidor_id: int, payload: UpdateRepartidorSchema, db: Session = Depends(get_db)):
    return RepartidorService(db).update(repartidor_id, UpdateRepartidorDTO(**payload.model_dump(exclude_unset=True)))


@router.delete("/{repartidor_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_repartidor(repartidor_id: int, db: Session = Depends(get_db)):
    RepartidorService(db).delete(repartidor_id)
