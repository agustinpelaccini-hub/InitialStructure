from pydantic import BaseModel


class CreateCalificacionDTO(BaseModel):
    pedido_id: int
    cliente_id: int
    puntaje: int
    comentario: str | None = None


class UpdateCalificacionDTO(BaseModel):
    pedido_id: int | None = None
    cliente_id: int | None = None
    puntaje: int | None = None
    comentario: str | None = None


class DeleteCalificacionDTO(BaseModel):
    id: int


class GetCalificacionDTO(BaseModel):
    id: int


class CalificacionResponseDTO(BaseModel):
    id: int
    pedido_id: int
    cliente_id: int
    puntaje: int
    comentario: str | None = None
    fecha: str

    model_config = {"from_attributes": True}