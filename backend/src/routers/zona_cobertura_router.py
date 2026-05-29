from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from src.db.connection import get_db
from src.dtos.zona_cobertura_dto import CreateZonaCoberturaDTO, ZonaCoberturaResponseDTO
from src.schemas.zona_cobertura_schema import CreateZonaCoberturaSchema
from src.services.zona_cobertura_service import ZonaCoberturaService

router = APIRouter(prefix="/zonas", tags=["zonas"])


@router.post("/", response_model=ZonaCoberturaResponseDTO, status_code=status.HTTP_201_CREATED)
def create_zona(payload: CreateZonaCoberturaSchema, db: Session = Depends(get_db)):
    return ZonaCoberturaService(db).create(CreateZonaCoberturaDTO(**payload.model_dump()))


@router.get("/", response_model=list[ZonaCoberturaResponseDTO])
def list_zonas(restaurante_id: int | None = Query(None), db: Session = Depends(get_db)):
    if restaurante_id:
        return ZonaCoberturaService(db).get_by_restaurante(restaurante_id)
    return ZonaCoberturaService(db).list_all()


@router.get("/{zona_id}", response_model=ZonaCoberturaResponseDTO)
def get_zona(zona_id: int, db: Session = Depends(get_db)):
    return ZonaCoberturaService(db).get_by_id(zona_id)


@router.delete("/{zona_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_zona(zona_id: int, db: Session = Depends(get_db)):
    ZonaCoberturaService(db).delete(zona_id)
