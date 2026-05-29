from pydantic import BaseModel


class CreatePedidoDTO(BaseModel):
    cliente_id: int
    restaurante_id: int
    repartidor_id: int | None = None
    cupon_id: int | None = None
    estado: str | None = "pendiente"
    subtotal: float
    total: float
    direccion_entrega: str
    codigo_postal_entrega: str


class UpdatePedidoDTO(BaseModel):
    cliente_id: int | None = None
    restaurante_id: int | None = None
    repartidor_id: int | None = None
    cupon_id: int | None = None
    estado: str | None = None
    subtotal: float | None = None
    total: float | None = None
    direccion_entrega: str | None = None
    codigo_postal_entrega: str | None = None


class DeletePedidoDTO(BaseModel):
    id: int


class GetPedidoDTO(BaseModel):
    id: int


class PedidoResponseDTO(BaseModel):
    id: int
    cliente_id: int
    restaurante_id: int
    repartidor_id: int | None = None
    cupon_id: int | None = None
    fecha: str
    estado: str
    subtotal: float
    total: float
    direccion_entrega: str
    codigo_postal_entrega: str

    model_config = {"from_attributes": True}