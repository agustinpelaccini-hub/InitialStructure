from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.db.connection import get_db
from src.dtos.calificacion_dto import CreateCalificacionDTO, CalificacionResponseDTO
from src.schemas.calificacion_schema import CreateCalificacionSchema, CreateCalificacionForPedidoSchema
from src.services.calificacion_service import CalificacionService

router = APIRouter(prefix="/calificaciones", tags=["calificaciones"])


@router.post("/", response_model=CalificacionResponseDTO, status_code=status.HTTP_201_CREATED)
def create_calificacion(payload: CreateCalificacionSchema, db: Session = Depends(get_db)):
    return CalificacionService(db).create(CreateCalificacionDTO(**payload.model_dump()))


@router.post("/pedidos/{pedido_id}", response_model=CalificacionResponseDTO, status_code=status.HTTP_201_CREATED)
def calificar_pedido(pedido_id: int, payload: CreateCalificacionForPedidoSchema, db: Session = Depends(get_db)):
    data = payload.model_dump()
    data["pedido_id"] = pedido_id
    return CalificacionService(db).create(CreateCalificacionDTO(**data))


@router.get("/", response_model=list[CalificacionResponseDTO])
def list_calificaciones(db: Session = Depends(get_db)):
    return CalificacionService(db).list_all()
