from pydantic import BaseModel, Field


class CreatePedidoPlatoSchema(BaseModel):
    pedido_id: int = Field(gt=0)
    plato_id: int = Field(gt=0)
    cantidad: int = Field(gt=0)
    precio_unitario: int = Field(ge=0)


class UpdatePedidoPlatoSchema(BaseModel):
    pedido_id: int | None = Field(default=None, gt=0)
    plato_id: int | None = Field(default=None, gt=0)
    cantidad: int | None = Field(default=None, gt=0)
    precio_unitario: int | None = Field(default=None, ge=0)