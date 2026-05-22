from pydantic import BaseModel, Field


class CreateRepartidorSchema(BaseModel):
    nombre: str = Field(min_length=1)
    telefono: int = Field(gt=0)
    role: str | None = Field(default="repartidor")
    vehiculo: str = Field(min_length=1)
    disponible: bool | None = Field(default=True)


class UpdateRepartidorSchema(BaseModel):
    nombre: str | None = Field(default=None, min_length=1)
    telefono: int | None = Field(default=None, gt=0)
    role: str | None = Field(default=None)
    vehiculo: str | None = Field(default=None, min_length=1)
    disponible: bool | None = Field(default=None)