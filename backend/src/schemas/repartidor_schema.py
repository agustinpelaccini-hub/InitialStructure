from pydantic import BaseModel, Field


class CreateRepartidorSchema(BaseModel):
    nombre: str = Field(min_length=1)
    vehiculo: str = Field(min_length=1)
    disponible: bool | None = Field(default=True)


class UpdateRepartidorSchema(BaseModel):
    nombre: str | None = Field(default=None, min_length=1)
    vehiculo: str | None = Field(default=None, min_length=1)
    disponible: bool | None = Field(default=None)
