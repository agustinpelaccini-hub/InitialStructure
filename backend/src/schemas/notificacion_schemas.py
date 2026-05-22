from pydantic import BaseModel, Field


class CreateNotificacionSchema(BaseModel):
    pedido_id: int = Field(gt=0)
    estado_nuevo: str = Field(min_length=1)
    usuario_id: int = Field(gt=0)
    leida: bool | None = Field(default=False)
    precio: int = Field(ge=0)


class UpdateNotificacionSchema(BaseModel):
    pedido_id: int | None = Field(default=None, gt=0)
    estado_nuevo: str | None = Field(default=None, min_length=1)
    usuario_id: int | None = Field(default=None, gt=0)
    leida: bool | None = Field(default=None)
    precio: int | None = Field(default=None, ge=0)