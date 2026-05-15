from pydantic import BaseModel, Field


class CreateRestaurantesSchema(BaseModel):
    nombre: str = Field(min_length=1)
    categoria: str = Field(min_length=1)
    direccion: str = Field(min_length=1)
    calificacion: int | None = Field(default=None, ge=0, le=5)
    telefono: str = Field(min_length=1)

class UpdateRestaurantesSchema(BaseModel):
    nombre: str | None = Field(default=None, min_length=1)
    categoria: str | None = Field(default=None, min_length=1)
    direccion: str | None = Field(default=None, min_length=1)
    calificacion: int | None = Field(default=None, ge=0, le=5)
    telefono: str | None = Field(default=None, min_length=1)

