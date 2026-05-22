from pydantic import BaseModel


class CreateNotificacionDTO(BaseModel):
    pedido_id: int
    estado_nuevo: str
    usuario_id: int
    leida: bool | None = False
    precio: int


class UpdateNotificacionDTO(BaseModel):
    pedido_id: int | None = None
    estado_nuevo: str | None = None
    usuario_id: int | None = None
    leida: bool | None = None
    precio: int | None = None


class DeleteNotificacionDTO(BaseModel):
    id: int


class GetNotificacionDTO(BaseModel):
    id: int


class NotificacionResponseDTO(BaseModel):
    id: int
    pedido_id: int
    estado_nuevo: str
    usuario_id: int
    leida: bool
    fecha: str
    precio: int

    model_config = {"from_attributes": True}