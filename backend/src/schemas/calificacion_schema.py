from pydantic import BaseModel, Field


class CreateCalificacionSchema(BaseModel):
    pedido_id: int = Field(gt=0)
    puntaje: int = Field(ge=1, le=5)
    comentario: str | None = Field(default=None)
    cliente_id: int | None = Field(default=None, gt=0)


class CreateCalificacionForPedidoSchema(BaseModel):
    puntaje: int = Field(ge=1, le=5)
    comentario: str | None = Field(default=None)
    cliente_id: int | None = Field(default=None, gt=0)
