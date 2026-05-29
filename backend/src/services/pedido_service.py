from datetime import datetime, timezone

from sqlalchemy.orm import Session

from src.dtos.pedido_dto import PedidoResponseDTO, UpdatePedidoDTO
from src.repositories.clientes_repository import ClienteRepository
from src.repositories.cupones_repository import CuponRepository
from src.repositories.pedido_plato_repository import PedidoPlatoRepository
from src.repositories.pedido_repository import PedidoRepository
from src.repositories.platos_repository import PlatoRepository
from src.repositories.repartidor_repository import RepartidorRepository
from src.repositories.restaurantes_repository import RestaurantRepository
from src.repositories.zonas_cobertura_repository import ZonaCoberturaRepository
from src.repositories.notificacion_repository import NotificacionRepository
from src.utils.errors import BadRequestError, ConflictError, NotFoundError

ESTADOS_FINALES = {"entregado", "cancelado"}
TRANSICIONES = {
    "pendiente": {"confirmado", "cancelado"},
    "confirmado": {"en_preparacion", "cancelado"},
    "en_preparacion": {"en_camino", "cancelado"},
    "en_camino": {"entregado", "cancelado"},
    "sin_repartidor": {"confirmado", "cancelado"},
    "entregado": set(),
    "cancelado": set(),
}


class PedidoService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = PedidoRepository(db)
        self.items_repo = PedidoPlatoRepository(db)
        self.platos_repo = PlatoRepository(db)
        self.zonas_repo = ZonaCoberturaRepository(db)
        self.repartidor_repo = RepartidorRepository(db)
        self.cupon_repo = CuponRepository(db)
        self.rest_repo = RestaurantRepository(db)
        self.notif_repo = NotificacionRepository(db)

    def _to_dto(self, pedido, items=None) -> dict:
        base = {
            "id": pedido.id,
            "cliente_id": pedido.cliente_id,
            "restaurante_id": pedido.restaurante_id,
            "repartidor_id": pedido.repartidor_id,
            "cupon_id": pedido.cupon_id,
            "fecha": str(pedido.fecha),
            "estado": pedido.estado,
            "subtotal": float(pedido.subtotal),
            "total": float(pedido.total),
            "direccion_entrega": pedido.direccion_entrega,
            "codigo_postal_entrega": pedido.codigo_postal_entrega,
        }
        if items is not None:
            line_items = []
            for it in items:
                sub = float(it.precio_unitario) * it.cantidad
                line_items.append(
                    {
                        "plato_id": it.plato_id,
                        "cantidad": it.cantidad,
                        "precio_unitario": float(it.precio_unitario),
                        "subtotal": round(sub, 2),
                    }
                )
            base["items"] = line_items
        return base

    def create_with_items(self, payload: dict) -> dict:
        cliente_id = payload["cliente_id"]
        restaurante_id = payload["restaurante_id"]
        direccion = payload["direccion_entrega"]
        cp = payload.get("codigo_postal_entrega", "")
        items_in = payload.get("items", [])
        cupon_codigo = payload.get("cupon_codigo")

        if not items_in:
            raise BadRequestError("El pedido debe tener al menos un plato")

        # Validación de zona de cobertura deshabilitada
        # if not self.zonas_repo.covers_postal(restaurante_id, cp):
        #     raise BadRequestError("La dirección está fuera de la zona de cobertura del restaurante")

        subtotal = 0.0
        line_data = []
        for item in items_in:
            plato = self.platos_repo.find_by_id(item["plato_id"])
            if not plato:
                raise NotFoundError(f"Plato {item['plato_id']} no encontrado")
            if plato.restaurante_id != restaurante_id:
                raise BadRequestError("Todos los platos deben ser del mismo restaurante")
            if not plato.disponible:
                raise BadRequestError(f"El plato '{plato.nombre}' no está disponible")
            cantidad = item["cantidad"]
            if cantidad <= 0:
                raise BadRequestError("La cantidad debe ser mayor a 0")
            precio = float(plato.precio)
            subtotal += precio * cantidad
            line_data.append((plato.id, cantidad, precio))

        cupon_id = None
        if cupon_codigo:
            cupon = self.cupon_repo.find_by_codigo(cupon_codigo)
            if not cupon:
                raise BadRequestError("Cupón inválido")
            if cupon.usos_actuales >= cupon.usos_maximos:
                raise BadRequestError("Cupón sin usos disponibles")
            if cupon.fecha_vencimiento < datetime.now(timezone.utc).strftime("%Y-%m-%d"):
                raise BadRequestError("Cupón vencido")
            desc = subtotal * (cupon.porcentaje_descuento / 100)
            subtotal_after = subtotal - desc
            cupon_id = cupon.id
        else:
            subtotal_after = subtotal

        pedido = self.repo.create(
            cliente_id=cliente_id,
            restaurante_id=restaurante_id,
            repartidor_id=None,
            cupon_id=cupon_id,
            estado="pendiente",
            subtotal=round(subtotal, 2),
            total=round(subtotal_after, 2),
            direccion_entrega=direccion,
            codigo_postal_entrega=cp,
        )

        for plato_id, cantidad, precio in line_data:
            self.items_repo.create(pedido.id, plato_id, cantidad, precio)

        # Asignar repartidor al azar automáticamente (pero dejar estado pendiente para que restaurante confirme)
        disponibles = self.repartidor_repo.find_disponibles()
        if disponibles:
            rep = disponibles[0]
            self.repartidor_repo.update(rep.id, disponible=False)
            pedido = self.repo.update(pedido.id, repartidor_id=rep.id)

        return self.get_detail(pedido.id)

    def get_detail(self, pedido_id: int) -> dict:
        pedido = self.repo.find_by_id(pedido_id)
        if not pedido:
            raise NotFoundError(f"Pedido {pedido_id} no encontrado")
        items = self.items_repo.find_by_pedido(pedido_id)
        return self._to_dto(pedido, items)

    def list_all(self, limit: int | None = None) -> list[dict]:
        return [self._to_dto(p) for p in self.repo.list_all(limit=limit)]

    def get_by_cliente(self, cliente_id: int, estado: str | None = None) -> dict:
        pedidos = self.repo.find_by_cliente(cliente_id, estado)
        total_gastado = sum(float(p.total) for p in pedidos if p.estado == "entregado")
        return {
            "pedidos": [self._to_dto(p) for p in pedidos],
            "total_gastado": round(total_gastado, 2),
        }

    def asignar_repartidor(self, pedido_id: int, repartidor_id: int | None = None) -> dict:
        pedido = self.repo.find_by_id(pedido_id)
        if not pedido:
            raise NotFoundError(f"Pedido {pedido_id} no encontrado")
        if pedido.estado in ESTADOS_FINALES:
            raise BadRequestError("No se puede asignar repartidor a un pedido finalizado")

        if repartidor_id:
            # Asignación manual de repartidor específico
            rep = self.repartidor_repo.find_by_id(repartidor_id)
            if not rep:
                raise NotFoundError(f"Repartidor {repartidor_id} no encontrado")
            self.repartidor_repo.update(rep.id, disponible=False)
            pedido = self.repo.update(pedido_id, repartidor_id=rep.id)
            return self._to_dto(pedido)

        # Asignación automática de repartidor disponible
        disponibles = self.repartidor_repo.find_disponibles()
        if not disponibles:
            pedido = self.repo.update(pedido_id, estado="sin_repartidor")
            self.notif_repo.create(pedido_id, "sin_repartidor")
            return self._to_dto(pedido)

        rep = disponibles[0]
        self.repartidor_repo.update(rep.id, disponible=False)
        pedido = self.repo.update(pedido_id, repartidor_id=rep.id)
        return self._to_dto(pedido)

    def cambiar_estado(self, pedido_id: int, nuevo_estado: str) -> dict:
        pedido = self.repo.find_by_id(pedido_id)
        if not pedido:
            raise NotFoundError(f"Pedido {pedido_id} no encontrado")
        
        # Permitir transición al mismo estado (no hacer nada)
        if pedido.estado == nuevo_estado:
            return self._to_dto(pedido)
        
        permitidos = TRANSICIONES.get(pedido.estado, set())
        if nuevo_estado not in permitidos:
            raise BadRequestError(
                f"Transición inválida de '{pedido.estado}' a '{nuevo_estado}'"
            )

        prev = pedido.estado
        pedido = self.repo.update(pedido_id, estado=nuevo_estado)
        self.notif_repo.create(pedido_id, nuevo_estado)

        if nuevo_estado == "confirmado" and pedido.cupon_id:
            cupon = self.cupon_repo.find_by_id(pedido.cupon_id)
            if cupon:
                self.cupon_repo.update(cupon.id, usos_actuales=cupon.usos_actuales + 1)

        if nuevo_estado == "entregado" and pedido.repartidor_id:
            self.repartidor_repo.update(pedido.repartidor_id, disponible=True)

        if prev == "confirmado" and nuevo_estado == "cancelado" and pedido.cupon_id:
            cupon = self.cupon_repo.find_by_id(pedido.cupon_id)
            if cupon and cupon.usos_actuales > 0:
                self.cupon_repo.update(cupon.id, usos_actuales=cupon.usos_actuales - 1)

        return self._to_dto(pedido)

    def update(self, pedido_id: int, dto: UpdatePedidoDTO) -> dict:
        pedido = self.repo.find_by_id(pedido_id)
        if not pedido:
            raise NotFoundError(f"Pedido {pedido_id} no encontrado")

        data = dto.model_dump(exclude_unset=True)
        if "estado" in data:
            return self.cambiar_estado(pedido_id, data["estado"])
        if "repartidor_id" in data and data["repartidor_id"]:
            return self.asignar_repartidor(pedido_id)

        # Validación de estados finales deshabilitada temporalmente
        # if pedido.estado in ESTADOS_FINALES:
        #     raise BadRequestError("El pedido no puede modificarse")

        pedido = self.repo.update(pedido_id, **data)
        return self._to_dto(pedido)

    def delete(self, pedido_id: int) -> None:
        if not self.repo.delete(pedido_id):
            raise NotFoundError(f"Pedido {pedido_id} no encontrado")
