from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from src.db.connection import get_db
from src.dtos.restaurantes_dto import CreateRestaurantDTO, UpdateRestaurantDTO, RestaurantResponseDTO
from src.dtos.platos_dto import CreatePlatoDTO
from src.schemas.restaurantes_schema import CreateRestaurantesSchema, UpdateRestaurantesSchema
from src.schemas.platos_schema import CreatePlatoSchema, CreatePlatoForRestauranteSchema
from src.services.restaurantes_service import RestaurantService
from src.services.platos_service import PlatoService
from src.services.pedido_service import PedidoService

router = APIRouter(prefix="/restaurantes", tags=["restaurantes"])


@router.post("/", response_model=RestaurantResponseDTO, status_code=status.HTTP_201_CREATED)
def create_restaurant(payload: CreateRestaurantesSchema, db: Session = Depends(get_db)):
    dto = CreateRestaurantDTO(**payload.model_dump())
    return RestaurantService(db).create(dto)


@router.get("/top")
def top_restaurants(db: Session = Depends(get_db)):
    return RestaurantService(db).top()


@router.get("/", response_model=list[RestaurantResponseDTO])
def list_restaurants(
    q: str | None = Query(None),
    categoria: str | None = Query(None),
    codigo_postal: str | None = Query(None),
    db: Session = Depends(get_db),
):
    return RestaurantService(db).list_all(q=q, categoria=categoria, codigo_postal=codigo_postal)


@router.get("/{restaurant_id}", response_model=RestaurantResponseDTO)
def get_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    return RestaurantService(db).get_by_id(restaurant_id)


@router.get("/{restaurant_id}/menu")
def get_menu(restaurant_id: int, db: Session = Depends(get_db)):
    return RestaurantService(db).menu_disponible(restaurant_id)


@router.get("/{restaurant_id}/platos")
def get_platos(restaurant_id: int, db: Session = Depends(get_db)):
    return PlatoService(db).list_all(restaurante_id=restaurant_id)


@router.post("/{restaurant_id}/platos", status_code=status.HTTP_201_CREATED)
def create_plato(restaurant_id: int, payload: CreatePlatoForRestauranteSchema, db: Session = Depends(get_db)):
    data = payload.model_dump()
    data["restaurante_id"] = restaurant_id
    return PlatoService(db).create(CreatePlatoDTO(**data))


@router.get("/{restaurant_id}/pedidos")
def pedidos_restaurante(restaurant_id: int, db: Session = Depends(get_db)):
    from src.repositories.pedido_repository import PedidoRepository
    from src.services.pedido_service import PedidoService

    svc = PedidoService(db)
    pedidos = PedidoRepository(db).find_by_restaurante(restaurant_id)
    return [svc._to_dto(p) for p in pedidos]


@router.get("/{restaurant_id}/reporte")
def reporte(
    restaurant_id: int,
    desde: str = Query(...),
    hasta: str = Query(...),
    db: Session = Depends(get_db),
):
    return RestaurantService(db).reporte(restaurant_id, desde, hasta)


@router.put("/{restaurant_id}", response_model=RestaurantResponseDTO)
def update_restaurant(restaurant_id: int, payload: UpdateRestaurantesSchema, db: Session = Depends(get_db)):
    dto = UpdateRestaurantDTO(**payload.model_dump(exclude_unset=True))
    return RestaurantService(db).update(restaurant_id, dto)


@router.delete("/{restaurant_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    RestaurantService(db).delete(restaurant_id)
