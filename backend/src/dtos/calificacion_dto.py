from pydantic import BaseModel


class CreateCalificacionDTO(BaseModel):
    pedido_id: int
    puntaje: int
    comentario: str | None = None
    cliente_id: int | None = None


class CalificacionResponseDTO(BaseModel):
    id: int
    pedido_id: int
    puntaje: int
    comentario: str | None = None
    fecha: str

    model_config = {"from_attributes": True}
