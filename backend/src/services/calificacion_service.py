from sqlalchemy.orm import Session

from src.dtos.calificacion_dto import CreateCalificacionDTO, CalificacionResponseDTO
from src.mappers.calificacion_mapper import to_calificacion_response
from src.repositories.calificacion_repository import CalificacionRepository
from src.repositories.pedido_repository import PedidoRepository
from src.repositories.restaurantes_repository import RestaurantRepository
from src.utils.errors import BadRequestError, ConflictError, NotFoundError


class CalificacionService:
    def __init__(self, db: Session):
        self.repo = CalificacionRepository(db)
        self.pedidos_repo = PedidoRepository(db)
        self.rest_repo = RestaurantRepository(db)

    def create(self, dto: CreateCalificacionDTO) -> CalificacionResponseDTO:
        pedido = self.pedidos_repo.find_by_id(dto.pedido_id)
        if not pedido:
            raise NotFoundError(f"Pedido {dto.pedido_id} no encontrado")
        if pedido.estado != "entregado":
            raise BadRequestError("Solo se pueden calificar pedidos entregados")
        if self.repo.find_by_pedido(dto.pedido_id):
            raise ConflictError("Este pedido ya fue calificado")
        if dto.puntaje < 1 or dto.puntaje > 5:
            raise BadRequestError("El puntaje debe estar entre 1 y 5")

        cal = self.repo.create(dto.pedido_id, dto.puntaje, dto.comentario)
        self.rest_repo.recalc_rating(pedido.restaurante_id)
        return to_calificacion_response(cal)

    def get_by_id(self, calificacion_id: int) -> CalificacionResponseDTO:
        cal = self.repo.find_by_id(calificacion_id)
        if not cal:
            raise NotFoundError(f"Calificación {calificacion_id} no encontrada")
        return to_calificacion_response(cal)

    def list_all(self) -> list[CalificacionResponseDTO]:
        return [to_calificacion_response(c) for c in self.repo.list_all()]
