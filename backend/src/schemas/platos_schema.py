from pydantic import BaseModel, Field


class CreatePlatoSchema(BaseModel):
    nombre: str = Field(min_length=1)
    descripcion: str | None = Field(default=None)
    precio: float = Field(gt=0)
    disponible: bool | None = Field(default=True)


class CreatePlatoForRestauranteSchema(BaseModel):
    nombre: str = Field(min_length=1)
    descripcion: str | None = Field(default=None)
    precio: float = Field(gt=0)
    disponible: bool | None = Field(default=True)


class UpdatePlatoSchema(BaseModel):
    restaurante_id: int | None = Field(default=None, gt=0)
    nombre: str | None = Field(default=None, min_length=1)
    descripcion: str | None = Field(default=None)
    precio: float | None = Field(default=None, gt=0)
    disponible: bool | None = Field(default=None)