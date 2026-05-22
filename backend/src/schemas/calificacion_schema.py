from pydantic import BaseModel, Field


class CreateCalificacionSchema(BaseModel):
    pedido_id: int = Field(gt=0)
    cliente_id: int = Field(gt=0)
    puntaje: int = Field(ge=1, le=5)
    comentario: str | None = Field(default=None)


class UpdateCalificacionSchema(BaseModel):
    pedido_id: int | None = Field(default=None, gt=0)
    cliente_id: int | None = Field(default=None, gt=0)
    puntaje: int | None = Field(default=None, ge=1, le=5)
    comentario: str | None = Field(default=None)