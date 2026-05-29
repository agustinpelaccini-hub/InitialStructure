from pydantic import BaseModel, Field


class CreateRestaurantDTO(BaseModel):
    nombre: str
    categoria: str
    direccion: str
    calificacion_promedio: float | None = 0


class UpdateRestaurantDTO(BaseModel):
    nombre: str | None = None
    categoria: str | None = None
    direccion: str | None = None
    calificacion_promedio: float | None = None


class RestaurantResponseDTO(BaseModel):
    id: int
    nombre: str
    categoria: str
    direccion: str
    calificacion_promedio: float = 0

    model_config = {"from_attributes": True}
