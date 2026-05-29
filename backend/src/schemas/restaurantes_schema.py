from pydantic import BaseModel, Field


class CreateRestaurantesSchema(BaseModel):
    nombre: str = Field(min_length=1)
    categoria: str = Field(min_length=1)
    direccion: str = Field(min_length=1)
    calificacion_promedio: float | None = Field(default=0, ge=0, le=5)


class UpdateRestaurantesSchema(BaseModel):
    nombre: str | None = Field(default=None, min_length=1)
    categoria: str | None = Field(default=None, min_length=1)
    direccion: str | None = Field(default=None, min_length=1)
    calificacion_promedio: float | None = Field(default=None, ge=0, le=5)
