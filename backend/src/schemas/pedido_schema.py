from pydantic import BaseModel, Field


class PedidoItemSchema(BaseModel):
    plato_id: int = Field(gt=0)
    cantidad: int = Field(gt=0)


class CreatePedidoSchema(BaseModel):
    cliente_id: int = Field(gt=0)
    restaurante_id: int = Field(gt=0)
    direccion_entrega: str = Field(min_length=1)
    codigo_postal_entrega: str = Field(min_length=1)
    items: list[PedidoItemSchema] = Field(min_length=1)
    cupon_codigo: str | None = None


class UpdatePedidoSchema(BaseModel):
    estado: str | None = None
    repartidor_id: int | None = None


class PatchEstadoSchema(BaseModel):
    estado: str
