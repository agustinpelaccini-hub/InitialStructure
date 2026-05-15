from sqlalchemy.orm import Session

from src.db.models.resturantes_model import Restaurantes


class RestaurantRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, nombre: str, categoria: str, direccion: str, calificacion: int | None, telefono: str) -> Restaurantes:
        restaurant = Restaurantes(nombre=nombre, categoria=categoria, direccion=direccion, calificacion=calificacion, telefono=telefono)
        self.db.add(restaurant)
        self.db.commit()
        self.db.refresh(restaurant)
        return restaurant

    def find_by_id(self, restaurant_id: int) -> Restaurantes | None:
        return self.db.query(Restaurantes).filter(Restaurantes.id == restaurant_id).first()

    def list_all(self) -> list[Restaurantes]:
        return self.db.query(Restaurantes).all()

    def update(self, restaurant_id: int, **fields) -> Restaurantes | None:
        restaurant = self.db.query(Restaurantes).filter(Restaurantes.id == restaurant_id).first()
        if not restaurant:
            return None
        for key, value in fields.items():
            setattr(restaurant, key, value)
        self.db.commit()
        self.db.refresh(restaurant)
        return restaurant

    def delete(self, restaurant_id: int) -> bool:
        restaurant = self.db.query(Restaurantes).filter(Restaurantes.id == restaurant_id).first()
        if not restaurant:
            return False
        self.db.delete(restaurant)
        self.db.commit()
        return True