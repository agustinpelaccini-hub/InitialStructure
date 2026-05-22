from pydantic import BaseModel, Field


class CreatePedidoSchema(BaseModel):
    cliente_id: int = Field(gt=0)
    restaurante_id: int = Field(gt=0)
    repartidor_id: int | None = Field(default=None, gt=0)
    cupon_id: int | None = Field(default=None, gt=0)
    estado: str | None = Field(default="pendiente")
    subtotal: int = Field(ge=0)
    total: int = Field(ge=0)
    direccion_entrega: str = Field(min_length=1)
    codigo_postal_entrega: str = Field(min_length=1)


class UpdatePedidoSchema(BaseModel):
    cliente_id: int | None = Field(default=None, gt=0)
    restaurante_id: int | None = Field(default=None, gt=0)
    repartidor_id: int | None = Field(default=None, gt=0)
    cupon_id: int | None = Field(default=None, gt=0)
    estado: str | None = Field(default=None)
    subtotal: int | None = Field(default=None, ge=0)
    total: int | None = Field(default=None, ge=0)
    direccion_entrega: str | None = Field(default=None, min_length=1)
    codigo_postal_entrega: str | None = Field(default=None, min_length=1)