from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.db.connection import get_db
from src.dtos.cupones_dto import CreateCuponDTO, UpdateCuponDTO, CuponResponseDTO
from src.schemas.cupones_schemas import CreateCuponSchema, UpdateCuponSchema, ValidarCuponSchema
from src.services.cupones_service import CuponService

router = APIRouter(prefix="/cupones", tags=["cupones"])


@router.post("/validar", response_model=CuponResponseDTO)
def validar_cupon(payload: ValidarCuponSchema, db: Session = Depends(get_db)):
    return CuponService(db).validar(payload.codigo)


@router.post("/", response_model=CuponResponseDTO, status_code=status.HTTP_201_CREATED)
def create_cupon(payload: CreateCuponSchema, db: Session = Depends(get_db)):
    return CuponService(db).create(CreateCuponDTO(**payload.model_dump()))


@router.get("/", response_model=list[CuponResponseDTO])
def list_cupones(db: Session = Depends(get_db)):
    return CuponService(db).list_all()


@router.get("/{cupon_id}", response_model=CuponResponseDTO)
def get_cupon(cupon_id: int, db: Session = Depends(get_db)):
    return CuponService(db).get_by_id(cupon_id)


@router.put("/{cupon_id}", response_model=CuponResponseDTO)
def update_cupon(cupon_id: int, payload: UpdateCuponSchema, db: Session = Depends(get_db)):
    return CuponService(db).update(cupon_id, UpdateCuponDTO(**payload.model_dump(exclude_unset=True)))


@router.delete("/{cupon_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_cupon(cupon_id: int, db: Session = Depends(get_db)):
    CuponService(db).delete(cupon_id)
