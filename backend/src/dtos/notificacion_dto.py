from pydantic import BaseModel


class NotificacionResponseDTO(BaseModel):
    id: int
    pedido_id: int
    estado_nuevo: str
    leida: bool
    fecha: str

    model_config = {"from_attributes": True}
