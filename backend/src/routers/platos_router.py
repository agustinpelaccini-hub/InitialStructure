from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from src.db.connection import get_db
from src.dtos.platos_dto import CreatePlatoDTO, UpdatePlatoDTO, PlatoResponseDTO
from src.schemas.platos_schema import CreatePlatoSchema, UpdatePlatoSchema
from src.services.platos_service import PlatoService

router = APIRouter(prefix="/platos", tags=["platos"])


@router.get("/top")
def top_platos(db: Session = Depends(get_db)):
    return PlatoService(db).top()


@router.post("/", response_model=PlatoResponseDTO, status_code=status.HTTP_201_CREATED)
def create_plato(payload: CreatePlatoSchema, db: Session = Depends(get_db)):
    return PlatoService(db).create(CreatePlatoDTO(**payload.model_dump()))


@router.get("/", response_model=list[PlatoResponseDTO])
def list_platos(restaurante_id: int | None = Query(None), db: Session = Depends(get_db)):
    return PlatoService(db).list_all(restaurante_id=restaurante_id)


@router.get("/{plato_id}", response_model=PlatoResponseDTO)
def get_plato(plato_id: int, db: Session = Depends(get_db)):
    return PlatoService(db).get_by_id(plato_id)


@router.put("/{plato_id}", response_model=PlatoResponseDTO)
def update_plato(plato_id: int, payload: UpdatePlatoSchema, db: Session = Depends(get_db)):
    return PlatoService(db).update(plato_id, UpdatePlatoDTO(**payload.model_dump(exclude_unset=True)))


@router.delete("/{plato_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_plato(plato_id: int, db: Session = Depends(get_db)):
    PlatoService(db).delete(plato_id)
