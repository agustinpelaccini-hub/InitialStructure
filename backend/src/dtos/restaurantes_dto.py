from pydantic import BaseModel


class CreateRestaurantDTO(BaseModel):
    nombre: str
    categoria: str
    direccion: str
    calificacion: int | None = None
    telefono: str

class UpdateRestaurantDTO(BaseModel):
    nombre: str | None = None
    categoria: str | None = None
    direccion: str | None = None
    calificacion: int | None = None
    telefono: str | None = None

class DeleteRestaurantDTO(BaseModel):
    id: int

class GetRestaurantDTO(BaseModel):
    id: int

class RestaurantResponseDTO(BaseModel):
    id: int
    nombre: str
    categoria: str
    direccion: str
    calificacion: int | None = None
    telefono: str

    model_config = {"from_attributes": True}