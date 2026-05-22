from pydantic import BaseModel


class CreatePedidoPlatoDTO(BaseModel):
    pedido_id: int
    plato_id: int
    cantidad: int
    precio_unitario: int


class UpdatePedidoPlatoDTO(BaseModel):
    pedido_id: int | None = None
    plato_id: int | None = None
    cantidad: int | None = None
    precio_unitario: int | None = None


class DeletePedidoPlatoDTO(BaseModel):
    id: int


class GetPedidoPlatoDTO(BaseModel):
    id: int


class PedidoPlatoResponseDTO(BaseModel):
    id: int
    pedido_id: int
    plato_id: int
    cantidad: int
    precio_unitario: int

    model_config = {"from_attributes": True}