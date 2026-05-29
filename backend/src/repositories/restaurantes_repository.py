from sqlalchemy import func
from sqlalchemy.orm import Session

from src.db.models.pedido_model import Pedidos
from src.db.models.pedido_plato_model import PedidoPlato
from src.db.models.platos_model import Platos
from src.db.models.resturantes_model import Restaurantes
from src.db.models.zonas_cobertura_model import ZonasCobertura


class RestaurantRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        nombre: str,
        categoria: str,
        direccion: str,
        calificacion_promedio: float = 0,
    ) -> Restaurantes:
        restaurant = Restaurantes(
            nombre=nombre,
            categoria=categoria,
            direccion=direccion,
            calificacion_promedio=calificacion_promedio,
        )
        self.db.add(restaurant)
        self.db.commit()
        self.db.refresh(restaurant)
        return restaurant

    def find_by_id(self, restaurant_id: int) -> Restaurantes | None:
        return self.db.query(Restaurantes).filter(Restaurantes.id == restaurant_id).first()

    def list_all(self) -> list[Restaurantes]:
        return self.db.query(Restaurantes).all()

    def search(
        self,
        q: str | None = None,
        categoria: str | None = None,
        codigo_postal: str | None = None,
    ) -> list[Restaurantes]:
        query = self.db.query(Restaurantes)
        if q:
            query = query.filter(Restaurantes.nombre.ilike(f"%{q}%"))
        if categoria:
            query = query.filter(Restaurantes.categoria == categoria)
        if codigo_postal:
            query = query.join(ZonasCobertura).filter(
                ZonasCobertura.codigo_postal == codigo_postal
            )
        return query.order_by(Restaurantes.calificacion_promedio.desc()).all()

    def top_by_entregas(self, limit: int = 5) -> list[tuple[Restaurantes, int]]:
        rows = (
            self.db.query(Restaurantes, func.count(Pedidos.id).label("cnt"))
            .join(Pedidos, Pedidos.restaurante_id == Restaurantes.id)
            .filter(Pedidos.estado == "entregado")
            .group_by(Restaurantes.id)
            .order_by(func.count(Pedidos.id).desc())
            .limit(limit)
            .all()
        )
        return rows

    def update(self, restaurant_id: int, **fields) -> Restaurantes | None:
        restaurant = self.find_by_id(restaurant_id)
        if not restaurant:
            return None
        for key, value in fields.items():
            setattr(restaurant, key, value)
        self.db.commit()
        self.db.refresh(restaurant)
        return restaurant

    def delete(self, restaurant_id: int) -> bool:
        restaurant = self.find_by_id(restaurant_id)
        if not restaurant:
            return False
        self.db.delete(restaurant)
        self.db.commit()
        return True

    def recalc_rating(self, restaurante_id: int) -> None:
        from src.db.models.calificacion_model import Calificacion

        avg = (
            self.db.query(func.avg(Calificacion.puntaje))
            .join(Pedidos, Pedidos.id == Calificacion.pedido_id)
            .filter(Pedidos.restaurante_id == restaurante_id)
            .scalar()
        )
        rest = self.find_by_id(restaurante_id)
        if rest:
            rest.calificacion_promedio = round(float(avg or 0), 2)
            self.db.commit()

    def reporte(self, restaurante_id: int, desde: str, hasta: str) -> dict:
        pedidos = (
            self.db.query(Pedidos)
            .filter(
                Pedidos.restaurante_id == restaurante_id,
                Pedidos.estado == "entregado",
                Pedidos.fecha >= desde,
                Pedidos.fecha <= hasta,
            )
            .all()
        )
        cantidad = len(pedidos)
        facturacion = sum(float(p.total) for p in pedidos)
        ticket = facturacion / cantidad if cantidad else 0

        top_platos = (
            self.db.query(
                Platos.nombre,
                func.sum(PedidoPlato.cantidad).label("qty"),
            )
            .join(PedidoPlato, PedidoPlato.plato_id == Platos.id)
            .join(Pedidos, Pedidos.id == PedidoPlato.pedido_id)
            .filter(
                Pedidos.restaurante_id == restaurante_id,
                Pedidos.estado == "entregado",
                Pedidos.fecha >= desde,
                Pedidos.fecha <= hasta,
            )
            .group_by(Platos.id, Platos.nombre)
            .order_by(func.sum(PedidoPlato.cantidad).desc())
            .limit(5)
            .all()
        )
        return {
            "pedidos_entregados": cantidad,
            "facturacion_total": round(facturacion, 2),
            "ticket_promedio": round(ticket, 2),
            "top_platos": [{"nombre": n, "cantidad": int(q)} for n, q in top_platos],
        }
