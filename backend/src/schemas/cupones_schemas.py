from pydantic import BaseModel, Field


class CreateCuponSchema(BaseModel):
    codigo: str = Field(min_length=1)
    porcentaje_descuento: int = Field(ge=1, le=100)
    fecha_vencimiento: str = Field(min_length=1)
    usos_maximos: int = Field(gt=0)
    usos_actuales: int | None = Field(default=0, ge=0)


class UpdateCuponSchema(BaseModel):
    codigo: str | None = Field(default=None, min_length=1)
    porcentaje_descuento: int | None = Field(default=None, ge=1, le=100)
    fecha_vencimiento: str | None = Field(default=None, min_length=1)
    usos_maximos: int | None = Field(default=None, gt=0)
    usos_actuales: int | None = Field(default=None, ge=0)


class ValidarCuponSchema(BaseModel):
    codigo: str
