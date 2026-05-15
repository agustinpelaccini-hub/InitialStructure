from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.db.connection import get_db
from src.dtos.restaurantes_dto import CreateRestaurantDTO, UpdateRestaurantDTO, GetRestaurantDTO, DeleteRestaurantDTO, RestaurantResponseDTO
from src.schemas.restaurantes_schema import CreateRestaurantesSchema, UpdateRestaurantesSchema
from src.services.restaurantes_service import RestaurantService

router = APIRouter(prefix="/restaurantes", tags=["restaurantes"])


@router.post("/", response_model=RestaurantResponseDTO, status_code=status.HTTP_201_CREATED)
def create_restaurant(payload: CreateRestaurantesSchema, db: Session = Depends(get_db)):
    """Ejemplo completo: valida con Schema, arma DTO, llama al service."""
    dto = CreateRestaurantDTO(**payload.model_dump())
    return RestaurantService(db).create(dto)


@router.get("/{restaurant_id}", response_model=RestaurantResponseDTO)
def get_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    dto = RestaurantService(db).get_by_id(restaurant_id)
    return dto


@router.get("/", response_model=list[RestaurantResponseDTO])
def list_restaurants(db: Session = Depends(get_db)):
    dtos = RestaurantService(db).list_all()
    return dtos


@router.put("/{restaurant_id}", response_model=RestaurantResponseDTO)
def update_restaurant(restaurant_id: int, payload: UpdateRestaurantesSchema, db: Session = Depends(get_db)):
    dto = UpdateRestaurantDTO(**payload.model_dump())
    updated = RestaurantService(db).update(restaurant_id, dto)
    return updated


@router.delete("/{restaurant_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    RestaurantService(db).delete(restaurant_id)
